"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

type QuizDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete?: () => void;
};

type QuizQuestion = {
    id: string;
    title: string;
    options: string[];
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: "software-installation",
        title: "Have you installed the required software for this internship?",
        options: [
            "Yes, fully installed and tested",
            "Yes, installed but not tested",
            "Partially installed",
            "Not installed",
        ],
    },
    {
        id: "computer-access",
        title: "Do you have access to a laptop/desktop computer for this course?",
        options: [
            "Personal laptop (Admin rights, reliable)",
            "Personal laptop (Limited admin rights)",
            "Shared/Borrowed device",
            "No reliable device yet",
        ],
    },
    {
        id: "learning-style",
        title: "How do you prefer to learn new technical skills?",
        options: [
            "Try independently - research - ask smart questions",
            "Follow structured guides step by step",
            "Learn by discussing with peers/mentor",
            "Watch videos and replicate tasks",
        ],
    },
];

const QuizDrawer = ({ open, onOpenChange, onComplete }: QuizDrawerProps) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [questionIndex, setQuestionIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 59);

    const activeQuestion = QUIZ_QUESTIONS[questionIndex];
    const selectedValue = answers[activeQuestion.id] ?? "";
    const totalQuestions = QUIZ_QUESTIONS.length;
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    const timerToneClass =
        secondsLeft <= 3 * 60
            ? "bg-[#FDECEC] text-[#AA3030]"
            : secondsLeft <= 6 * 60
                ? "bg-[#FFF1C6] text-[#564103]"
                : "bg-[#D8F6DC] text-[#3A8E53]";

    useEffect(() => {
        if (!open) return;
        setSecondsLeft(9 * 60 + 59);
    }, [open]);

    useEffect(() => {
        if (!open || secondsLeft <= 0) return;
        const timer = window.setInterval(() => {
            setSecondsLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [open, secondsLeft]);

    const handleContinue = () => {
        if (!selectedValue) return;
        if (questionIndex < totalQuestions - 1) {
            setQuestionIndex((prev) => prev + 1);
            return;
        }
        onComplete?.();
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-full border-l-0 bg-[#F7FAFB] p-0 sm:max-w-135"
            >
                <div className="flex h-full flex-col">
                    <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
                        <div className="flex items-center justify-between">
                            <SheetClose className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
                                <X className="size-3.5" />
                                Close
                            </SheetClose>

                        </div>
                        <SheetTitle className="mt-3 text-4xl font-semibold text-[#173740]">
                            Readiness Quiz
                        </SheetTitle>
                        <div className="flex justify-between items-center">
                            <div
                                className={`mt-2 inline-flex flex-col items-center rounded-md px-2 py-1 text-sm font-semibold ${timerToneClass}`}
                            >
                                <div className="flex justify-between items-center gap-1">
                                    <span>{minutes}</span>
                                    <span>:</span>
                                    <span>{seconds}</span>
                                </div>
                                <div className="mt-0.5 flex justify-between items-center gap-2 text-[10px] font-medium">
                                    <span>Min</span>
                                    <span>Sec</span>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-[#A4B4BC]">
                                Questions {questionIndex + 1} Of {totalQuestions}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <div className="rounded-2xl bg-[#EEF4F6] p-4">
                            <h3 className="text-3xl leading-tight font-semibold text-[#193B46]">
                                {activeQuestion.title}
                            </h3>
                            <div className="mt-4 space-y-2">
                                {activeQuestion.options.map((option) => {
                                    const checked = selectedValue === option;
                                    return (
                                        <label
                                            key={option}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${checked
                                                ? "bg-[#D4EAF0] text-[#1F5865]"
                                                : "bg-[#E4ECEF] text-[#6E818A]"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={activeQuestion.id}
                                                value={option}
                                                checked={checked}
                                                onChange={() =>
                                                    setAnswers((prev) => ({
                                                        ...prev,
                                                        [activeQuestion.id]: option,
                                                    }))
                                                }
                                                className="size-3.5 accent-[#1E7C8D]"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={!selectedValue}
                            onClick={handleContinue}
                            className="mt-5 h-12 w-full rounded-full bg-primary text-base text-white hover:bg-primary/90 disabled:bg-[#9DB8C0]"
                        >
                            {questionIndex < totalQuestions - 1 ? "Continue" : "Finish Quiz"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default QuizDrawer;
