"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const RAG_API = process.env.NEXT_PUBLIC_RAG_API || "http://localhost:8000";

type Source = { document: string; section_number: number; title: string; snippet: string };
type IKSource = { doc_id: string; title: string; headline: string };
type Message = {
    id: number;
    sender: "user" | "ai";
    text: string;
    sources?: string[];
    ikSources?: IKSource[];
};

export default function ChatConversationPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "ai", text: "Hello! I'm your E-Bench Legal AI Assistant. Ask me anything about Indian laws — BNS, BNSS, BSA, Motor Vehicles Act, Corporate Laws, Securities Laws, or any case law." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load saved chat from localStorage on mount
    useEffect(() => {
        if (!id) return;
        try {
            const stored = localStorage.getItem("ebench_chats");
            if (stored) {
                const allChats = JSON.parse(stored);
                const chat = allChats.find((c: { id: string }) => c.id === id);
                if (chat?.messages?.length) {
                    setMessages(chat.messages);
                }
            }
        } catch { /* ignore */ }
    }, [id]);

    // Save chat to localStorage whenever messages change
    useEffect(() => {
        if (!id || messages.length <= 1) return;
        try {
            const stored = localStorage.getItem("ebench_chats");
            const allChats: Array<Record<string, unknown>> = stored ? JSON.parse(stored) : [];
            const idx = allChats.findIndex((c: { id?: string }) => c.id === id);

            const firstUserMsg = messages.find(m => m.sender === "user");
            const lastMsg = messages[messages.length - 1];
            const title = firstUserMsg?.text.slice(0, 80) || "New Chat";

            const chatObj = {
                id,
                title,
                last_message: lastMsg.text.slice(0, 120),
                bot_type: "Legal Research",
                timestamp: new Date().toISOString(),
                message_count: messages.length,
                messages,
                pinned: idx >= 0 ? (allChats[idx] as { pinned?: boolean }).pinned || false : false,
            };

            if (idx >= 0) {
                allChats[idx] = chatObj;
            } else {
                allChats.unshift(chatObj);
            }
            localStorage.setItem("ebench_chats", JSON.stringify(allChats));
        } catch { /* ignore */ }
    }, [messages, id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMsg }]);
        setIsTyping(true);

        try {
            const res = await fetch(`${RAG_API}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userMsg, top_k: 7 }),
            });

            if (!res.ok) throw new Error(`API error ${res.status}`);

            const data = await res.json();

            const sources = (data.supporting_sections || []).map(
                (s: Source) => `${s.document} — Section ${s.section_number}: ${s.title}`
            );

            const ikSources: IKSource[] = (data.indian_kanoon_results || []).map(
                (ik: IKSource) => ({ doc_id: ik.doc_id, title: ik.title, headline: ik.headline })
            );

            const ikSourceStrings = ikSources.map(ik => `[Case Law] ${ik.title}`);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "ai",
                text: data.ai_answer || "I couldn't generate a response. Please try rephrasing your question.",
                sources: [...sources, ...ikSourceStrings],
                ikSources,
            }]);
        } catch (err) {
            console.error("Chat API error:", err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "ai",
                text: "Sorry, I couldn't reach the legal AI service. Please make sure the RAG server is running and try again.",
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 h-full border border-[#E2E8F0] rounded-2xl bg-white shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="h-14 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F5F7FA] via-[#EEF4FF] to-[#E6F0FF] px-4 flex items-center gap-3 shrink-0">
                <button
                    onClick={() => router.push("/dashboard/my-chats")}
                    className="p-1.5 rounded-lg hover:bg-[#0F2854]/10 transition-colors"
                >
                    <ArrowLeft size={18} className="text-[#0F2854]" />
                </button>
                <div className="bg-[#0F2854] text-white p-2 rounded-lg text-sm font-bold">AI</div>
                <div>
                    <h2 className="font-bold text-[#0F2854] text-sm">E-Bench Assistant</h2>
                    <p className="text-[11px] text-gray-500 font-medium tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === "ai" ? "bg-[#1C4D8D] text-white" : "bg-[#BDE8F5] border border-[#1C4D8D]/20 text-[#0F2854] font-bold"}`}>
                            {msg.sender === "ai" ? "AI" : "YOU"}
                        </div>
                        <div className={`flex flex-col gap-2 max-w-[80%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                            <div
                                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                    ? "bg-[#0F2854] text-white rounded-tr-sm"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm whitespace-pre-wrap"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-1 bg-white border border-gray-200 rounded-xl p-3 shadow-sm w-full">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#4988C4] mb-2 flex items-center gap-1.5 border-b pb-1.5">
                                        Sources
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1.5">
                                        {msg.sources.map((src, i) => (
                                            <li key={i} className="flex gap-2 items-start group cursor-pointer hover:text-[#1C4D8D]">
                                                <span className="mt-[2px] w-1.5 h-1.5 rounded-full bg-[#4988C4] shrink-0"></span>
                                                <span className="underline decoration-gray-300 underline-offset-2">{src}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-[#1C4D8D] text-white">AI</div>
                        <div className="px-5 py-3 rounded-2xl rounded-tl-sm text-sm bg-white text-gray-700 border border-gray-200 shadow-sm">
                            Typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-end gap-2">
                    <div className="flex-1 border border-gray-300 rounded-2xl bg-[#F5F7FA] focus-within:bg-white focus-within:border-[#4988C4] focus-within:ring-1 focus-within:ring-[#4988C4] transition-all overflow-hidden flex shadow-sm">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a legal question or cite a scenario..."
                            className="w-full bg-transparent px-5 py-4 outline-none text-sm text-gray-800"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-14 h-[54px] rounded-2xl bg-[#0F2854] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 hover:bg-[#1C4D8D] transition-colors shrink-0 shadow-sm border border-[#0F2854]"
                    >
                        Send
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    E-Bench Assistant can make mistakes. Consider verifying critical legal information.
                </p>
            </div>
        </div>
    );
}
