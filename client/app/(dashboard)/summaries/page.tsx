"use client";

import { ShieldAlert, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockSummaries = [
    { id: "SUM-01", title: "FIR 402/2023 - Cyber Fraud", preview: "The complainant reports a loss of Rs. 5 Lakhs via phishing link...", keywords: ["Phishing", "IT Act 66D", "Banking Fraud"], date: "2023-11-15" },
    { id: "SUM-02", title: "Chargesheet - State vs ABC", preview: "Detailed investigation findings implicating the primary accused under...", keywords: ["Conspiracy", "IPC 120B"], date: "2023-11-22" },
    { id: "SUM-03", title: "Judgement - Property Dispute", preview: "The court ruled in favor of the plaintiff asserting legitimate inheritance...", keywords: ["Inheritance", "Civil Court"], date: "2023-12-01" },
];

export default function SummariesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = mockSummaries.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#0F2854] shadow-sm"><ShieldAlert size={24} /></div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F2854] font-serif">Document Summaries</h1>
                        <p className="text-sm text-gray-500">View and manage AI-generated legal document summaries.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search summaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] outline-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F5F7FA] border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4 pl-6">Document Title</th>
                                <th className="p-4">Summary Preview</th>
                                <th className="p-4">Keywords</th>
                                <th className="p-4 pr-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((c) => (
                                <tr key={c.id} className="hover:bg-[#F5F7FA]/50 transition-colors cursor-pointer group">
                                    <td className="p-4 pl-6">
                                        <p className="font-semibold text-[#0F2854] group-hover:text-[#1C4D8D]">{c.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{c.id}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-sm truncate" title={c.preview}>{c.preview}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {c.keywords.map(kw => (
                                                <span key={kw} className="px-2 py-1 bg-[#F0F4F8] text-[#1C4D8D] text-xs font-semibold rounded-md border border-[#E2E8F0]">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-sm text-gray-500 whitespace-nowrap">{c.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No summaries found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
