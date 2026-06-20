"use client";

import React from "react";
import Image from "next/image";

// TODO: replace with real YouTube video IDs
const INVITE_VIDEO_ID = "VIDEO_ID";
const JERRY_VIDEO_ID = "VIDEO_ID";
const OPEYEMI_VIDEO_ID = "VIDEO_ID";

const TRACKS = [
  "Data Analytics",
  "Data Science",
  "Data Engineering",
  "Not sure yet",
];

const STAGES = [
  "Complete beginner",
  "Some self-study",
  "Switching from another career",
  "Looking for my first data role",
];

const LEARN_ITEMS = [
  {
    num: "01",
    title: "The UK Data Job Market — Decoded",
    body: "Where the real demand is, which roles are easiest to break into, and what companies actually hire for in 2025.",
  },
  {
    num: "02",
    title: "DA vs DS vs DE — Which Path Is Yours?",
    body: "A clear breakdown of the three tracks so you stop second-guessing and pick the right one for your background.",
  },
  {
    num: "03",
    title: "How to Break Into the NHS & Public Sector",
    body: "The NHS, Civil Service, and local government are among the UK's biggest data employers — and most people don't know how to approach them. We'll show you exactly how.",
  },
  {
    num: "04",
    title: "The Skills That Get You Hired",
    body: "Not a generic list — the exact tools and skills that UK hiring managers check for first, from SQL and Python to Power BI and Tableau.",
  },
  {
    num: "05",
    title: "Your 60-Day Action Plan",
    body: "A realistic, week-by-week timeline to go from where you are now to job-ready — without quitting your life to do it.",
  },
  {
    num: "06",
    title: "How to Land Interviews — Fast",
    body: "CV positioning, LinkedIn optimisation, and how to tap into the UK recruiter network that Amdari has spent years building.",
  },
  {
    num: "07",
    title: "Visa & Right-to-Work Realities",
    body: "What international candidates need to know about sponsored roles, the Civil Service nationality rules, and NHS Band structures for data professionals.",
  },
  {
    num: "08",
    title: "Live Q&A — Ask Anything",
    body: "Stay on after the session and get your specific questions answered directly. No gatekeeping, no upsell pressure.",
  },
];

const SECTORS = [
  {
    icon: "🏥",
    title: "NHS & Health Data",
    body: "The NHS employs thousands of data professionals across England, Wales, Scotland, and Northern Ireland — from frontline trusts to NHS England and NHSX. Demand for analysts who can work with patient data, operational reporting, and health intelligence is growing every year.",
    roles: ["Data Analyst", "BI Developer", "Health Intelligence", "Data Engineer"],
  },
  {
    icon: "🏛️",
    title: "UK Civil Service",
    body: "Government departments — HMRC, DWP, DHSC, Cabinet Office, ONS — run some of the largest data operations in the country. The Government Data Science community and Analytical Function actively hire and develop data talent, including career changers.",
    roles: ["Data Scientist", "Statistical Analyst", "Data Engineer", "Performance Analyst"],
  },
  {
    icon: "🏦",
    title: "Financial Services",
    body: "Banks, insurers, and fintech firms across London and beyond have a constant pipeline of data vacancies — from risk analytics at Barclays and HSBC to data science at challenger banks and insurtech startups.",
    roles: ["Risk Analyst", "Data Scientist", "Quant Analyst", "MI Analyst"],
  },
  {
    icon: "🛒",
    title: "Retail & E-commerce",
    body: "Tesco, Sainsbury's, ASOS, and hundreds of UK retailers rely on data teams to drive decisions around pricing, logistics, customer behaviour, and supply chain. Entry-level analyst roles here are plentiful and well-structured.",
    roles: ["Commercial Analyst", "Customer Insights", "Supply Chain Data"],
  },
  {
    icon: "🏫",
    title: "Education & Local Gov",
    body: "Universities, local councils, and education bodies are investing heavily in data capability. Roles are often more accessible to career switchers, offer hybrid working, and provide genuine job security.",
    roles: ["Data Analyst", "Reporting Analyst", "Data Governance"],
  },
  {
    icon: "📡",
    title: "Tech & Consulting",
    body: "From Big Four consultancies to scale-ups, tech companies and consultancies offer data roles with rapid learning curves, strong salaries, and the chance to work across multiple industries at once.",
    roles: ["Data Consultant", "ML Engineer", "Analytics Engineer"],
  },
];

const TESTIMONIALS = [
  {
    id: "jerry",
    videoId: JERRY_VIDEO_ID,
    label: "Jerry's story",
    initials: "JO",
    name: "Jerry Olatoyan",
    role: "Data Analyst · UK Civil Service",
    quote:
      '"I went from knowing nothing about SQL to landing a Data Analyst role at the UK Civil Service. The way Amdari broke down the Civil Service application process was something I couldn\'t find anywhere else."',
  },
  {
    id: "opeyemi",
    videoId: OPEYEMI_VIDEO_ID,
    label: "Opeyemi's story",
    initials: "OP",
    name: "Opeyemi",
    role: "Data Scientist · UK",
    quote:
      '"I had a science background but no idea how to turn it into a data science career in the UK. Within weeks of joining the programme I had my first interview, and shortly after that — my first offer."',
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

const DataWebinarPage = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [stage, setStage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      if (!firstName.trim() || !email.trim() || !phone.trim()) {
        setFormError("Please fill in your name, email, and phone number.");
        return;
      }

      setSubmitted(true);
    },
    [email, firstName, phone],
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* TOP BAR */}
      <div className="bg-[#FFE082] px-4 py-[9px] text-center text-[12.5px] font-bold tracking-[0.01em] text-[#0C2730]">
        Free webinar
        <span className="mx-2 inline-block h-[7px] w-[7px] animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-[#0C2730] align-middle" />
        Land a Data Job in the UK — Register below to save your spot
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/97 px-[5%] py-4 backdrop-blur-[8px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <div className="hidden rounded-full border border-[#156374]/45 bg-[#156374]/15 px-3.5 py-[5px] text-[11.5px] font-semibold tracking-[0.05em] text-[#C7D5D6] sm:block">
          DATA TECH CAREERS
        </div>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-12 px-[5%] pb-10 pt-[52px] lg:grid-cols-[1fr_420px]">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-[7px] rounded-full border border-[#FFE082]/28 bg-[#FFE082]/10 px-3.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-[#FFE082]">
            <span className="h-[7px] w-[7px] animate-[blink_1.4s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
            Free Online Webinar
          </div>

          <h1 className="mb-[18px] text-[clamp(26px,4.2vw,46px)] font-black leading-[1.2] tracking-normal text-white">
            How to Land a Data<br />Job in the UK —<br />
            <em className="not-italic text-[#FFE082]">From Scratch.</em>
          </h1>

          <p className="mb-7 max-w-[480px] text-[15px] leading-[1.65] text-[#C7D5D6]">
            Whether you&apos;re targeting Data Analytics, Data Science, or Data
            Engineering — this free session maps the exact path UK employers
            expect, and how you can get there faster than you think.
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
              Takes 30 seconds. You&apos;ll get the link and a reminder before
              we go live.
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

              <button
                type="submit"
                className="mt-1 w-full cursor-pointer rounded-lg bg-[#FFE082] py-3.5 text-[14.5px] font-extrabold tracking-[-0.01em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] active:scale-[0.99]"
              >
                Save My Free Spot →
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
          <em className="not-italic text-[#FFE082]">actively hiring</em> data
          talent
        </h2>
        <p className="mb-8 max-w-[640px] text-[14px] leading-[1.65] text-[#C7D5D6]">
          Data roles in the UK aren&apos;t just in fintech and startups. The
          biggest, most stable, and fastest-growing demand is coming from public
          sector organisations — many of which offer permanent contracts,
          generous pensions, and clear progression paths.
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
          These organisations actively recruit internationally and have
          structured onboarding for data professionals. In this webinar,
          we&apos;ll walk through how to navigate the NHS jobs portal and Civil
          Service Jobs platform — including what to put on your application to
          stand out.
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
                        {testi.label}
                      </strong>{" "}
                      — watch now
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
                    <div className="ml-auto whitespace-nowrap rounded-full border border-[#22c55e]/25 bg-[#22c55e]/10 px-2.5 py-[3px] text-[10px] font-bold tracking-[0.04em] text-[#4ade80]">
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
          © 2025 Amdari. Helping career switchers land UK data jobs.
        </p>
      </footer>
    </div>
  );
};

export default DataWebinarPage;
