import {
    X,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useGamification } from '@/context/GamificationContext';
import QuizComponent from './QuizComponent';

interface RoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
    roadmap: {
        title: string;
        phases: {
            title: string;
            duration: string;
            icon: any;
            items: {
                subtitle: string;
                points: string[];
            }[];
        }[];
    } | null;
}

const quizQuestions = [
    {
        question: 'What is React primarily used for?',
        options: [
            'Database Management',
            'Building User Interfaces',
            'Machine Learning',
            'Backend APIs',
        ],
        answer: 'Building User Interfaces',
    },
    {
        question: 'Which hook is used for state management?',
        options: ['useFetch', 'useState', 'useData', 'useStore'],
        answer: 'useState',
    },
    {
        question: 'What does JSX stand for?',
        options: [
            'Java Syntax Extension',
            'JavaScript XML',
            'JSON XML',
            'JavaScript Extension',
        ],
        answer: 'JavaScript XML',
    },
];

export function RoadmapModal({
    isOpen,
    onClose,
    roadmap,
}: RoadmapModalProps) {
    const [mounted, setMounted] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const { addXp } = useGamification();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentPhaseIndex(0);
            setShowQuiz(false);
        }
    }, [isOpen]);

    if (!isOpen || !roadmap || !mounted) return null;

    const activePhase = roadmap.phases[currentPhaseIndex];

    const handleNext = () => {
        if (currentPhaseIndex < roadmap.phases.length - 1) {
            setCurrentPhaseIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentPhaseIndex > 0) {
            setCurrentPhaseIndex((prev) => prev - 1);
        }
    };

    const handleComplete = () => {
        try {
            addXp(500, `Completed the ${roadmap.title} Pathway!`);
        } catch (err) {
            console.error('Failed to add XP: ', err);
        }

        onClose();
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-2xl custom-scrollbar flex flex-col"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur">
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                                {roadmap.title}
                            </h2>

                            <p className="text-sm text-muted-foreground mt-1">
                                Interactive Pathway Tutorial
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {!showQuiz ? (
                        <>
                            {/* Progress Steps */}
                            <div className="px-6 pt-6">
                                <div className="flex items-center justify-between bg-muted/20 p-4 rounded-xl border border-border/50 overflow-x-auto scrollbar-hide">
                                    <div className="flex items-center gap-2 w-full justify-between min-w-[300px]">
                                        {roadmap.phases.map((phase, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 flex-grow last:flex-grow-0"
                                            >
                                                <button
                                                    onClick={() =>
                                                        setCurrentPhaseIndex(idx)
                                                    }
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                        idx === currentPhaseIndex
                                                            ? 'bg-primary text-white scale-110'
                                                            : idx <
                                                              currentPhaseIndex
                                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                                            : 'bg-muted text-muted-foreground border border-border'
                                                    }`}
                                                >
                                                    {idx < currentPhaseIndex ? (
                                                        <Check size={14} />
                                                    ) : (
                                                        idx + 1
                                                    )}
                                                </button>

                                                {idx <
                                                    roadmap.phases.length -
                                                        1 && (
                                                    <div
                                                        className={`h-[2px] flex-grow rounded ${
                                                            idx <
                                                            currentPhaseIndex
                                                                ? 'bg-primary'
                                                                : 'bg-muted'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-6 flex-grow">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPhaseIndex}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6 min-h-[300px]"
                                    >
                                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                                                    {activePhase.icon}
                                                    {activePhase.title}
                                                </h3>

                                                <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full mt-2 inline-block">
                                                    {activePhase.duration}
                                                </span>
                                            </div>

                                            <div className="text-sm text-muted-foreground font-mono bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                                                Step{' '}
                                                {currentPhaseIndex + 1} of{' '}
                                                {roadmap.phases.length}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activePhase.items.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-muted/30 rounded-xl p-5 border border-border/50"
                                                >
                                                    <h4 className="font-semibold text-foreground mb-3 flex items-start gap-2">
                                                        <CheckCircle
                                                            size={16}
                                                            className="text-green-500 mt-1 shrink-0"
                                                        />
                                                        {item.subtitle}
                                                    </h4>

                                                    <ul className="space-y-2">
                                                        {item.points.map(
                                                            (point, j) => (
                                                                <li
                                                                    key={j}
                                                                    className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2"
                                                                >
                                                                    {point}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                                    {currentPhaseIndex > 0 ? (
                                        <button
                                            onClick={handleBack}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl"
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    {currentPhaseIndex <
                                    roadmap.phases.length - 1 ? (
                                        <button
                                            onClick={handleNext}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    setShowQuiz(true)
                                                }
                                                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                                            >
                                                Take Quiz
                                            </button>

                                            <button
                                                onClick={handleComplete}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                                            >
                                                Complete Pathway
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-6">
                            <QuizComponent 
                                quizId={`roadmap-${roadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-quiz`}
                                questions={quizQuestions}
                                onComplete={() => {
                                    setShowQuiz(false);
                                    handleComplete();
                                }}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}