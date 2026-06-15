"use client";

import React from "react";
import Image from "next/image";

// TODO: replace with real YouTube video IDs
const INVITE_VIDEO_ID = "VIDEO_ID";
const TESTI1_VIDEO_ID = "VIDEO_ID";
const TESTI2_VIDEO_ID = "VIDEO_ID";

const TRACKS = [
  "SOC Analyst (Security Operations)",
  "GRC (Governance, Risk & Compliance)",
  "Application Security",
  "Cloud Security",
  "Not sure yet — help me choose",
];

const STAGES = [
  "Complete beginner",
  "Some self-study / courses",
  "IT background, moving into security",
  "Switching from a non-tech career",
];

const LEARN_ITEMS = [
  {
    num: "01",
    title: "SOC vs GRC vs Cloud Security — Which Is Yours?",
    body: "A clear breakdown of the three most in-demand cybersecurity paths in the UK, who each one suits, and how to pick based on your existing background — technical or not.",
  },
  {
    num: "02",
    title: "The UK Cyber Skills Gap — And Why It Works For You",
    body: "The UK government has declared a national cybersecurity skills shortage. We'll show you the real data on open roles, average salaries, and why 2025 is the best time to make this switch.",
  },
  {
    num: "03",
    title: "Breaking Into the NHS & Public Sector via Cyber",
    body: "The NHS is one of the UK's most targeted organisations for cyberattacks — and it's investing heavily in security talent. We'll cover NHS CISO roles, NCSC-backed programmes, and how to position yourself for public sector cyber jobs.",
  },
  {
    num: "04",
    title: "Certifications That Open Doors Fast",
    body: "CompTIA Security+, SC-200, ISO 27001, CEH, CISSP — which ones UK employers actually look for, which to prioritise at entry level, and how to stack them strategically.",
  },
  {
    num: "05",
    title: "Your 60-Day Roadmap to Job-Ready",
    body: "A realistic week-by-week plan covering training, lab practice, cert prep, and applications — structured so you can do it alongside a job or other commitments.",
  },
  {
    num: "06",
    title: "How to Write a Cyber CV With No Direct Experience",
    body: "The exact framework for translating transferable skills — IT support, networking, even non-tech roles — into a compelling security CV that clears ATS screening and gets shortlisted.",
  },
  {
    num: "07",
    title: "Security Clearance, DV & SC — What You Need to Know",
    body: "Many Civil Service and defence cyber roles require Security Check (SC) or Developed Vetting (DV) clearance. We'll demystify the process, timeline, and what it means for your job search as an international candidate.",
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
    body: "Following high-profile ransomware attacks, NHS trusts, NHS England, and NHS Digital are investing massively in cybersecurity headcount. Roles span SOC analysts, GRC advisors, and cloud security specialists — many at Band 6–8 with clear progression routes.",
    roles: [
      "SOC Analyst",
      "Cyber Risk Advisor",
      "IG / Data Security",
      "Cloud Security",
    ],
  },
  {
    icon: "🏛️",
    title: "UK Civil Service & Defence",
    body: "GCHQ, NCSC, MoD, HMRC, and the Home Office all run large cybersecurity functions. The Civil Service Cyber Fast Stream and NCSC graduate schemes offer structured entry points, and many departments hire at all levels through Civil Service Jobs.",
    roles: [
      "Security Analyst",
      "GRC Specialist",
      "Pen Tester",
      "SIEM Engineer",
    ],
  },
  {
    icon: "🏦",
    title: "Financial Services",
    body: "UK banks, insurers, and payment firms face the most sophisticated threat actors in the world — and build some of the most mature security operations accordingly. Barclays, HSBC, Lloyds, and hundreds of fintechs hire cyber talent continuously at all seniority levels.",
    roles: [
      "SOC Analyst (L1–L3)",
      "Threat Intelligence",
      "AppSec Engineer",
      "Risk & Compliance",
    ],
  },
  {
    icon: "⚡",
    title: "Critical National Infrastructure",
    body: "Energy companies, water utilities, and transport operators — National Grid, Thames Water, TfL, Network Rail — protect systems that the entire country depends on. OT/ICS security and cloud security roles are growing fast here, often with visa sponsorship.",
    roles: ["OT Security Analyst", "Cloud Security Eng.", "Incident Responder"],
  },
  {
    icon: "☁️",
    title: "Tech & Cloud Providers",
    body: "AWS, Microsoft, Google, and their UK partner ecosystem are all expanding their security practices. Cloud security and AppSec are among the highest-paid entry points in the industry — and they're actively recruiting people from non-traditional backgrounds.",
    roles: [
      "Cloud Security Eng.",
      "DevSecOps",
      "AppSec Analyst",
      "Security Architect",
    ],
  },
  {
    icon: "🔍",
    title: "Consulting & MSSPs",
    body: "Managed Security Service Providers and Big Four consultancies (Deloitte, PwC, KPMG, EY) hire cyber talent in volume. These roles build skills at pace — you work across multiple client environments — and create a CV that opens doors everywhere else.",
    roles: [
      "GRC Consultant",
      "SOC Analyst",
      "Cyber Consultant",
      "ISO 27001 Lead",
    ],
  },
];

const TESTIMONIALS = [
  {
    id: "testi1",
    videoId: TESTI1_VIDEO_ID,
    initials: "TG",
    name: "Testimonial Graduate 1",
    role: "SOC Analyst · UK Financial Services",
    quote:
      '"I came from IT support and had no idea how to break into security. Amdari mapped out the SOC analyst path, helped me get CompTIA Security+, and within 7 weeks I had my first interview. I landed a Tier 1 SOC role at a financial services firm."',
  },
  {
    id: "testi2",
    videoId: TESTI2_VIDEO_ID,
    initials: "AM",
    name: "Testimonial Graduate 2",
    role: "Cyber Risk Advisor · NHS Trust",
    quote:
      '"I switched from compliance in banking into GRC security. The ISO 27001 training and the way Amdari coached me on NHS job applications made all the difference. I got a Cyber Risk Advisor role at an NHS trust in under 60 days."',
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

const CyberWebinarPage = () => {
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
        Land a Cybersecurity Job in the UK — Register below to save your spot
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/97 px-[5%] py-4 backdrop-blur-[8px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <div className="rounded-full hidden sm:block border border-[#156374]/45 bg-[#156374]/15 px-3.5 py-[5px] text-[11.5px] font-semibold tracking-[0.05em] text-[#C7D5D6]">
          CYBERSECURITY CAREERS
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
            Break Into
            <br />
            Cybersecurity in the UK —<br />
            <em className="not-italic text-[#FFE082]">SOC, GRC, or Cloud.</em>
          </h1>

          <p className="mb-7 max-w-[480px] text-[15px] leading-[1.65] text-[#C7D5D6]">
            The UK has a critical cybersecurity skills shortage — and employers
            are actively hiring people who make the switch. This free session
            shows you which path fits your background, what certifications open
            doors, and how to land your first role fast.
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
                  Which path interests you most?
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
          <em className="not-italic text-[#FFE082]">actively hiring</em>{" "}
          cybersecurity talent
        </h2>
        <p className="mb-8 max-w-[640px] text-[14px] leading-[1.65] text-[#C7D5D6]">
          Cybersecurity roles exist in every sector — but the UK&apos;s most
          consistent and best-funded demand comes from government, critical
          national infrastructure, financial services, and healthcare. These
          organisations hire in volume, often support visa sponsorship, and
          offer clear career progression.
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
            Note on Security Clearance:
          </strong>{" "}
          Many Civil Service and defence cyber roles require SC or DV clearance.
          We&apos;ll walk through exactly what this means, how long it takes,
          and whether it affects candidates from outside the UK — including
          which roles you can apply for while clearance is pending.
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
          © 2025 Amdari. Helping career switchers land UK cybersecurity jobs.
        </p>
      </footer>
    </div>
  );
};

export default CyberWebinarPage;
