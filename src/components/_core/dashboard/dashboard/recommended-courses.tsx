"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
type CourseLevel = "Beginner" | "Intermediate";

type RecommendedCourse = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  rating: number;
  image: string;
  href: string;
};

const COURSES: RecommendedCourse[] = [
  {
    id: "1",
    title: "Product Design & Managment",
    description:
      "Create user-centered designs, product requirements, roadmaps, prototypes, and...",
    level: "Intermediate",
    rating: 4.5,
    image: "/images/pngs/laptop.png",
    href: "#",
  },
  {
    id: "2",
    title: "Product Design & Managment",
    description:
      "Create user-centered designs, product requirements, roadmaps, prototypes, and...",
    level: "Beginner",
    rating: 4.5,
    image: "/images/pngs/laptop.png",
    href: "#",
  },
  {
    id: "3",
    title: "Product Design & Managment",
    description:
      "Create user-centered designs, product requirements, roadmaps, prototypes, and...",
    level: "Intermediate",
    rating: 4.5,
    image: "/images/pngs/laptop.png",
    href: "#",
  },
  {
    id: "4",
    title: "Product Design & Managment",
    description:
      "Create user-centered designs, product requirements, roadmaps, prototypes, and...",
    level: "Intermediate",
    rating: 4.5,
    image: "/images/pngs/laptop.png",
    href: "#",
  },
];

function CourseCard({ course }: { course: RecommendedCourse }) {
  return (
    <article className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-[#E0F2FE] px-2.5 py-0.5 text-xs font-medium text-[#1A6B8A]">
          {course.level}
        </span>
        <Link
          href={course.href}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#134E5E] text-white transition-colors hover:bg-[#0E6174]"
          aria-label={`Open ${course.title}`}
        >
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      <h4 className="mt-3 text-sm font-semibold leading-snug text-[#0B2B33]">
        {course.title}
      </h4>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#667085]">
        {course.description}
      </p>

      <div className="relative mt-3 aspect-16/10 w-full overflow-hidden rounded-lg bg-[#E8EFF1]">
        <Image
          src={course.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="size-3 fill-[#FAC5C5] text-[#FAC5C5]" aria-hidden />
          {course.rating}
        </span>
      </div>
    </article>
  );
}

const RecommendedCourses = () => {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-[#0B2B33]">Recommended courses</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedCourses;
