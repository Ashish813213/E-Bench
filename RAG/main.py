import json
import re
import numpy as np
from pathlib import Path
from typing import List, Optional

import pdfplumber
import faiss

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from sentence_transformers import SentenceTransformer, CrossEncoder
from bytez import Bytez


DOCUMENTS = {
    "BNS": "BNS2023.pdf",
    "BNSS": "BNSS2023.pdf",
    "BSA": "BSA2023.pdf",
    "Motor Vehicles Act": "MotorVehicleAct.pdf",
    "Corporate Laws": "CorporateLaws.pdf"
}

BYTEZ_API_KEY = "9268ffc395909476591c086452f3d86f"
BYTEZ_MODEL = "Qwen/Qwen2.5-7B-Instruct"

SECTION_CACHE = Path("law_sections.json")
EMBED_CACHE = Path("law_embeddings.npy")
FAISS_CACHE = Path("law_faiss.index")

TOP_K_VECTOR = 60
TOP_K_FINAL = 7
RERANK_TEXT_LEN = 2000

VECTOR_WEIGHT = 0.35
RERANK_WEIGHT = 0.65


embed_model = SentenceTransformer("BAAI/bge-base-en-v1.5")
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

sdk = Bytez(BYTEZ_API_KEY)
llm = sdk.model(BYTEZ_MODEL)

app = FastAPI(
    title="Indian Law AI API",
    description="AI Legal Assistant for BNS, BNSS, BSA, Motor Vehicles Act, Corporate Laws",
    version="6.0"
)

SECTIONS = []
INDEX = None


class SearchResult(BaseModel):
    document: str
    section_number: int
    title: str
    snippet: str
    punishment_summary: Optional[str] = None
    rights_summary: Optional[str] = None
    page: int
    score: float
    score_breakdown: Optional[dict] = None


class QueryResponse(BaseModel):
    query: str
    ai_answer: str
    results: List[SearchResult]
    total_found: int
    model_used: str
    user_rights: Optional[List[str]] = None


class AskRequest(BaseModel):
    question: str
    top_k: int = 7


class AskResponse(BaseModel):
    question: str
    ai_answer: str
    supporting_sections: List[SearchResult]
    model_used: str
    user_rights: Optional[List[str]] = None
    legal_steps: Optional[List[str]] = None


def chunk_text(text, chunk_size=220, overlap=40):
    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk = words[i:i + chunk_size]
        if chunk:
            chunks.append(" ".join(chunk))

    return chunks


def extract_sections():

    sections = []

    for doc_name, pdf_path in DOCUMENTS.items():

        try:

            with pdfplumber.open(pdf_path) as pdf:

                current = None
                text_buf = []

                for page_num, page in enumerate(pdf.pages):

                    raw = page.extract_text()

                    if not raw:
                        continue

                    for line in raw.split("\n"):

                        m = re.match(r"^(\d{1,4})\.\s+(.+)", line)

                        if m:

                            if current:

                                full_text = " ".join(text_buf)

                                for c in chunk_text(full_text):

                                    sections.append({
                                        "document": current["document"],
                                        "section": current["section"],
                                        "title": current["title"],
                                        "text": c,
                                        "page": current["page"]
                                    })

                            current = {
                                "document": doc_name,
                                "section": int(m.group(1)),
                                "title": m.group(2),
                                "page": page_num + 1
                            }

                            text_buf = [line]

                        else:
                            text_buf.append(line)

                if current:

                    full_text = " ".join(text_buf)

                    for c in chunk_text(full_text):

                        sections.append({
                            "document": current["document"],
                            "section": current["section"],
                            "title": current["title"],
                            "text": c,
                            "page": current["page"]
                        })

        except Exception as e:
            print("PDF parse error:", pdf_path, e)

    return sections


def build_index():

    global SECTIONS

    if SECTION_CACHE.exists():

        with open(SECTION_CACHE) as f:
            SECTIONS = json.load(f)

    else:

        SECTIONS = extract_sections()

        with open(SECTION_CACHE, "w") as f:
            json.dump(SECTIONS, f)

    corpus = [
        f"{s['document']} Section {s['section']} {s['title']}: {s['text']}"
        for s in SECTIONS
    ]

    if EMBED_CACHE.exists():

        embeddings = np.load(EMBED_CACHE)

    else:

        embeddings = embed_model.encode(
            corpus,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        np.save(EMBED_CACHE, embeddings)

    dim = embeddings.shape[1]

    if FAISS_CACHE.exists():

        index = faiss.read_index(str(FAISS_CACHE))

    else:

        index = faiss.IndexFlatIP(dim)
        index.add(embeddings)
        faiss.write_index(index, str(FAISS_CACHE))

    return index


def retrieve(query, top_k=TOP_K_FINAL):

    qvec = embed_model.encode([query], normalize_embeddings=True)

    raw_scores, ids = INDEX.search(qvec, TOP_K_VECTOR)

    vector_scores = raw_scores[0]

    candidates = [SECTIONS[i] for i in ids[0]]

    pairs = [(query, c["text"][:RERANK_TEXT_LEN]) for c in candidates]

    rerank_raw = reranker.predict(pairs)

    def sigmoid(x):
        return 1 / (1 + np.exp(-x))

    rerank_norm = sigmoid(np.array(rerank_raw))

    v_min, v_max = vector_scores.min(), vector_scores.max()
    v_range = v_max - v_min if v_max != v_min else 1

    vector_norm = (vector_scores - v_min) / v_range

    hybrid = VECTOR_WEIGHT * vector_norm + RERANK_WEIGHT * rerank_norm

    ranked = sorted(
        zip(hybrid, vector_norm, rerank_norm, candidates),
        reverse=True
    )

    ranked = [r for r in ranked if r[0] > 0.35][:top_k]

    results = []

    for h_score, v_score, r_score, sec in ranked:

        results.append({
            "score": float(h_score),
            "score_breakdown": {
                "hybrid": round(float(h_score), 4),
                "vector_similarity": round(float(v_score), 4),
                "reranker_relevance": round(float(r_score), 4)
            },
            "section": sec
        })

    return results


def extract_punishment(text):

    patterns = [
        r"(?:shall be punished|punishable)[^.]{0,250}\.",
        r"imprisonment[^.]{0,200}\.",
        r"fine[^.]{0,150}\.",
        r"death[^.]{0,100}\."
    ]

    for p in patterns:

        m = re.search(p, text, re.IGNORECASE)

        if m:
            return m.group(0).strip()

    return None


SYSTEM_PROMPT = """
You are an expert Indian legal assistant.

Use ONLY the provided legal sections.

Explain the law clearly and cite the Act and Section numbers.
"""


def ask_llm(question, sections):

    context = ""

    for s in sections:

        context += f"\n{s['document']} Section {s['section']} — {s['title']}\n{s['text']}\n"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Question: {question}\n\nRelevant law:\n{context}"
        }
    ]

    result = llm.run(messages, {"temperature": 0})

    if result.error:
        return str(result.error)

    output = result.output

    if isinstance(output, dict):
        return output.get("content", str(output))

    return str(output)


@app.on_event("startup")
def startup():

    global INDEX

    INDEX = build_index()


@app.get("/", response_class=HTMLResponse)
def home():

    return """
    <h1>Indian Law AI Assistant</h1>
    <p>Supports BNS, BNSS, BSA, Motor Vehicles Act, Corporate Laws</p>
    <a href="/docs">API Docs</a>
    """


@app.post("/ask", response_model=AskResponse)
def ask(body: AskRequest):

    ranked = retrieve(body.question, body.top_k)

    sections = [r["section"] for r in ranked]

    ai_answer = ask_llm(body.question, sections)

    results = []

    for r in ranked:

        sec = r["section"]

        results.append(
            SearchResult(
                document=sec["document"],
                section_number=sec["section"],
                title=sec["title"],
                snippet=sec["text"][:400],
                punishment_summary=extract_punishment(sec["text"]),
                page=sec["page"],
                score=r["score"],
                score_breakdown=r["score_breakdown"]
            )
        )

    return AskResponse(
        question=body.question,
        ai_answer=ai_answer,
        supporting_sections=results,
        model_used=BYTEZ_MODEL
    )


@app.get("/query", response_model=QueryResponse)
def query(q: str = Query(...), top_k: int = 7):

    ranked = retrieve(q, top_k)

    sections = [r["section"] for r in ranked]

    ai_answer = ask_llm(q, sections)

    results = []

    for r in ranked:

        sec = r["section"]

        results.append(
            SearchResult(
                document=sec["document"],
                section_number=sec["section"],
                title=sec["title"],
                snippet=sec["text"][:400],
                punishment_summary=extract_punishment(sec["text"]),
                page=sec["page"],
                score=r["score"],
                score_breakdown=r["score_breakdown"]
            )
        )

    return QueryResponse(
        query=q,
        ai_answer=ai_answer,
        results=results,
        total_found=len(results),
        model_used=BYTEZ_MODEL,
        user_rights=None
    )


@app.get("/section/{number}")
def section(number: int):

    matches = [s for s in SECTIONS if s["section"] == number]

    if not matches:
        raise HTTPException(404)

    s = matches[0]

    explanation = ask_llm(
        f"Explain {s['document']} Section {number}",
        [s]
    )

    return {
        "document": s["document"],
        "section": s["section"],
        "title": s["title"],
        "page": s["page"],
        "text": s["text"],
        "punishment_summary": extract_punishment(s["text"]),
        "ai_explanation": explanation
    }


@app.get("/sections")
def list_sections(keyword: Optional[str] = None, limit: int = 20):

    out = []

    for s in SECTIONS:

        if keyword and keyword.lower() not in (s["text"] + s["title"]).lower():
            continue

        out.append({
            "document": s["document"],
            "section": s["section"],
            "title": s["title"],
            "page": s["page"]
        })

        if len(out) >= limit:
            break

    return out


@app.get("/punishment")
def punishment(offense: str):

    ranked = retrieve(offense)

    results = []

    for r in ranked:

        sec = r["section"]

        p = extract_punishment(sec["text"])

        if p:

            results.append({
                "document": sec["document"],
                "section": sec["section"],
                "title": sec["title"],
                "punishment": p
            })

    return results


@app.get("/stats")
def stats():

    doc_counts = {}

    for s in SECTIONS:

        doc_counts[s["document"]] = doc_counts.get(s["document"], 0) + 1

    return {
        "sections_indexed": len(SECTIONS),
        "documents": list(DOCUMENTS.keys()),
        "sections_per_document": doc_counts,
        "vector_model": "bge-base-en-v1.5",
        "reranker": "cross-encoder/ms-marco-MiniLM-L-6-v2",
        "llm": BYTEZ_MODEL
    }