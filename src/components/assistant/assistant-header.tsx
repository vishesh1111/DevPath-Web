"use client";

import { motion } from "framer-motion";
import { X, Sparkles, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantHeaderProps {
    onClose?: () => void;
    onExpand?: () => void;
}

export function AssistantHeader({ onClose, onExpand }: AssistantHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-background to-background/80 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-foreground">DevPath Assistant</h2>
                    <p className="text-xs text-muted-foreground">Your AI companion</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <motion.button
                    onClick={onExpand}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg",
                        "border border-white/10 bg-white/5 text-muted-foreground",
                        "transition hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                    )}
                    aria-label="Expand assistant"
                >
                    <Maximize2 className="h-4 w-4" />
                </motion.button>

                <motion.button
                    onClick={onClose}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        "border border-white/10 bg-white/5 text-muted-foreground",
                        "transition hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                    )}
                    aria-label="Close assistant"
                >
                    <X className="h-4 w-4" />
                </motion.button>
            </div>
        </div>
    );
}
