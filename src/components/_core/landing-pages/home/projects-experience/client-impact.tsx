"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Story = {
  name: string;
  role: string;
  quote: string;
  image?: string;
};

const LEFT: Story[] = [
  {
    name: "Azuka, UK",
    role: "Project Management",
    quote:
      'Awesome moral boaster work experience. I\'m still undergoing my work experience session with Amdari, I must say the experience has been nothing but top notch especially the support and mentorship from our coach "Blessing E."',
    image: "/images/pngs/new-home/impact-1.png",
  },
  {
    name: "Henry, UK",
    role: "Data Analysis",
    quote:
      "My experience at AMDARI as a data science consultant has been great so far. Working on projects that are in demand and industrial based. Well coordinated. And the staff know the onus is on you if you really want to get work experience and get involve in live projects.",
  },
  {
    name: "Chinedu, USA",
    role: "Data Science",
    quote:
      "What stands out most is the culture of innovation and collaboration, there's a strong focus on building practical solutions with real-world value. It has been a great place to grow while contributing to work that makes an impact.",
    image: "/images/pngs/new-home/impact-2.png",
  },
];

const RIGHT: Story[] = [
  {
    name: "Japhet, UK",
    role: "Product design",
    quote:
      "Completing the Amdari Product Design Programme has been an excellent and rewarding experience. I had the opportunity to apply what I was learning to real design challenges, which helped me better understand the product design process",
  },
  {
    name: "Esther, UK",
    role: "Data Engineering",
    quote:
      "Had a wonderful experience with Amdari team, lots of real world projects to work on, My cordinator was very responsive to all questions and even when I needed reference for my Job, the team were all helpful.",
    image: "/images/pngs/new-home/imapact-3.png",
  },
  {
    name: "Ayotunde, US",
    role: "Data Engineer",
    quote:
      "Amdari provided me with solid hands-on experience in Data Engineering. Working on real-world scenarios and practical projects helped bridge the gap between theoretical knowledge and actual industry application.",
  },
];

const Author = ({
  name,
  role,
  onDark,
}: {
  name: string;
  role: string;
  onDark?: boolean;
}) => (
  <div className="mt-4 flex items-center gap-2.5">
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        onDark ? "bg-white/20 text-white" : "bg-[#E7F3F5] text-[#156374]"
      }`}
    >
      {name.charAt(0)}
    </span>
    <div className="leading-tight">
      <p className={`font-clash-display capitalize font-display text-sm font-semibold ${onDark ? "text-white" : "text-[#156374]"}`}>
        {name}
      </p>
      <p className={`text-xs ${onDark ? "text-white/75" : "text-[#7B8A90]"}`}>{role}</p>
    </div>
  </div>
);

const ImageCard = ({ story }: { story: Story }) => (
  <article className="relative h-full min-h-[424px] overflow-hidden rounded-xl">
    <Image
      src={story.image ?? ""}
      alt=""
      fill
      className="object-cover"
      sizes="(min-width: 1024px) 28vw, 80vw"
    />
    <div className="absolute inset-0 bg-linear-to-t from-[#071E24]/90 via-[#071E24]/25 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
      <p className="line-clamp-4 text-sm leading-relaxed text-white">{story.quote}</p>
      <Author name={story.name} role={story.role} onDark />
    </div>
  </article>
);

const TextCard = ({ story }: { story: Story }) => (
  <article className="flex h-[200px] flex-col justify-between rounded-xl bg-[#F4F7F8] p-4 sm:p-5">
    <p className="line-clamp-6 text-sm leading-relaxed text-[#1C3A42]">{story.quote}</p>
    <Author name={story.name} role={story.role} />
  </article>
);

const StoryColumn = ({
  stories,
  delay,
  reverse = false,
}: {
  stories: Story[];
  delay: number;
  reverse?: boolean;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const paused = useRef(false);
  const autoplay = useRef(
    Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const slides = [...stories, stories[1]];

  useEffect(() => {
    if (!reverse || !api) return;

    const root = api.rootNode();
    const pause = () => {
      paused.current = true;
    };
    const resume = () => {
      paused.current = false;
    };

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);

    const timer = window.setInterval(() => {
      if (!paused.current) api.scrollPrev();
    }, delay);

    return () => {
      window.clearInterval(timer);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
    };
  }, [api, delay, reverse]);

  return (
    <Carousel
      setApi={setApi}
      orientation="vertical"
      plugins={reverse ? undefined : [autoplay.current]}
      opts={{ align: "start", loop: true, duration: 35 }}
      className="h-[648px]"
    >
      <CarouselContent className="-mt-3 h-[648px]">
        {slides.map((story, index) => (
          <CarouselItem
            key={`${story.name}-${index}`}
            className={story.image ? "basis-[436px] pt-3" : "basis-[212px] pt-3"}
          >
            {story.image ? <ImageCard story={story} /> : <TextCard story={story} />}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const ClientImpact = () => {
  return (
    <section className="pt-8 pb-14 lg:pt-10 lg:pb-20">
      <div className="app-width">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(180px,0.7fr)_1fr_1fr] lg:gap-4">
          <h2 className="text-4xl font-semibold text-[#092A31] sm:text-5xl lg:pt-2">
            Client impact
          </h2>
          <StoryColumn stories={LEFT} delay={3200} />
          <StoryColumn stories={RIGHT} delay={3200} reverse />
        </div>
      </div>
    </section>
  );
};

export default ClientImpact;
