"use client";

import { motion } from "framer-motion";
import {
    Briefcase,
    FileText,
    Compass,
    BookOpen,
    Zap,
    Gift,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCard {
    id: string;
    title: string;
    icon: LucideIcon;
}

const suggestions: SuggestionCard[] = [
    { id: "internships", title: "Find internships", icon: Briefcase },
    { id: "resume", title: "Resume review", icon: FileText },
    { id: "roadmap", title: "Career roadmap", icon: Compass },
    { id: "interview", title: "Interview prep", icon: BookOpen },
    { id: "hackathons", title: "Hackathons", icon: Zap },
    { id: "resources", title: "Suggest resources", icon: Gift },
];

interface SuggestionCardsProps {
    onSelect?: (id: string) => void;
}

export function SuggestionCards({ onSelect }: SuggestionCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
            {suggestions.map((card, idx) => {
                const Icon = card.icon;

                return (
                    <motion.button
                        key={card.id}
                        type="button"
                        onClick={() => onSelect?.(card.id)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.25 }}
                        whileHover={{ y: -2, borderColor: "rgba(34, 211, 238, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]",
                            "p-3 text-left transition-all",
                            "hover:border-cyan-400/30 hover:bg-white/[0.06]",
                            "active:bg-white/[0.08]"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 opacity-0 transition-opacity group-hover:opacity-10" />

                        <div className="relative z-10">
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 text-cyan-300 group-hover:border-cyan-400/30">
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-xs font-medium leading-tight text-foreground">{card.title}</p>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
