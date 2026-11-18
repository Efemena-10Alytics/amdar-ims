"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosticView, LeadInfo, saveDiagnosticState } from "./data";
import { GateView } from "./_components/gate-view";
import { QuizView } from "./_components/quiz-view";

const INITIAL_ANSWERS: (number | null)[] = [null, null, null, null, null, null];

export default function UkCareerDiagnosticPage() {
  const router = useRouter();
  const [view, setView] = useState<Exclude<DiagnosticView, "result">>("quiz");
  const [qi, setQi] = useState(0);
  const [targetRole, setTargetRole] = useState("");
  const [answers, setAnswers] = useState<(number | null)[]>(INITIAL_ANSWERS);

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const handleAdvanceFromQ1 = (role: string) => {
    setTargetRole(role);
    setQi(1);
    scrollTop();
  };

  const handlePickOption = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });

    if (qi < 6) {
      setQi((prev) => prev + 1);
    } else {
      setView("gate");
    }
    scrollTop();
  };

  const handleGoBackInQuiz = () => {
    if (qi > 0) {
      setQi((prev) => prev - 1);
      scrollTop();
    }
  };

  const handleBackFromGate = () => {
    setQi(6);
    setView("quiz");
    scrollTop();
  };

  const handleGateComplete = (submittedLead: LeadInfo) => {
    saveDiagnosticState({
      targetRole,
      answers,
      lead: submittedLead,
    });
    router.push("/uk-career-diagnostic/thank-you");
  };

  return (
    <main className="uk-diag-page text-[16px] sm:text-[17px] antialiased selection:bg-[#FFE082] selection:text-[#092A31]">
      {view === "quiz" ? (
        <QuizView
          qi={qi}
          targetRole={targetRole}
          answers={answers}
          onTargetRoleChange={setTargetRole}
          onAdvanceFromQ1={handleAdvanceFromQ1}
          onPickOption={handlePickOption}
          onGoBack={handleGoBackInQuiz}
        />
      ) : null}

      {view === "gate" ? (
        <GateView
          targetRole={targetRole}
          answers={answers}
          onBackToQuestions={handleBackFromGate}
          onComplete={handleGateComplete}
        />
      ) : null}
    </main>
  );
}
