"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingAssistantButtonProps {
    isOpen?: boolean;
    onClick?: () => void;
    hasNotification?: boolean;
}

export function FloatingAssistantButton({
    isOpen = false,
    onClick,
    hasNotification = false,
}: FloatingAssistantButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "fixed bottom-8 right-8 z-40 h-16 w-16 rounded-full shadow-lg transition-all duration-300",
                "flex items-center justify-center",
                "border border-cyan-400/30 backdrop-blur-xl",
                "bg-gradient-to-br from-cyan-500/20 to-violet-500/20",
                "hover:border-cyan-400/50 hover:from-cyan-500/30 hover:to-violet-500/30",
                isOpen && "ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-background"
            )}
            aria-label="Open AI Assistant"
            aria-pressed={isOpen}
        >
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {isOpen ? (
                    <MessageCircle className="h-6 w-6 text-cyan-300" />
                ) : (
                    <Sparkles className="h-6 w-6 text-cyan-300" />
                )}
            </motion.div>

            {hasNotification && !isOpen && (
                <motion.div
                    className="absolute top-1 right-1 h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            )}

            <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-500/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ filter: "blur(8px)" }}
            />
        </motion.button>
    );
}
