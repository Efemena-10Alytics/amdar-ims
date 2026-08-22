"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CloseIcon } from "./icons";
import { SURVEY_TABS, SurveyQuestion } from "./types";

interface SurveyModalProps {
  surveyId: string;
}

const formatSurveyTitle = (surveyId: string) => {
  const parts = surveyId.split("-");
  return `${parts.map((p) => p[0]?.toUpperCase() + p.slice(1)).join(" ")} survey`;
};

const QuestionBlock = ({ question }: { question: SurveyQuestion }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const showNote = question.type === "yes-no-with-note" && selected === "yes";

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sora text-xl font-semibold text-[#334155]">{question.prompt}</p>

      <div className="flex flex-wrap gap-2">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className="flex h-[35px] items-center gap-2 rounded-[6px] border-[0.5px] border-[#B6CFD4] bg-[#E8EFF1] px-2 py-2.5 font-sora text-xs text-[#5C6777]"
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full border-[0.88px] border-[#C0C4CA] ${
                  isSelected ? "bg-[#156374]" : "bg-transparent"
                }`}
              />
              {opt.label}
            </button>
          );
        })}
      </div>

      {showNote && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="If yes, briefly describe the blockers"
          className="h-[112px] w-full resize-none rounded-lg bg-[#F8FAFC] px-4 pb-20 pt-3 font-sora text-base text-[#092A31] outline-none placeholder:text-[#64748B]"
        />
      )}
    </div>
  );
};

const SurveyModal = ({ surveyId }: SurveyModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(SURVEY_TABS[0].id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger enter transition on mount
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => router.push(pathname), 200);
  };

  const currentTab = SURVEY_TABS.find((t) => t.id === activeTab) ?? SURVEY_TABS[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-[#00000066] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />

      <div
        className="relative flex h-full w-[580px] max-w-full flex-col gap-6 overflow-y-auto bg-white p-10 shadow-[0px_2px_15px_10px_#1563741A] transition-transform duration-200"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        <button
          type="button"
          onClick={close}
          className="flex items-center gap-1 self-start font-sora text-sm text-[#EF4444]"
        >
          <CloseIcon />
          Close
        </button>

        <h2 className="font-sora text-2xl font-semibold text-[#092A31]">Survey</h2>

        <div className="flex h-16 items-center justify-between rounded-xl bg-[#E8EFF1] px-4">
          <p className="font-sora text-base font-medium text-[#092A31]">{formatSurveyTitle(surveyId)}</p>
          <p className="font-sora text-base text-[#93B7BF]">Avg. time: {currentTab.avgTime}</p>
        </div>

        <div className="flex items-center gap-6 border-b border-[#E8EFF1]">
          {SURVEY_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 font-sora text-lg leading-[140%] ${
                  isActive
                    ? "border-b-4 border-[#156374] text-[#156374]"
                    : "text-[#B6CFD4]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-8">
          {currentTab.questions.length > 0 ? (
            currentTab.questions.map((q) => <QuestionBlock key={q.id} question={q} />)
          ) : (
            <p className="font-sora text-sm text-[#64748B]">No questions in this section yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;