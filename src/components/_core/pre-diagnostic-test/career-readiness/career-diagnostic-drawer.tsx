"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

type CareerDiagnosticDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
};

type DiagnosticQuestion = {
  id: string;
  title: string;
  options: string[];
};

const QUESTIONS_PER_PAGE = 2;

const CAREER_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
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
  {
    id: "career-goal",
    title: "What best describes your primary career goal right now?",
    options: [
      "Land my first role in this field",
      "Switch careers into this field",
      "Grow in my current role",
      "Explore options before committing",
    ],
  },
  {
    id: "weekly-commitment",
    title: "How many hours per week can you realistically commit?",
    options: ["5-10 hours", "10-15 hours", "15-20 hours", "20+ hours"],
  },
  {
    id: "project-experience",
    title: "How much hands-on project experience do you have in this path?",
    options: [
      "No project experience yet",
      "Academic or personal projects only",
      "Some internship or freelance work",
      "Regular professional project work",
    ],
  },
  {
    id: "feedback-comfort",
    title: "How do you usually respond to structured feedback?",
    options: [
      "I apply it immediately and iterate",
      "I review it carefully before changing approach",
      "I prefer examples before making changes",
      "I find frequent feedback overwhelming",
    ],
  },
  {
    id: "collaboration-style",
    title: "Which collaboration style fits you best?",
    options: [
      "Independent work with periodic check-ins",
      "Pair work and live collaboration",
      "Team-based delivery with clear roles",
      "A mix depending on the task",
    ],
  },
  {
    id: "deadline-pressure",
    title: "How do you perform when deadlines are tight?",
    options: [
      "I plan early and stay ahead",
      "I work best with clear milestones",
      "I deliver under pressure but prefer buffer time",
      "I need help prioritizing when time is limited",
    ],
  },
  {
    id: "support-needed",
    title: "What support would help you most during this program?",
    options: [
      "Technical troubleshooting",
      "Career coaching and portfolio guidance",
      "Accountability and study structure",
      "All of the above equally",
    ],
  },
];

const TOTAL_QUESTIONS = CAREER_DIAGNOSTIC_QUESTIONS.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

const CareerDiagnosticDrawer = ({
  open,
  onOpenChange,
  onComplete,
}: CareerDiagnosticDrawerProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);

  const visibleQuestions = useMemo(
    () =>
      CAREER_DIAGNOSTIC_QUESTIONS.slice(
        pageIndex * QUESTIONS_PER_PAGE,
        pageIndex * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
      ),
    [pageIndex],
  );

  const progressQuestion = pageIndex * QUESTIONS_PER_PAGE + 1;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const timerToneClass =
    secondsLeft <= 3 * 60
      ? "bg-[#FDECEC] text-[#AA3030]"
      : secondsLeft <= 6 * 60
        ? "bg-[#FFF1C6] text-[#564103]"
        : "bg-[#D8F6DC] text-[#3A8E53]";

  const canContinue = visibleQuestions.every((question) => Boolean(answers[question.id]));
  const isLastPage = pageIndex >= TOTAL_PAGES - 1;

  useEffect(() => {
    if (!open) return;
    setAnswers({});
    setPageIndex(0);
    setSecondsLeft(10 * 60);
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, secondsLeft]);

  const handleContinue = () => {
    if (!canContinue) return;

    if (isLastPage) {
      onComplete?.();
      onOpenChange(false);
      return;
    }

    setPageIndex((prev) => prev + 1);
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
            <SheetClose className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>

            <SheetTitle className="mt-3 text-4xl font-semibold text-[#173740]">
              Career diagnostics
            </SheetTitle>

            <div className="mt-3 flex items-end justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-md px-3 py-1.5 text-center text-sm font-semibold ${timerToneClass}`}
                >
                  <p>{minutes}</p>
                  <p className="text-[10px] font-medium">Min</p>
                </div>
                <div
                  className={`rounded-md px-3 py-1.5 text-center text-sm font-semibold ${timerToneClass}`}
                >
                  <p>{seconds}</p>
                  <p className="text-[10px] font-medium">Sec</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-[#A4B4BC]">
                Questions {progressQuestion} of {TOTAL_QUESTIONS}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-6">
              {visibleQuestions.map((question) => (
                <div key={question.id} className="rounded-2xl bg-[#EEF4F6] p-4">
                  <h3 className="text-2xl leading-tight font-semibold text-[#193B46] sm:text-3xl">
                    {question.title}
                  </h3>
                  <div className="mt-4 space-y-2">
                    {question.options.map((option) => {
                      const checked = answers[question.id] === option;

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            checked
                              ? "bg-[#D4EAF0] text-[#1F5865]"
                              : "bg-[#E4ECEF] text-[#6E818A]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={checked}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.id]: option,
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
              ))}
            </div>

            <Button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="mt-5 h-12 w-full rounded-full bg-primary text-base text-white hover:bg-primary/90 disabled:bg-[#9DB8C0]"
            >
              {isLastPage ? "Finish diagnostic" : "Continue"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CareerDiagnosticDrawer;
