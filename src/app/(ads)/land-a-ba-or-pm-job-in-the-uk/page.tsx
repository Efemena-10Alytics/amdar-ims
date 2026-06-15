"use client";

import React from "react";
import Image from "next/image";
import { useCreateAdsData } from "@/features/ads/use-create-ads-data";

// TODO: replace with real YouTube video IDs
const INVITE_VIDEO_ID = "VIDEO_ID";
const TESTI1_VIDEO_ID = "VIDEO_ID";
const TESTI2_VIDEO_ID = "VIDEO_ID";

const TRACKS = [
  "Business Analysis",
  "Project Management",
  "Both — not sure yet",
];

const STAGES = [
  "Complete beginner",
  "Some self-study / courses",
  "Switching from another career",
  "Looking for my first BA/PM role",
];

const LEARN_ITEMS = [
  {
    num: "01",
    title: "BA vs PM — Which Role Fits You?",
    body: "A plain-English breakdown of both roles, where they overlap, and how to pick the one that maps to your background and goals.",
  },
  {
    num: "02",
    title: "The UK Market for BA & PM Roles",
    body: "Where the demand actually is in 2025 — across sectors, seniority levels, and contract vs permanent — so you target the right opportunities from day one.",
  },
  {
    num: "03",
    title: "How to Break Into the NHS & Civil Service",
    body: "The public sector is one of the largest employers of BAs and PMs in the UK. We'll walk through exactly how to apply, what frameworks they use, and how to position yourself for these roles.",
  },
  {
    num: "04",
    title: "Certifications That Actually Move the Needle",
    body: "APM, Prince2, AgilePM, BCS BA — which ones UK employers actually care about, which to get first, and how to get them without spending months out of work.",
  },
  {
    num: "05",
    title: "Your 60-Day Action Plan",
    body: "A week-by-week roadmap to go from where you are now to job-ready — without quitting your current job or spending years retraining.",
  },
  {
    num: "06",
    title: "How to Write a BA/PM CV with No Direct Experience",
    body: "The exact framework for translating transferable skills from other roles into a compelling BA or PM CV that gets shortlisted.",
  },
  {
    num: "07",
    title: "Visa & Right-to-Work for Public Sector Roles",
    body: "What international candidates need to know about NHS Band structures for PMs, Civil Service security clearance, and which roles offer visa sponsorship.",
  },
  {
    num: "08",
    title: "Live Q&A — Ask Anything",
    body: "Stay on after the session and get your specific situation answered directly. No gatekeeping, no upsell pressure.",
  },
];

const SECTORS = [
  {
    icon: "🏥",
    title: "NHS & Health",
    body: "The NHS runs thousands of digital transformation, system implementation, and process improvement projects. BAs and PMs are central to every one. NHS Digital, integrated care boards, and NHS trusts all hire continuously — and many roles are open to career changers with the right training.",
    roles: [
      "Business Analyst",
      "Project Manager",
      "PMO Analyst",
      "Change Manager",
    ],
  },
  {
    icon: "🏛️",
    title: "UK Civil Service",
    body: "Government departments — HMRC, DWP, DHSC, MoJ, DVLA — run some of the largest IT and change programmes in the country. The Civil Service actively recruits BAs and PMs, with structured career grades, strong pensions, and hybrid working as standard.",
    roles: [
      "Business Analyst",
      "Senior Responsible Owner",
      "Delivery Manager",
      "Programme Analyst",
    ],
  },
  {
    icon: "🏦",
    title: "Financial Services",
    body: "Banks, insurers, and payment firms run constant regulatory and transformation projects. BA and PM roles in financial services are well-paid, structured, and plentiful — from Barclays and HSBC to Lloyd's, Aviva, and fintech scale-ups.",
    roles: [
      "Business Analyst",
      "IT Project Manager",
      "Agile Delivery Lead",
      "Change Analyst",
    ],
  },
  {
    icon: "🏗️",
    title: "Infrastructure & Utilities",
    body: "National Grid, TfL, Network Rail, water companies, and energy firms all deliver massive capital and digital programmes. They hire BAs and PMs in volume — and often sponsor visas for the right candidates.",
    roles: ["Project Manager", "Programme Manager", "Stakeholder Manager"],
  },
  {
    icon: "🏫",
    title: "Education & Local Gov",
    body: "Universities, local councils, and housing associations run ongoing transformation and digitalisation projects. These roles offer genuine job security, flexible working, and a welcoming environment for people making their first move into BA or PM.",
    roles: ["Business Analyst", "Project Officer", "Systems Analyst"],
  },
  {
    icon: "💻",
    title: "Tech & Consulting",
    body: "From Big Four consultancies to product-led tech companies, BAs and PMs who can bridge technical and business teams are in constant demand. These roles build skills fast and open doors across every other sector.",
    roles: [
      "Product Owner",
      "Scrum Master",
      "BA Consultant",
      "Delivery Manager",
    ],
  },
];

const TESTIMONIALS = [
  {
    id: "testi1",
    videoId: TESTI1_VIDEO_ID,
    initials: "TK",
    name: "Testimonial Graduate 1",
    role: "Business Analyst · NHS Trust",
    quote:
      '"I had zero BA experience and came from a completely different background. Amdari helped me understand exactly what NHS hiring managers look for — I had two interviews within my first month of applying."',
  },
  {
    id: "testi2",
    videoId: TESTI2_VIDEO_ID,
    initials: "AO",
    name: "Testimonial Graduate 2",
    role: "Project Manager · UK Civil Service",
    quote:
      '"I switched from teaching into project management. The Prince2 and Agile training, plus the coaching on Civil Service applications, gave me everything I needed. I landed a PM role at a government department in under 60 days."',
  },
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

function VideoPlayer({
  videoId,
  label,
  playSize = "lg",
}: {
  videoId: string;
  label: React.ReactNode;
  playSize?: "sm" | "lg";
}) {
  const [loaded, setLoaded] = React.useState(false);
  const btnSize = playSize === "lg" ? "h-16 w-16" : "h-[52px] w-[52px]";
  const svgSize = playSize === "lg" ? 20 : 16;

  return loaded ? (
    <iframe
      className="block aspect-video w-full border-0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Amdari webinar video"
    />
  ) : (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-3.5 overflow-hidden bg-[#0C3640]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(21,99,116,0.18)_0%,transparent_70%)]" />
      <div
        className={`relative z-10 flex ${btnSize} items-center justify-center rounded-full border-2 border-[#FFE082] bg-[#FFE082]/10 transition-[transform,background-color] duration-200 group-hover:scale-110 group-hover:bg-[#FFE082]/20`}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="#FFE082"
          className="ml-1"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
      <div className="relative z-10 text-xs text-[#C7D5D6]">{label}</div>
    </button>
  );
}

const BaPmWebinarPage = () => {
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [stage, setStage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      const trimFirst = firstName.trim();
      const trimEmail = email.trim();
      const trimPhone = phone.trim();

      if (!trimFirst || !trimEmail || !trimPhone) {
        setFormError("Please fill in your name, email, and phone number.");
        return;
      }

      const res = await createNaRole({
        source: "BaPmWebinar",
        firstName: trimFirst,
        lastName: lastName.trim() || null,
        email: trimEmail,
        phone: trimPhone,
        location: "UK",
        visaType: track || null,
      });

      if (!res) return;

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setTrack("");
      setStage("");
    },
    [createNaRole, email, firstName, lastName, phone, track],
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* TOP BAR */}
      <div className="bg-[#FFE082] px-4 py-[9px] text-center text-[12.5px] font-bold tracking-[0.01em] text-[#0C2730]">
        Free webinar
        <span className="mx-2 inline-block h-[7px] w-[7px] animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-[#0C2730] align-middle" />
        Land a BA or PM Job in the UK — Register below to save your spot
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/97 px-[5%] py-4 backdrop-blur-[8px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <div className="rounded-full hidden sm:block border border-[#156374]/45 bg-[#156374]/15 px-3.5 py-[5px] text-[11.5px] font-semibold tracking-[0.05em] text-[#C7D5D6]">
          PRODUCT TECH CAREERS
        </div>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-12 px-[5%] pb-10 pt-[52px] lg:grid-cols-[1fr_420px] lg:gap-12">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-[7px] rounded-full border border-[#FFE082]/28 bg-[#FFE082]/10 px-3.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-[#FFE082]">
            <span className="h-[7px] w-[7px] animate-[blink_1.4s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
            Free Online Webinar
          </div>

          <h1 className="mb-[18px] text-[clamp(26px,4.2vw,46px)] font-black leading-[1.2] tracking-normal text-white">
            How to Land a BA or PM
            <br />
            Job in the UK —<br />
            <em className="not-italic text-[#FFE082]">
              Without Starting Over.
            </em>
          </h1>

          <p className="mb-7 max-w-[480px] text-[15px] leading-[1.65] text-[#C7D5D6]">
            Whether you're targeting Business Analysis or Project Management —
            this free session maps the exact path UK employers expect, how to
            get certified fast, and where the real opportunities are hiding.
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-5">
            {[
              { icon: "🗓", label: "Live + Replay available" },
              { icon: "⏱", label: "60 minutes" },
              { icon: "🆓", label: "Free to attend" },
            ].map((item, i) => (
              <React.Fragment key={item.label}>
                {i > 0 && (
                  <div className="hidden h-[18px] w-px bg-[#156374]/45 sm:block" />
                )}
                <div className="flex items-center gap-2 text-[13px] text-[#C7D5D6]">
                  <span className="text-[15px]">{item.icon}</span>
                  <strong className="font-semibold text-[#F2F7F7]">
                    {item.label}
                  </strong>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Video player */}
          <div className="overflow-hidden rounded-2xl border border-[#156374]/45 bg-[#0C3640]">
            <VideoPlayer
              videoId={INVITE_VIDEO_ID}
              label={
                <>
                  <strong className="font-semibold text-[#F2F7F7]">
                    Watch the webinar invite
                  </strong>{" "}
                  — 2 min
                </>
              }
              playSize="lg"
            />
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {[
              "No fluff — practical steps only",
              "Live Q&A included",
              "UK-focused advice",
              "100+ people already hired",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-[12px] text-[#C7D5D6]"
              >
                <span className="font-semibold text-[#FFE082]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — sticky form card */}
        <div className="w-full rounded-2xl border border-[#156374]/45 bg-[#061A20] p-7 lg:sticky lg:top-[72px]">
          {/* Seats bar */}
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-[#FFE082]/20 bg-[#0C3640] px-3.5 py-2.5">
            <div className="flex-1">
              <div className="h-[5px] overflow-hidden rounded-full bg-white/7">
                <div className="h-full w-[74%] rounded-full bg-[#FFE082]" />
              </div>
            </div>
            <span className="whitespace-nowrap text-[11px] font-bold text-[#FFE082]">
              37 spots left
            </span>
          </div>

          {/* Form head */}
          <div className="mb-5 border-b border-[#156374]/22 pb-[18px]">
            <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#2B7F95]">
              Reserve your free seat
            </div>
            <h2 className="text-[19px] font-extrabold leading-[1.25] tracking-[-0.025em] text-white">
              Join the Webinar
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[#C7D5D6]">
              Takes 30 seconds. You'll get the link and a reminder before we go
              live.
            </p>
          </div>

          {submitted ? (
            <div className="py-5 text-center">
              <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-2xl">
                ✅
              </div>
              <h3 className="mb-1.5 text-[17px] font-extrabold text-white">
                You&apos;re registered!
              </h3>
              <p className="text-[13px] leading-[1.6] text-[#C7D5D6]">
                Check your inbox — we&apos;ve sent the webinar link and
                everything you need to prepare. See you there.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-[5px]">
                  <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ada"
                    required
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-[5px]">
                  <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Okafor"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-[5px]">
                <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className={inputCls}
                />
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                  WhatsApp / Phone number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 000000"
                  required
                  className={inputCls}
                />
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                  Which track interests you?
                </span>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select one…</option>
                  {TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-[11.5px] font-semibold tracking-[0.02em] text-[#C7D5D6]">
                  Where are you right now?
                </span>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select one…</option>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              {formError ? (
                <p className="text-[12px] text-[#fca5a5]">{formError}</p>
              ) : null}
              {errorMessage ? (
                <p className="text-[12px] text-[#fca5a5]">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-lg bg-[#FFE082] py-3.5 text-[14.5px] font-extrabold tracking-[-0.01em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? "Saving your spot…" : "Save My Free Spot →"}
              </button>

              <p className="text-center text-[11px] leading-[1.5] text-[#4A6A7A]">
                🔒 We never share your details. Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* WHAT YOU'LL WALK AWAY WITH */}
      <div className="border-y border-[#156374]/22 bg-[#061A20]">
        <div className="mx-auto max-w-[1100px] px-[5%] py-14">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2B7F95]">
            What&apos;s inside
          </div>
          <h2 className="mb-8 text-[clamp(20px,3vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-white">
            What you&apos;ll walk away with
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
            {LEARN_ITEMS.map((item) => (
              <div
                key={item.num}
                className="flex items-start gap-3.5 rounded-[10px] border border-[#156374]/22 bg-[#092A31] p-5 transition-colors hover:border-[#2B7F95]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#FFE082]/18 bg-[#FFE082]/8 text-[11px] font-extrabold text-[#FFE082]">
                  {item.num}
                </div>
                <div>
                  <h4 className="mb-1 text-[13.5px] font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-[12px] leading-[1.55] text-[#C7D5D6]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UK SECTORS ACTIVELY HIRING */}
      <div className="mx-auto max-w-[1100px] px-[5%] py-14">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2B7F95]">
          Where our graduates work
        </div>
        <h2 className="mb-4 text-[clamp(20px,3vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-white">
          The UK sectors{" "}
          <em className="not-italic text-[#FFE082]">actively hiring</em> BA
          &amp; PM talent
        </h2>
        <p className="mb-8 max-w-[640px] text-[14px] leading-[1.65] text-[#C7D5D6]">
          Business Analysts and Project Managers are needed in every sector —
          but the biggest, most stable, and often most accessible demand comes
          from the public sector and large institutions that run transformation
          programmes year-round.
        </p>

        <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
          {SECTORS.map((sector) => (
            <div
              key={sector.title}
              className="rounded-2xl border border-[#156374]/22 bg-[#0C3640] p-[22px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#2B7F95]"
            >
              <span className="mb-2.5 block text-[26px]">{sector.icon}</span>
              <h4 className="mb-1.5 text-[14px] font-extrabold tracking-[-0.01em] text-white">
                {sector.title}
              </h4>
              <p className="mb-2.5 text-[12px] leading-[1.6] text-[#C7D5D6]">
                {sector.body}
              </p>
              <div className="flex flex-wrap gap-[5px]">
                {sector.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-[#156374]/45 bg-[#156374]/18 px-[9px] py-[3px] text-[10.5px] font-semibold text-[#2B7F95]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[720px] rounded-[10px] border border-[#FFE082]/18 bg-[#FFE082]/6 px-[18px] py-3.5 text-[13px] leading-[1.65] text-[#C7D5D6]">
          <strong className="text-[#FFE082]">
            Note on the NHS &amp; Civil Service:
          </strong>{" "}
          These organisations use structured job frameworks (NHS Agenda for
          Change Bands, Civil Service Success Profiles) that most applicants get
          wrong. In this webinar, we&apos;ll show you exactly how to navigate
          NHS Jobs and Civil Service Jobs — including how to answer competency
          questions the right way.
        </div>
      </div>

      {/* VIDEO TESTIMONIALS */}
      <div className="border-y border-[#156374]/22 bg-[#061A20]">
        <div className="mx-auto max-w-[1100px] px-[5%] py-14">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#2B7F95]">
            Hear it from them
          </div>
          <h2 className="mb-8 text-[clamp(20px,3vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-white">
            People who did it —<br />
            <em className="not-italic text-[#FFE082]">
              now watch them tell you how
            </em>
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            {TESTIMONIALS.map((testi) => (
              <div
                key={testi.id}
                className="overflow-hidden rounded-2xl border border-[#156374]/45 bg-[#0C3640] transition-colors hover:border-[#2B7F95]"
              >
                <VideoPlayer
                  videoId={testi.videoId}
                  label={
                    <>
                      <strong className="text-[12px] font-semibold text-[#F2F7F7]">
                        Watch their story
                      </strong>{" "}
                      — 2 min
                    </>
                  }
                  playSize="sm"
                />
                <div className="border-t border-[#156374]/22 px-5 py-[18px]">
                  <p className="mb-3.5 text-[13px] italic leading-[1.7] text-[#C7D5D6]">
                    {testi.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2B7F95] bg-[#0e3d4d] text-[13px] font-extrabold text-white">
                      {testi.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-white">
                        {testi.name}
                      </div>
                      <div className="mt-px text-[11.5px] text-[#C7D5D6]">
                        {testi.role}
                      </div>
                    </div>
                    <div className="ml-auto rounded-full border border-[#22c55e]/25 bg-[#22c55e]/10 px-2.5 py-[3px] text-[10px] font-bold tracking-[0.04em] whitespace-nowrap text-[#4ade80]">
                      Hired ✓
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#156374]/22 px-[5%] py-8">
        <Image src="/logo-white.svg" width={120} height={18} alt="Amdari" />
        <p className="text-[12px] text-[#4A6A7A]">
          © 2025 Amdari. Helping career switchers land UK tech jobs.
        </p>
      </footer>
    </div>
  );
};

export default BaPmWebinarPage;
