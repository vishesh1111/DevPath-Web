'use client';

import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { MagneticText } from '@/components/ui/magnetic-text';
import { siteConfig } from '@/config/siteConfig';

export default function ComplaintPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background elements for cyberpunk feel */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
            </div>

            <div className="container px-4 mx-auto flex flex-col items-center text-center z-10">
                <div className="mb-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center" style={{ width: 600, height: 240 }}>
                        <MessageSquare className="text-cyan-400 opacity-30" size={120} />
                    </div>
                </div>

                <div className="mb-6">
                    <MagneticText
                        text="COMMUNITY COMPLAINTS"
                        hoverText="YOUR VOICE MATTERS"
                        className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2"
                    />
                </div>

                <h2 className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
                    We value your feedback. Help us improve the community by sharing your thoughts or reporting any issues you've encountered.
                </h2>

                <Link
                    href={siteConfig.contact.complaintsForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-cyan-300 group-hover:to-purple-400">
                        Submit Your Complaint
                    </span>
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-500/20 transition-colors">
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                </Link>

                <div className="mt-12 flex items-center gap-2 text-sm text-gray-500">
                    <MessageSquare size={14} />
                    <span>Redirects to Google Forms</span>
                </div>
            </div>
        </main>
    );
}
