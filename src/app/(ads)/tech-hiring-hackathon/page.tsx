"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateAdsData } from "@/features/ads/use-create-ads-data";
import "./animations.css";

const WHATSAPP_LINK = "https://chat.whatsapp.com/Jt1XfqhcofE8bkIf5jCBTB";

const TRACKS = [
  { value: "data", label: "Data" },
  { value: "pm", label: "Project Management" },
  { value: "ba", label: "Business Analysis" },
  { value: "cyber", label: "Cybersecurity" },
];

const PROCESS_STEPS = [
  {
    num: "1",
    title: "Submit Your CV",
    body: "Register and send your CV before 27th July. This is the CV you'll interview on.",
  },
  {
    num: "2",
    title: "Get the Job Description",
    body: "Receive the real job description you'll be applying for. Review it. Prepare your story.",
  },
  {
    num: "3",
    title: "Live Interview",
    body: "Get interviewed by a hiring professional. Real questions. Real pressure. Real interview.",
  },
  {
    num: "4",
    title: "Immediate Feedback",
    body: "Get your score, feedback, and action plan right after your interview.",
  },
];

const BENEFITS = [
  {
    title: "Real Interview Experience",
    body: "Not a mock. A real hiring conversation with questions that matter to actual employers.",
  },
  {
    title: "Immediate Feedback",
    body: "Know what you did well, what to fix, and how to prepare before your next interview.",
  },
  {
    title: "Your Interview Score",
    body: "See how you ranked. Know where you stand compared to other candidates.",
  },
  {
    title: "Action Plan",
    body: "Custom roadmap for what to work on before your next real job interview.",
  },
  {
    title: "Network Access",
    body: "Meet hiring professionals in your field who might be hiring.",
  },
  {
    title: "Confidence",
    body: "You've interviewed in a real scenario. Your next interview won't feel so scary.",
  },
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0C3640] px-3.5 py-3 text-sm text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

function BenefitCard({ title, body, index }: { title: string; body: string; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [animateClass, setAnimateClass] = React.useState("");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const delayMs = index * 120;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setAnimateClass("shake-in"), delayMs);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`benefit-card rounded-xl border border-[#156374]/40 bg-[#0C3640] p-5 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-2 hover:border-[#FFE082]/50 hover:bg-[#0C3640] hover:shadow-[0_10px_30px_rgba(255,224,130,0.15)] ${animateClass}`}
    >
      <h4 className="mb-2.5 text-sm font-bold text-[#FFE082]">{title}</h4>
      <p className="text-[13px] leading-[1.6] text-[#C7D5D6]">{body}</p>
    </div>
  );
}

const TechHiringHackathonPage = () => {
  const router = useRouter();
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      const trimFirst = firstName.trim();
      const trimLast = lastName.trim();
      const trimEmail = email.trim();
      const trimPhone = phone.trim();

      if (!trimFirst || !trimLast || !trimEmail || !trimPhone || !track) {
        setFormError("Please fill in all fields to reserve your spot.");
        return;
      }

      // Open synchronously within the click gesture so browsers don't block it as a popup.
      // Note: passing "noopener" here would make window.open() return null, so we omit it
      // and instead null out the opener manually once the window is navigated below.
      const whatsappWindow = window.open("", "_blank");

      const res = await createNaRole({
        source: "TechHiringHackathon",
        firstName: trimFirst,
        lastName: trimLast,
        email: trimEmail,
        phone: trimPhone,
        location: "UK",
        visaType: track,
      });

      if (!res) {
        whatsappWindow?.close();
        return;
      }

      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = WHATSAPP_LINK;
      }
      router.push("/tech-hiring-hackathon/thank-you");
    },
    [createNaRole, email, firstName, lastName, phone, router, track]
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* URGENCY BAR */}
      <div className="border-b-2 border-[#FFE082] bg-[#FFE082] px-5 py-4 text-center text-[13px] font-bold tracking-[0.02em] text-[#0C2730]">
        🔴 ONLY 3 DAYS LEFT — Register Now &nbsp;·&nbsp; Spots Filling Fast
      </div>

      <div className="mx-auto max-w-[720px]">
        {/* HEADER */}
        <header className="border-b-2 border-[#FFE082] bg-gradient-to-br from-[#092A31] to-[#0C3640] px-6 py-[50px] text-center">
          <div className="mb-5 inline-block rounded-full border border-[#FFE082] bg-[#FFE082]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#FFE082]">
            Live Interview Bootcamp
          </div>
          <h1 className="mb-3 text-[clamp(2rem,8vw,3.5rem)] font-black tracking-[-0.03em] text-white">
            Tech Hiring Hackathon
          </h1>
          <p className="mb-4 text-[15px] text-[#C7D5D6]">
            Real Interviews. Real Feedback. Real Opportunity.
          </p>
          <div className="mx-auto mt-5 flex max-w-fit items-center justify-center gap-3 rounded-lg border border-[#FFE082]/20 bg-[#FFE082]/10 px-5 py-3 text-[15px] font-semibold">
            <span className="text-xl">📅</span>
            <span>28th July 2026 · 8PM BST</span>
          </div>
        </header>

        <div className="px-6 py-10">
          {/* INTRO */}
          <p className="mx-auto mb-[30px] max-w-[560px] text-center text-[15px] leading-[1.7] text-[#C7D5D6]">
            Stop preparing blindly. Get{" "}
            <strong className="text-[#FFE082]">real interview experience</strong> with
            a real job description, immediate feedback, and actionable insights on
            exactly what to fix.
          </p>

          {/* REGISTER CTA BUTTON */}
          <div className="mb-[50px] text-center">
            <a
              href="#register-form"
              className="inline-block rounded-lg bg-[#FFE082] px-[50px] py-4 text-sm font-bold uppercase tracking-[0.02em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
            >
              Register Now — It&apos;s Free
            </a>
          </div>

          {/* HOW IT WORKS */}
          <section className="mb-[50px]">
            <div className="mb-5 border-l-[3px] border-[#FFE082] bg-[#FFE082]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#FFE082]">
              How It Works
            </div>
            <h2 className="mb-[30px] text-[2rem] font-black tracking-[-0.02em] text-white">
              4 Simple Steps
            </h2>

            <div className="grid gap-4">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex items-start gap-4 rounded-xl border border-[#156374]/40 bg-[#0C3640] p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-[#FFE082]/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE082] text-lg font-black text-[#0C2730]">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-[#FFE082]">
                      {step.title}
                    </h4>
                    <p className="text-[13px] leading-[1.6] text-[#C7D5D6]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* WHAT YOU GET */}
          <section className="mb-[50px]">
            <div className="mb-5 border-l-[3px] border-[#FFE082] bg-[#FFE082]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-[#FFE082]">
              What This Unlocks
            </div>
            <h2 className="mb-[30px] text-[2rem] font-black tracking-[-0.02em] text-white">
              What You Stand to Gain
            </h2>
            <p className="mb-[30px] text-center text-[15px] leading-[1.7] text-[#C7D5D6]">
              One bootcamp. Real experience. Real feedback that changes how you
              interview.
            </p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {BENEFITS.map((benefit, index) => (
                <BenefitCard key={benefit.title} index={index} {...benefit} />
              ))}
            </div>
          </section>

          {/* REGISTRATION */}
          <section
            id="register-form"
            className="mb-[50px] rounded-2xl border-2 border-[#FFE082]/20 bg-[#0C3640] px-6 py-[30px]"
          >
            <h3 className="mb-3 text-2xl font-black text-white">
              Register Now, It&apos;s Free
            </h3>
            <p className="mb-6 text-sm text-[#C7D5D6]">
              Secure your spot at the bootcamp. You&apos;ll be directed to the
              community after registering.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  First name
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Last name
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Phone number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  required
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Your Track
                </span>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select your track</option>
                  {TRACKS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              {formError ? (
                <p className="text-[13px] text-[#fca5a5]">{formError}</p>
              ) : null}
              {errorMessage ? (
                <p className="text-[13px] text-[#fca5a5]">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#FFE082] py-4 text-sm font-bold uppercase tracking-[0.02em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Reserving…" : "Reserve My Bootcamp Spot"}
              </button>
              <p className="mt-3 text-center text-xs text-[#C7D5D6]">
                🔒 Free · No credit card · Limited spots (20 per track)
              </p>
            </form>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#156374]/30 bg-[#061A20] px-6 py-[30px] text-center">
        <Image
          src="/logo-white.svg"
          width={120}
          height={18}
          alt="Amdari"
          className="mx-auto mb-2"
        />
        <p className="text-sm text-[#C7D5D6]">
          Tech Hiring Hackathon 2026 — Interview Bootcamp
        </p>
        <p className="mt-2 text-sm text-[#C7D5D6]">
          Get Real Interview Experience. Get Real Feedback. Get Real Results.
        </p>
      </footer>
    </div>
  );
};

export default TechHiringHackathonPage;
