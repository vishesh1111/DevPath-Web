"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FloatingAssistantButton } from "./floating-assistant-button";
import { AssistantPanel } from "./assistant-panel";

interface FloatingAssistantProps {
    onSend?: (message: string) => void;
    onSuggestionSelect?: (id: string) => void;
    hasNotification?: boolean;
}

export function FloatingAssistant({
    onSend,
    onSuggestionSelect,
    hasNotification = false,
}: FloatingAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                <FloatingAssistantButton
                    isOpen={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                    hasNotification={hasNotification}
                />
            </AnimatePresence>

            <AssistantPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onExpand={() => {}}
                onSend={(message) => {
                    onSend?.(message);
                    setIsOpen(false);
                }}
                onSuggestionSelect={(id) => {
                    onSuggestionSelect?.(id);
                    setIsOpen(false);
                }}
            />
        </>
    );
}
