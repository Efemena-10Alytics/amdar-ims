"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Flag from "../landing-pages/home/hero/flag";
import QuizDrawer from "./quiz-drawer";

const GUIDELINES = [
  "Answer honestly, this helps us make sure you get the right support from day one.",
  "There are no wrong answers, only the right fit.",
  "Ensure all questions are answered within the time frame",
  "Complete the quiz before time is up else the you would have to start again.",
];

const ReadinessTest = () => {
  const router = useRouter();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <section className="w-full max-w-190 py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">Readiness Quiz</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-6">
        <h2 className="text-lg font-semibold text-[#2F6A78]">Your quiz</h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-[#F4D98D] px-4 py-2 text-sm font-semibold text-[#6E5A1F]">
            💡 Complete the Readiness Quiz
          </span>
          <Flag width={18} />
        </div>

        <div className="mt-4 rounded-xl bg-[#E0E8EC] p-4">
          <h3 className="text-lg font-semibold text-[#2D6A78]">Assessment guidelines</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm font-medium text-[#3F5E68]">
            {GUIDELINES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex justify-center gap-10 items-center rounded-lg bg-[#EFF3F6] px-6 py-3 text-center">
          <div>
            <p className="text-lg font-semibold text-[#173740]">10</p>
            <p className="text-sm font-medium text-[#6C7D88]">Question</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#173740]">10</p>
            <p className="text-sm font-medium text-[#6C7D88]">Minutes</p>
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={() => setIsQuizOpen(true)}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa]"
      >
        Start Quiz
      </button>

      <QuizDrawer
        open={isQuizOpen}
        onOpenChange={setIsQuizOpen}
        onComplete={() => router.push("/pre-diagnostic-test")}
      />
    </section>
  );
};

export default ReadinessTest;
