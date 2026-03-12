import re
import numpy as np
from pathlib import Path
from typing import List

import pdfplumber
import faiss
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, CrossEncoder
from bytez import Bytez


DOCUMENTS = {
    "BNSS": "BNSS2023.pdf",
    "MotorVehicleAct": "MotorVehicleAct.pdf",
    "CorporateLaw": "CorporateLaws.pdf",
    "SecurityLaw": "SecurityLaw.pdf",
    "DepositoryLaw": "GLOBALDEPOSITORY.pdf"
}

EMBED_MODEL = "BAAI/bge-large-en-v1.5"
RERANK_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

TOP_K = 5
MIN_CONFIDENCE = 0.45
BYTEZ_MODEL = "gpt-4.1-mini"

bytez = Bytez()
embedder = SentenceTransformer(EMBED_MODEL)
reranker = CrossEncoder(RERANK_MODEL)


class AskRequest(BaseModel):
    question: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    act: str
    section: str
    title: str
    text: str
    bail: str
    rights: List[str]
    score: float


class AskResponse(BaseModel):
    question: str
    ai_answer: str
    supporting_sections: List[SearchResult]
    model_used: str


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]


def load_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def split_sections(text, act):
    pattern = r"(Section\s+\d+[A-Za-z\-]*)"
    parts = re.split(pattern, text)
    sections = []
    for i in range(1, len(parts), 2):
        sec = parts[i]
        body = parts[i + 1][:1500]
        title = body.split("\n")[0][:200]
        sections.append({
            "document": act,
            "section": sec,
            "title": title,
            "text": body
        })
    return sections


SECTIONS = []

for act, path in DOCUMENTS.items():
    if not Path(path).exists():
        continue
    text = load_pdf(path)
    secs = split_sections(text, act)
    SECTIONS.extend(secs)

texts = [s["title"] + " " + s["text"][:800] for s in SECTIONS]

embeddings = embedder.encode(texts, normalize_embeddings=True)
dim = embeddings.shape[1]

index = faiss.IndexFlatIP(dim)
index.add(np.array(embeddings))


def keyword_filter(query, candidates):
    q_words = set(re.findall(r"\w+", query.lower()))
    filtered = []
    for c in candidates:
        text = (c["title"] + " " + c["text"]).lower()
        overlap = sum(1 for w in q_words if w in text)
        if overlap >= 2:
            filtered.append(c)
    return filtered if filtered else candidates


def detect_bail(text):
    t = text.lower()
    if "non-bailable" in t:
        return "Non-bailable"
    if "bailable" in t:
        return "Bailable"
    if "bail" in t:
        return "Bail possible"
    return "Not specified"


def extract_rights(text):
    patterns = [
        r"shall have the right[^.]{0,200}",
        r"may apply[^.]{0,200}",
        r"entitled to[^.]{0,200}",
        r"may be released on bail[^.]{0,200}"
    ]
    rights = []
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            rights.append(m.group(0))
    return rights


def retrieve(query, top_k=TOP_K):
    q_emb = embedder.encode([query], normalize_embeddings=True)
    scores, ids = index.search(q_emb, 20)
    candidates = [SECTIONS[i] for i in ids[0]]
    candidates = keyword_filter(query, candidates)
    pairs = [(query, c["title"] + " " + c["text"][:800]) for c in candidates]
    rerank_scores = reranker.predict(pairs)
    ranked = []
    for score, sec in zip(rerank_scores, candidates):
        if score >= MIN_CONFIDENCE:
            ranked.append({
                "score": float(score),
                "section": sec
            })
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked[:top_k]


SYSTEM_PROMPT = """
You are an Indian legal assistant.

Use only the provided legal sections.
If the law is not present say the relevant law is not found in indexed acts.

Structure answers as:
LAW SUMMARY
IS IT BAILABLE
USER RIGHTS
WHAT CAN USER DO
"""


app = FastAPI(title="Legal AI RAG")


@app.get("/")
def root():
    return {"service": "Legal RAG API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    ranked = retrieve(req.query, req.top_k)
    results = []
    for r in ranked:
        sec = r["section"]
        results.append(
            SearchResult(
                act=sec["document"],
                section=sec["section"],
                title=sec["title"],
                text=sec["text"][:600],
                bail=detect_bail(sec["text"]),
                rights=extract_rights(sec["text"]),
                score=r["score"]
            )
        )
    return SearchResponse(query=req.query, results=results)


@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    ranked = retrieve(req.question)
    if not ranked:
        return AskResponse(
            question=req.question,
            ai_answer="No relevant law found in indexed acts.",
            supporting_sections=[],
            model_used=BYTEZ_MODEL
        )

    context = ""
    results = []

    for r in ranked:
        sec = r["section"]
        bail = detect_bail(sec["text"])
        rights = extract_rights(sec["text"])

        results.append(
            SearchResult(
                act=sec["document"],
                section=sec["section"],
                title=sec["title"],
                text=sec["text"][:600],
                bail=bail,
                rights=rights,
                score=r["score"]
            )
        )

        context += f"""
ACT: {sec['document']}
SECTION: {sec['section']}
TITLE: {sec['title']}

{sec['text']}

---
"""

    response = bytez.chat.completions.create(
        model=BYTEZ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Question:\n{req.question}\n\nRelevant law:\n{context}"
            }
        ]
    )

    answer = response.choices[0].message.content

    return AskResponse(
        question=req.question,
        ai_answer=answer,
        supporting_sections=results,
        model_used=BYTEZ_MODEL
    )