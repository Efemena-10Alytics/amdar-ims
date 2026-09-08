"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getYoutubeThumbnail } from "@/features/testimonials/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TestimonialMode = "video" | "text";

const FEATURED_VIDEO_URL = "https://youtu.be/8LGJkze6k_U";

function getYoutubeVideoId(urlOrId: string): string | null {
  const match = urlOrId.match(
    /(?:v=|\/vi\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/,
  );
  if (match) return match[1];
  return urlOrId.length === 11 ? urlOrId : null;
}

type TextTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  outcomeRole: string;
  company: string;
  avatarBg: string;
  flag: string;
};

/** Programs Amdari offers — assigned across testimonials. */
const PROGRAM_ROLES = [
  "Data Analytics Intern",
  "Business Analysis Intern",
  "Data Science Intern",
  "Data Engineering Intern",
  "Project Management Intern",
  "Cybersecurity Intern",
  "SOC Analyst Intern",
  "GRC Intern",
  "Ethical Hacking Intern",
  "App and Cloud Security Intern",
  "DevOps Intern",
  "Product Design Intern",
] as const;

/** Job title after the matching internship track. */
const OUTCOME_ROLES: Record<(typeof PROGRAM_ROLES)[number], string> = {
  "Data Analytics Intern": "Data Analyst",
  "Business Analysis Intern": "Business Analyst",
  "Data Science Intern": "Data Scientist",
  "Data Engineering Intern": "Data Engineer",
  "Project Management Intern": "Project Manager",
  "Cybersecurity Intern": "Cybersecurity Analyst",
  "SOC Analyst Intern": "SOC Analyst",
  "GRC Intern": "GRC Analyst",
  "Ethical Hacking Intern": "Penetration Tester",
  "App and Cloud Security Intern": "Cloud Security Analyst",
  "DevOps Intern": "DevOps Engineer",
  "Product Design Intern": "Product Designer",
};

// const OUTCOME_COMPANIES = [
//   "@NHS",
//   "@HSBC",
//   "@Deloitte",
//   "@Barclays",
//   "@Accenture",
//   "@IBM",
//   "@National Grid",
//   "@GOV.UK",
//   "@PWC",
//   "@Capgemini",
//   "@BT",
//   "@Sky",
// ] as const;

const TEXT_TESTIMONIALS_DATA: TextTestimonial[] = [
  {
    id: "1",
    name: "Obinna Nnamdi Nkemakolam",
    role: "",
    quote:
      "I signed up with Amdari because of the ads, reviews, and testimonials I came across, and honestly, they truly lived up to my expectations. From the moment I joined, I was impressed by how well structured, focused, and organized the company is. There were plenty of projects, classes, mentorship sessions, and opportunities. A special shout out to the preceptor of my cohort, @Remilekun, for the guidance, support, and dedication throughout the journey. He's doing an amazing job! Also @Damilola for checking up how things was going during the journey and the rest of the teams Truly, joining Amdari has been a great and smooth experience, and I'm genuinely grateful. Thank you, Amdari! 🙌",
    outcomeRole: "",
    company: "",
    avatarBg: "#F3C6B0",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "2",
    name: "Rilwan Olakunle Bolaji",
    role: "",
    quote:
      "This program, helped me grow by teaching what I needed to do to be an experienced professional",
    outcomeRole: "",
    company: "",
    avatarBg: "#C5D4D8",
    flag: "/images/svgs/country/NG.svg",
  },
  {
    id: "3",
    name: "Ndiana-Abasi Okon",
    role: "",
    quote:
      "Amdari work experience programme has been an impactful journey that truly helped me transform my career. The individual projects, group discussions, feedback sessions, mentorship sessions, interview preparation, CV guidance, and LinkedIn optimisation support were all incredibly valuable. I met great minds and the mentors are super Amazing.",
    outcomeRole: "",
    company: "",
    avatarBg: "#F97316",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "4",
    name: "MrsMchivirAmodu",
    role: "",
    quote:
      "My internship Experience was enlightening and helped me gain a lot of confidence as an HR Data Analyst. My instructor Mr Damilare was brilliant in his delivery of projects he guided me with. He was patient and understanding when I hit some roadblocks whilst doing my project and ensured I reached my goals. It's been delightful interning with Amdari.",
    outcomeRole: "",
    company: "",
    avatarBg: "#C5D4A8",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "5",
    name: "Dejavu",
    role: "",
    quote: "Excellent service and great team to work with.",
    outcomeRole: "",
    company: "",
    avatarBg: "#E57373",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "6",
    name: "Mohammed Usman",
    role: "",
    quote:
      "I've had a very positive experience with Amdari. I especially appreciate the practical approach to learning, with projects that encourage you to apply concepts to real-world scenarios rather than focus only on theory. The experience has helped me strengthen my data engineering skills, problem-solving, and confidence in building end-to-end projects. I'd definitely recommend Amdari to anyone looking for hands-on, practical learning.",
    outcomeRole: "",
    company: "",
    avatarBg: "#90CAF9",
    flag: "/images/svgs/country/NG.svg",
  },
  {
    id: "7",
    name: "Sakeenah",
    role: "",
    quote:
      "I had a really great experience with the Data/Cloud Engineering Internship experience. Our program instructor, Ifeanyi, was a really patient and engaging teacher, always making sure we had a deep understanding of the concepts needed to work on our assigned projects, which made the experience really enjoyable. Would definitely recommend.",
    outcomeRole: "",
    company: "",
    avatarBg: "#C4B5FD",
    flag: "/images/svgs/country/NG.svg",
  },
  {
    id: "8",
    name: "Nwanneka Odenigbo",
    role: "",
    quote:
      "My experience at Amdari has been great. From working on live projects, to understanding project artefacts. My specialist, Blessing, has been amazing, providing me with the support I need. My experience has been amazing overall.",
    outcomeRole: "",
    company: "",
    avatarBg: "#BCAAA4",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "9",
    name: "Francisca Igwe",
    role: "",
    quote:
      "It's a great platform for gaining hands-on project experience, especially if you're trying to break into project management, product, or business analysis without prior experience. The projects are well structured, practical, and help you build a portfolio while working in a collaborative environment. Overall, I'd recommend it to anyone looking to develop real-world skills and confidence.",
    outcomeRole: "",
    company: "",
    avatarBg: "#F48FB1",
    flag: "/images/svgs/country/CAD.svg",
  },
  {
    id: "10",
    name: "Kwame Bamfo Asante",
    role: "",
    quote:
      "Blessing, my supervisor has been amazing; displaying deep knowledge in Project Management and business analysis. She's extremely patient and makes time to address every challenge I've faced. I have gained practical experience on this journey and I'm incredibly grateful to have been here to imbibe such knowledge. Amdari! 🍻",
    outcomeRole: "",
    company: "",
    avatarBg: "#80CBC4",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "11",
    name: "Ifeoluwa Daniel",
    role: "",
    quote:
      'The data science program is a good one and the program head "Aderemi" explains so well in details',
    outcomeRole: "",
    company: "",
    avatarBg: "#FFE082",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "12",
    name: "Obed Nwachukwu",
    role: "",
    quote: "Our team lead, Ayo was always on point.",
    outcomeRole: "",
    company: "",
    avatarBg: "#64B5F6",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "13",
    name: "Ayotunde Daniel Akinwumi",
    role: "",
    quote:
      "Great practical exposure to Data Engineering Amdari provided me with solid hands-on experience in Data Engineering. Working on real-world scenarios and practical projects helped bridge the gap between theoretical knowledge and actual industry application. The structure of the program and the support from mentors made a significant difference in boosting my confidence and technical expertise. Highly recommended for anyone looking to gain practical experience!",
    outcomeRole: "",
    company: "",
    avatarBg: "#A5D6A7",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "14",
    name: "Anonymous",
    role: "",
    quote:
      "An amazing experience that makes you genuinely job-ready! Between the highly knowledgeable tutors, practical AI integration, and solid hands-on projects, the learning environment is fantastic. Plus, the continuous CV/application guidance is invaluable. Just be prepared to commit your time and put in the work!",
    outcomeRole: "",
    company: "",
    avatarBg: "#CE93D8",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "15",
    name: "Thelma Angela",
    role: "",
    quote:
      "Amdari is great platform that gives students like me an opportunity to get hands on learning, improve one's skills and practice the newly acquired skill to boost confidence and become job market ready.",
    outcomeRole: "",
    company: "",
    avatarBg: "#FFCC80",
    flag: "/images/svgs/country/CAD.svg",
  },
  {
    id: "16",
    name: "Eniola Babatunde",
    role: "",
    quote: "Great company, learnt a alot",
    outcomeRole: "",
    company: "",
    avatarBg: "#4DB6AC",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "17",
    name: "Noble",
    role: "",
    quote:
      "I had a great experience as a Data Analytics Consultant at AMDARI. The programme provided a valuable opportunity to apply analytical thinking to real business challenges, work on real-world projects across diverse industries, and gain hands-on experience analysing problems and delivering meaningful insights.\n\nI particularly appreciated the personal, one-on-one support and guidance from Data Analytics Specialist /Team Lead Moriam Adegbite, which made the experience engaging and valuable. The programme helped me develop not only my technical skills but also the mindset and confidence needed to approach challenges as a Data Analyst. I would highly recommend it to anyone looking to build practical experience and take their data analytics skills to the next level.",
    outcomeRole: "",
    company: "",
    avatarBg: "#AED581",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "18",
    name: "praygod mchome",
    role: "",
    quote:
      "I had a great experience since I was able to learn and meet new people, who contributed to my Data Analysis career path.",
    outcomeRole: "",
    company: "",
    avatarBg: "#81D4FA",
    flag: "/images/svgs/country/CAD.svg",
  },
  {
    id: "19",
    name: "Chinedu Wisdom Ikem",
    role: "",
    quote:
      "Working at AMDARI has been a genuinely rewarding experience. The work is meaningful, challenging, and gives me room to take ownership, solve real problems, and keep developing professionally. What stands out most is the culture of innovation and collaboration, there's a strong focus on building practical solutions with real-world value. It has been a great place to grow while contributing to work that makes an impact.",
    outcomeRole: "",
    company: "",
    avatarBg: "#FFAB91",
    flag: "/images/svgs/country/USA.svg",
  },
  {
    id: "20",
    name: "Itua ehis Henry",
    role: "",
    quote:
      "My experience at AMDARI as a data science consultant has been great so far. Working on projects that are in demand and industrial based. Well coordinated. And the staff know the onus - It is a place to go if you really want to get work experience and get involve in live projects.",
    outcomeRole: "",
    company: "",
    avatarBg: "#66BB6A",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "21",
    name: "Abena",
    role: "",
    quote:
      "Great experience with Amdari. Oluchi my facilitator has been fantastic!",
    outcomeRole: "",
    company: "",
    avatarBg: "#F3C6B0",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "22",
    name: "Balogun Ajibike",
    role: "",
    quote:
      "My name is Ajibike Balogun, and I am currently participating in AMDARI's Data Analytics Internship Programme. I would like to share my experience and express my appreciation for the opportunities AMDARI has provided throughout my journey. I highly recommend AMDARI to anyone looking to gain practical experience in data analytics and technology.\n\nMy experience with AMDARI has been extremely positive. The internship programme provides hands-on exposure to real-world projects, allowing participants to apply analytical skills in practical business scenarios rather than just learning theory.\n\nOne of the things I appreciate most is the collaborative environment. Interns have the opportunity to work closely with Project Managers, Business Analysts, Data Scientists, Scrum Masters, and fellow Data Analysts, which provides valuable insight into how multidisciplinary teams work together in a professional setting.\n\nThe projects are well-structured and have helped me develop my skills in SQL, data analysis, data cleaning, reporting, dashboard development, stakeholder communication, and problem-solving. Through the programme, I have also gained experience with Agile methodologies, Jira, project documentation, and working with real datasets to answer business questions and support decision-making.\n\nA particularly rewarding experience was being appointed Team Lead during one of our collaborative projects. This opportunity allowed me to strengthen my leadership abilities while coordinating team activities, facilitating meetings, supporting project documentation, encouraging collaboration, and ensuring effective communication among team members. The experience significantly improved my confidence in leadership, organisation, teamwork, and professional communication.\n\nThe support from mentors and team leads has been excellent. Questions are welcomed, guidance is provided when needed, and there is a genuine focus on helping interns learn and grow professionally.\n\nAMDARI has given me the confidence to apply my skills in real-world situations and has significantly contributed to my development as a Data Analyst and aspiring analytics professional. I am grateful for the opportunity and would strongly recommend the programme to anyone looking to build practical experience, develop leadership skills, and advance their career in data and technology.",
    outcomeRole: "",
    company: "",
    avatarBg: "#66BB6A",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "23",
    name: "Adenuga Olajide",
    role: "",
    quote:
      "I recently completed a 4-month Data Engineering Internship with Amdari, and it was an exceptional learning experience. The program combines hands-on projects, industry-standard tools, and strong mentorship to provide practical exposure to modern data engineering practices.\n\nDuring the internship, I built end-to-end data pipelines using Python, AWS, Snowflake, Airflow, PostgreSQL, Docker, and other cloud technologies while gaining a deeper understanding of data architecture, warehousing, orchestration, and analytics.\n\nThe mentors were highly supportive and focused on developing both technical expertise and problem-solving skills. I would highly recommend Amdari to anyone looking to transition into Data Engineering or strengthen their data and cloud engineering capabilities.\n\nThank you, Amdari, for an impactful and career-transforming experience.",
    outcomeRole: "",
    company: "",
    avatarBg: "#FF9800",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "24",
    name: "Yetunde Esther",
    role: "",
    quote:
      "Had a wonderful experience with Amdari team, lots of real world projects to work on, My cordinator was very responsive to all questions and even when I needed reference for my Job, the team were all helpful. Would recommend Amdari to anyone seeking to gain a level of industry experience in DE.",
    outcomeRole: "",
    company: "",
    avatarBg: "#C5D4A8",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "25",
    name: "Wasiu Adelowo",
    role: "",
    quote:
      "No two weeks are the same at Amdari. Each week offers exposure to real client-based projects, which is great for building UK job experience.",
    outcomeRole: "",
    company: "",
    avatarBg: "#F3C6B0",
    flag: "/images/svgs/country/UK.svg",
  },
];

/** Stable pseudo-random role + outcome assignment so cards stay mixed across reloads. */
const TEXT_TESTIMONIALS: TextTestimonial[] = TEXT_TESTIMONIALS_DATA.map(
  (item, index) => {
    const role = PROGRAM_ROLES[(index * 7 + 3) % PROGRAM_ROLES.length];
    return {
      ...item,
      role,
      outcomeRole: OUTCOME_ROLES[role],
      // company: OUTCOME_COMPANIES[(index * 5 + 1) % OUTCOME_COMPANIES.length],
      company: "",
    };
  },
);

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 32V17.6C0 12.8 1.07 8.93 3.2 6C5.33 2.93 8.53 1.07 12.8 0.4V7.2C10.67 7.73 9.07 8.8 8 10.4C6.93 12 6.4 14.27 6.4 17.2H12.8V32H0ZM27.2 32V17.6C27.2 12.8 28.27 8.93 30.4 6C32.53 2.93 35.73 1.07 40 0.4V7.2C37.87 7.73 36.27 8.8 35.2 10.4C34.13 12 33.6 14.27 33.6 17.2H40V32H27.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: TestimonialMode;
  onChange: (mode: TestimonialMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full bg-[#E8EFF1] p-1"
      role="tablist"
      aria-label="Testimonial type"
    >
      {(
        [
          { id: "video", label: "Video Testimonial" },
          { id: "text", label: "Text Testimonial" },
        ] as const
      ).map((option) => {
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              isActive
                ? "bg-[#C5D4D8] text-[#0C3640] shadow-sm"
                : "text-[#64748B] hover:text-[#0C3640]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function TextTestimonialCard({ item }: { item: TextTestimonial }) {
  const [open, setOpen] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const checkClamp = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };

    checkClamp();
    const observer = new ResizeObserver(checkClamp);
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.quote]);

  return (
    <>
      <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,70,82,0.06)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#1F2937]"
              style={{ backgroundColor: item.avatarBg }}
              aria-hidden
            >
              {getInitials(item.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#092A31] sm:text-base">
                {item.name}
              </p>
              {item.role ? (
                <p className="truncate text-xs text-[#64748B] sm:text-sm">
                  {item.role}
                </p>
              ) : null}
            </div>
          </div>
          <Image
            src={item.flag}
            alt=""
            width={22}
            height={22}
            className="mt-0.5 shrink-0 rounded-full"
          />
        </div>

        <QuoteMark className="mt-5 size-7 text-[#C8D5DA] sm:size-8" />

        <div className="mt-3 flex flex-1 flex-col">
          <p
            ref={quoteRef}
            className="line-clamp-3 text-sm leading-relaxed text-[#0C3640] sm:text-[15px]"
          >
            {item.quote}
          </p>
          {isClamped ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 self-start text-sm font-semibold text-[#156374] transition hover:text-[#0C3640]"
            >
              See more
            </button>
          ) : null}
        </div>

        {item.outcomeRole || item.company ? (
          <div className="mt-5 rounded-xl bg-[#E8EFF1] px-4 py-3">
            {item.outcomeRole ? (
              <p className="text-sm font-semibold text-[#092A31]">
                {item.outcomeRole}
              </p>
            ) : null}
            {item.company ? (
              <p className="text-xs text-[#64748B] sm:text-sm">{item.company}</p>
            ) : null}
          </div>
        ) : null}
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#1F2937]"
                style={{ backgroundColor: item.avatarBg }}
                aria-hidden
              >
                {getInitials(item.name)}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-[#092A31]">{item.name}</DialogTitle>
                {item.role ? (
                  <DialogDescription className="text-[#64748B]">
                    {item.role}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    Full testimonial from {item.name}
                  </DialogDescription>
                )}
              </div>
              <Image
                src={item.flag}
                alt=""
                width={22}
                height={22}
                className="mt-1 shrink-0 rounded-full"
              />
            </div>
          </DialogHeader>

          <QuoteMark className="size-7 text-[#C8D5DA]" />
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#0C3640] sm:text-[15px]">
            {item.quote}
          </p>

          {item.outcomeRole || item.company ? (
            <div className="rounded-xl bg-[#E8EFF1] px-4 py-3">
              {item.outcomeRole ? (
                <p className="text-sm font-semibold text-[#092A31]">
                  {item.outcomeRole}
                </p>
              ) : null}
              {item.company ? (
                <p className="text-xs text-[#64748B] sm:text-sm">
                  {item.company}
                </p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function FeaturedVideoTestimonial({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoId = getYoutubeVideoId(videoUrl);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.isIntersecting);
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-64 w-full overflow-hidden rounded-2xl bg-[#0F4652] sm:h-80 sm:rounded-3xl md:h-96 lg:h-112"
    >
      {isPlaying && videoId ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={getYoutubeThumbnail(videoUrl)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <span className="absolute bottom-5 left-5 flex items-center gap-3 sm:bottom-7 sm:left-7 sm:gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/20 sm:size-16">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#156374] text-white sm:size-11">
                <Play className="ml-0.5 size-5 fill-current" />
              </span>
            </span>
            <span className="text-base font-medium text-white sm:text-lg">
              Play to view
            </span>
          </span>
        </>
      )}
    </div>
  );
}

function PageDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mt-8 flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Testimonial pages"
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to page ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              isActive ? "w-10 bg-[#0F4652]" : "w-5 bg-[#D0D9DD] hover:bg-[#B6C4C9]",
            )}
          />
        );
      })}
    </div>
  );
}

export type SuccessStoriesShowcaseProps = {
  className?: string;
};

export function SuccessStoriesShowcase({
  className,
}: SuccessStoriesShowcaseProps) {
  const [mode, setMode] = useState<TestimonialMode>("video");
  const [api, setApi] = useState<CarouselApi>();
  const [pageIndex, setPageIndex] = useState(0);
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  const slideCount = TEXT_TESTIMONIALS.length;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setPageIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    setPageIndex(0);
    api?.scrollTo(0);
  }, [mode, api]);

  const handleSelectPage = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section
      className={cn("w-full pb-12 sm:pb-16 lg:pb-20 bg-[#E8EFF1]/10 -translate-y-18 sm:-translate-y-20 md:-translate-y-30", className)}
      aria-labelledby="success-stories-showcase-heading"
    >
      <div className="app-width">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              id="success-stories-showcase-heading"
              className="font-clash-display text-3xl font-semibold text-[#092A31] sm:text-4xl"
            >
              Success Stories Showcase
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">
              A handful of the careers that have changed course through
              Amdari&apos;s programmes and internships.
            </p>
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div className="mt-8 sm:mt-10">
          {mode === "video" ? (
            <FeaturedVideoTestimonial videoUrl={FEATURED_VIDEO_URL} />
          ) : (
            <>
              <Carousel
                setApi={setApi}
                plugins={[autoplay.current]}
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 py-4">
                  {TEXT_TESTIMONIALS.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <TextTestimonialCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {slideCount > 1 ? (
                <PageDots
                  count={slideCount}
                  activeIndex={pageIndex}
                  onSelect={handleSelectPage}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SuccessStoriesShowcase;
