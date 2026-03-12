"use client";

import { MessageSquare, Sparkles, Send, Bot, User, BookOpen, Quote, ShieldAlert } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = { id: number, sender: "user" | "ai", text: string, sources?: string[] };

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "ai", text: "Hello Adv. Kinjal! I'm your E-Bench Legal AI Assistant. How can I assist you with your case research, laws, or contracts today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMsg }]);

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: "ai",
                text: `According to recent jurisprudence under the Information Technology Act, an intermediary can be held liable if they have actual knowledge of unlawful acts on their platform and fail to take it down.\n\nSection 79 of the IT Act provides safe harbor protection, but it is conditional. It requires intermediaries to observe due diligence.`,
                sources: [
                    "Information Technology Act, 2000 (Section 79)",
                    "Shreya Singhal v. Union of India (2015) 5 SCC 1",
                    "Rules on Intermediary Guidelines (2021)"
                ]
            }]);
        }, 1200);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden relative">
            <div className="h-16 border-b border-gray-200 bg-[#F5F7FA] px-6 flex items-center gap-3 shrink-0">
                <div className="bg-[#0F2854] text-white p-2 rounded-lg"><Sparkles size={18} /></div>
                <div>
                    <h2 className="font-bold text-[#0F2854]">E-Bench Assistant</h2>
                    <p className="text-xs text-gray-500 font-medium tracking-wide flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Online • Legal AI Models Active
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>

                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === "ai" ? "bg-[#1C4D8D] text-white" : "bg-[#BDE8F5] border border-[#1C4D8D]/20 text-[#0F2854] font-bold"}`}>
                            {msg.sender === "ai" ? <Bot size={20} /> : "KO"}
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

                            {/* Sources Section */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-1 bg-white border border-gray-200 rounded-xl p-3 shadow-sm w-full">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#4988C4] mb-2 flex items-center gap-1.5 border-b pb-1.5">
                                        <BookOpen size={12} /> Cited Sources
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1.5">
                                        {msg.sources.map((src, i) => (
                                            <li key={i} className="flex gap-2 items-start group cursor-pointer hover:text-[#1C4D8D]">
                                                <Quote size={10} className="mt-0.5 text-[#BDE8F5] group-hover:text-[#4988C4]" fill="currentColor" />
                                                <span className="underline decoration-gray-300 underline-offset-2">{src}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

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
                        disabled={!input.trim()}
                        className="w-14 h-[54px] rounded-2xl bg-[#0F2854] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 hover:bg-[#1C4D8D] transition-colors shrink-0 shadow-sm border border-[#0F2854]"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    E-Bench Assistant can make mistakes. Consider verifying critical legal information.
                </p>
            </div>
        </div>
    );
}
