"use client";

import { useState, useRef, useEffect } from "react";
import {
    Scale, Gavel, Paperclip, Send, Trash2, Sparkles,
    CheckCheck, FileText, BookOpen, Copy, BookMarked, ChevronRight,
} from "lucide-react";

const RAG_API = process.env.NEXT_PUBLIC_RAG_API || "http://localhost:8000";

const SUGGESTED: { q: string; icon: typeof Scale }[] = [
    { q: "What is Section 302 BNS and its punishment?", icon: Scale },
    { q: "Explain bail provisions under BNSS 2023", icon: Gavel },
    { q: "How does Section 420 IPC apply to fraud cases?", icon: FileText },
    { q: "What are rights of an accused under Indian law?", icon: BookOpen },
    { q: "Procedure for filing an FIR in India", icon: Scale },
    { q: "Director liability under Companies Act 2013", icon: FileText },
];

type Section = { document: string; section_number: number; title: string; snippet?: string };
type IKResult = { doc_id: string; title: string; headline: string };
type Message = {
    id: number;
    sender: "user" | "ai";
    text: string;
    timestamp: string;
    sections?: Section[];
    ikResults?: IKResult[];
    saved?: boolean;
    copied?: boolean;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "ai", text: "Hello Adv. Kinjal! I'm your E-Bench Legal AI Assistant. How can I assist you with your case research, laws, or contracts today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function AIChatPage() {
    const chatIdRef = useRef<string>(`chat_${Date.now()}`);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Persist to localStorage whenever messages change
    useEffect(() => {
        if (messages.length === 0) return;
        const id = chatIdRef.current;
        try {
            const raw = localStorage.getItem("ebench_chats");
            const all: Record<string, unknown>[] = raw ? JSON.parse(raw) : [];
            const idx = all.findIndex((c: { id?: string }) => c.id === id);
            const firstUser = messages.find(m => m.sender === "user");
            const last = messages[messages.length - 1];
            const entry = {
                id,
                title: firstUser?.text.slice(0, 80) || "New Chat",
                last_message: last.text.slice(0, 120),
                bot_type: "Legal Research",
                timestamp: new Date().toISOString(),
                message_count: messages.length,
                messages,
                pinned: idx >= 0 ? (all[idx] as { pinned?: boolean }).pinned ?? false : false,
            };
            if (idx >= 0) all[idx] = entry;
            else all.unshift(entry);
            localStorage.setItem("ebench_chats", JSON.stringify(all));
        } catch { /* ignore */ }
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const q = (text ?? input).trim();
        if (!q || isTyping) return;
        setInput("");
        const now = new Date().toISOString();
        setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: q, timestamp: now }]);
        setIsTyping(true);
        try {
            const res = await fetch(`${RAG_API}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: q, top_k: 7 }),
            });
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "ai",
                text: data.ai_answer || "No response generated.",
                timestamp: new Date().toISOString(),
                sections: data.supporting_sections || [],
                ikResults: data.indian_kanoon_results || [],
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "ai",
                text: "Sorry, I couldn't reach the AI service. Please ensure the RAG server is running at localhost:8000.",
                timestamp: new Date().toISOString(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text).catch(() => {});
        setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
        setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
    };

    const handleSave = (id: number) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, saved: !m.saved } : m));
    };

    const isEmpty = messages.length === 0;

    return (
        <div className="flex flex-col flex-1 min-h-0 h-full rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0B1E45] via-[#0F2854] to-[#1C4D8D] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-yellow-300" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-[15px]">AI Legal Assistant</h1>
                        <p className="text-[10px] text-blue-200 flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            Ask legal questions and get AI-powered answers
                        </p>
                    </div>
                </div>
                {!isEmpty && (
                    <button
                        onClick={() => setMessages([])}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                    >
                        <Trash2 size={12} /> Clear Chat
                    </button>
                )}
            </div>

            {/* ── Chat Body ── */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-[#F8FAFC]">
                <div className={isEmpty ? "h-full flex flex-col items-center justify-center p-6" : "p-6"}>
                    {isEmpty ? (
                        /* Welcome / Suggested Questions */
                        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F2854] to-[#4988C4] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Scale size={26} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-[#0F2854]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    E-Bench Legal AI
                                </h2>
                                <p className="text-sm text-gray-500 mt-1.5 max-w-md mx-auto">
                                    Ask me anything about Indian law — BNS, BNSS, BSA, Motor Vehicles Act, corporate law, case law and more.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {SUGGESTED.map(({ q, icon: Icon }) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-200 hover:border-[#4988C4] hover:shadow-sm transition-all group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] flex items-center justify-center shrink-0 group-hover:bg-[#0F2854] transition-colors">
                                            <Icon size={14} className="text-[#1C4D8D] group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 group-hover:text-[#0F2854] transition-colors leading-snug flex-1">{q}</span>
                                        <ChevronRight size={13} className="text-gray-300 group-hover:text-[#4988C4] shrink-0 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Message Thread */
                        <div className="space-y-6">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm self-start mt-1 ${msg.sender === "ai" ? "bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] text-white" : "bg-[#EEF4FF] text-[#0F2854] border border-[#C8DEFF]"}`}>
                                        {msg.sender === "ai" ? "AI" : "YOU"}
                                    </div>
                                    <div className={`flex flex-col gap-2 max-w-[78%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                        {/* Main bubble */}
                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-[#0F2854] text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm whitespace-pre-wrap"}`}>
                                            {msg.text}
                                        </div>
                                        {/* Referenced Laws */}
                                        {msg.sections && msg.sections.length > 0 && (
                                            <div className="bg-white border border-[#D8E6FF] rounded-xl p-3.5 w-full shadow-sm">
                                                <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#0F2854] uppercase tracking-wider mb-2.5 pb-2 border-b border-gray-100">
                                                    <Scale size={11} className="text-[#4988C4]" /> Referenced Laws
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {msg.sections.map((s, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                                            <span className="w-4 h-4 rounded-full bg-[#EEF4FF] text-[#1C4D8D] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                                            <span><strong>{s.document}</strong> — §{s.section_number}: {s.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* Relevant Judgements */}
                                        {msg.ikResults && msg.ikResults.length > 0 && (
                                            <div className="bg-[#FFFDF5] border border-[#E8D9A8] rounded-xl p-3.5 w-full shadow-sm">
                                                <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#7C5C00] uppercase tracking-wider mb-2.5 pb-2 border-b border-yellow-100">
                                                    <Gavel size={11} className="text-[#C49A10]" /> Relevant Judgements
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {msg.ikResults.map((ik, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                                            <span className="w-4 h-4 rounded-full bg-[#FFFBEB] text-[#C49A10] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                                            <span><strong>{ik.title}</strong>{ik.headline ? <span className="text-gray-400"> — {ik.headline.slice(0, 90)}</span> : null}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* Timestamp + Actions */}
                                        <div className={`flex items-center gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                            <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
                                            {msg.sender === "ai" && (
                                                <>
                                                    <button
                                                        onClick={() => handleCopy(msg.id, msg.text)}
                                                        className={`flex items-center gap-1 text-[10px] transition-colors ${msg.copied ? "text-emerald-600" : "text-gray-400 hover:text-[#1C4D8D]"}`}
                                                    >
                                                        {msg.copied ? <CheckCheck size={11} /> : <Copy size={11} />}
                                                        {msg.copied ? "Copied!" : "Copy"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSave(msg.id)}
                                                        className={`flex items-center gap-1 text-[10px] transition-colors ${msg.saved ? "text-[#C49A10]" : "text-gray-400 hover:text-[#C49A10]"}`}
                                                    >
                                                        <BookMarked size={11} />
                                                        {msg.saved ? "Saved" : "Save"}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] text-white flex items-center justify-center text-[10px] font-bold shrink-0 self-start mt-1 shadow-sm">AI</div>
                                    <div className="px-4 py-3.5 bg-white rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm flex items-center gap-1.5">
                                        <style>{`.ebd{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4988C4} @keyframes ebB{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}} .ebd:nth-child(1){animation:ebB 1.2s ease infinite 0s} .ebd:nth-child(2){animation:ebB 1.2s ease infinite .15s} .ebd:nth-child(3){animation:ebB 1.2s ease infinite .3s}`}</style>
                                        <span className="ebd" /><span className="ebd" /><span className="ebd" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <div className="shrink-0 bg-white border-t border-gray-100 px-4 pt-3.5 pb-4">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex items-center gap-2"
                >
                    <button type="button" className="p-2 rounded-xl text-gray-400 hover:text-[#4988C4] hover:bg-[#EEF4FF] transition-colors shrink-0" title="Attach file">
                        <Paperclip size={17} />
                    </button>
                    <div className="flex-1 border border-gray-200 rounded-2xl bg-[#F8FAFC] focus-within:bg-white focus-within:border-[#4988C4] focus-within:ring-2 focus-within:ring-[#4988C4]/15 transition-all">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a legal question — cite a section, case, or scenario..."
                            className="w-full bg-transparent px-4 py-3 outline-none text-sm text-gray-800 placeholder:text-gray-400"
                            disabled={isTyping}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-3 rounded-2xl bg-[#0F2854] text-white flex items-center justify-center disabled:opacity-40 disabled:bg-gray-300 hover:bg-[#1C4D8D] transition-all shrink-0 shadow-sm"
                    >
                        <Send size={17} />
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2 select-none">
                    E-Bench AI can make mistakes. Verify critical legal information with a licensed professional.
                </p>
            </div>
        </div>
    );
}
