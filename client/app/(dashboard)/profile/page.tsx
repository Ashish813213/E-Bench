"use client";

import { User, Mail, Building, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6 h-full max-w-5xl mx-auto">

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] relative">
                    <div className="absolute right-6 top-6 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm font-medium border border-white/30 flex items-center gap-2">
                        <ShieldCheck size={16} /> Verified Partner
                    </div>
                </div>

                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-end relative -mt-12 sm:-mt-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-[#BDE8F5] text-[#0F2854] flex items-center justify-center text-4xl font-serif font-bold shadow-md uppercase">
                        KO
                    </div>

                    <div className="flex-1 text-center sm:text-left mb-2">
                        <h1 className="text-3xl font-bold text-[#0F2854] tracking-tight">Adv. Kinjal Ojha</h1>
                        <p className="text-[#1C4D8D] font-medium flex items-center justify-center sm:justify-start gap-1 mt-1">
                            Senior Legal Partner <CheckCircle2 size={16} className="text-[#4988C4]" fill="currentColor" stroke="white" />
                        </p>
                    </div>

                    <div className="flex gap-3 mb-2">
                        <button className="px-5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Personal Details */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-[#0F2854] border-b pb-4 mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><User size={14} /> Full Name</p>
                            <p className="font-semibold text-gray-800">Kinjal Ojha</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Mail size={14} /> Email Address</p>
                            <p className="font-semibold text-gray-800">kinjal.ojha@example.com</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Building size={14} /> Organization / Law College</p>
                            <p className="font-semibold text-gray-800">Ojha & Associates Legal Firm</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><ShieldCheck size={14} /> Bar Council ID</p>
                            <p className="font-semibold text-gray-800">MAH/202X/XXXX</p>
                        </div>
                    </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Activity className="text-[#4988C4]" />
                        <h2 className="text-lg font-bold text-[#0F2854]">Usage Statistics</h2>
                    </div>

                    <div className="bg-[#F5F7FA] rounded-xl p-4 flex items-center justify-between border border-[#E2E8F0]">
                        <div>
                            <p className="text-sm text-gray-500">Cases Analyzed</p>
                            <p className="text-2xl font-bold text-[#0F2854]">124</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C4D8D] shadow-sm">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="bg-[#F5F7FA] rounded-xl p-4 flex items-center justify-between border border-[#E2E8F0]">
                        <div>
                            <p className="text-sm text-gray-500">Contracts Reviewed</p>
                            <p className="text-2xl font-bold text-[#0F2854]">82</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C4D8D] shadow-sm">
                            <Building size={20} />
                        </div>
                    </div>

                    <div className="bg-[#F5F7FA] rounded-xl p-4 flex items-center justify-between border border-[#E2E8F0]">
                        <div>
                            <p className="text-sm text-gray-500">Docs Summarized</p>
                            <p className="text-2xl font-bold text-[#0F2854]">345</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C4D8D] shadow-sm">
                            <User size={20} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
