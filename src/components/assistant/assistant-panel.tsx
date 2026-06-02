"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AssistantHeader } from "./assistant-header";
import { SuggestionCards } from "./suggestion-cards";
import { AssistantInput } from "./assistant-input";
import { cn } from "@/lib/utils";

interface AssistantPanelProps {
    isOpen: boolean;
    onClose?: () => void;
    onExpand?: () => void;
    onSend?: (message: string) => void;
    onSuggestionSelect?: (id: string) => void;
}

export function AssistantPanel({
    isOpen,
    onClose,
    onExpand,
    onSend,
    onSuggestionSelect,
}: AssistantPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
                        aria-hidden="true"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed bottom-24 right-4 z-40 w-full max-w-sm overflow-hidden rounded-3xl",
                            "border border-white/10 bg-background/90 shadow-2xl",
                            "backdrop-blur-2xl",
                            "md:bottom-auto md:right-8 md:top-24",
                            "flex flex-col max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-180px)]"
                        )}
                    >
                        <AssistantHeader onClose={onClose} onExpand={onExpand} />

                        <div className="flex-1 overflow-y-auto">
                            <div className="px-5 py-6">
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-foreground">Hi there! 👋</h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        How can I help you today? Pick an action below or ask me anything.
                                    </p>
                                </div>

                                <SuggestionCards onSelect={onSuggestionSelect} />
                            </div>
                        </div>

                        <AssistantInput onSend={onSend} placeholder="Ask me anything..." />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
