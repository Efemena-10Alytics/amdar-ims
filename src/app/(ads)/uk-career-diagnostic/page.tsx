"use client";

import React, { useState } from "react";
import { DiagnosticView, LeadInfo } from "./data";
import { GateView } from "./_components/gate-view";
import { QuizView } from "./_components/quiz-view";
import { ResultsView } from "./_components/results-view";
import "./diagnostic.css";

const INITIAL_ANSWERS: (number | null)[] = [null, null, null, null, null, null];

export default function UkCareerDiagnosticPage() {
  const [view, setView] = useState<DiagnosticView>("quiz");
  const [qi, setQi] = useState(0);
  const [targetRole, setTargetRole] = useState("");
  const [answers, setAnswers] = useState<(number | null)[]>(INITIAL_ANSWERS);
  const [lead, setLead] = useState<LeadInfo | null>(null);

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
    setLead(submittedLead);
    setView("result");
    scrollTop();
  };

  const handleRetake = () => {
    setQi(0);
    setTargetRole("");
    setAnswers(INITIAL_ANSWERS);
    setLead(null);
    setView("quiz");
    scrollTop();
  };

  return (
    <main
      className={`uk-diag-page text-[16px] sm:text-[17px] antialiased selection:bg-[#FFE082] selection:text-[#092A31] ${
        view === "result" ? "has-sticky" : ""
      }`}
    >
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

      {view === "result" && lead ? (
        <ResultsView
          targetRole={targetRole}
          answers={answers}
          lead={lead}
          onRetake={handleRetake}
        />
      ) : null}
    </main>
  );
}
