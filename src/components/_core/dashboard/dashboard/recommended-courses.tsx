"use client";

import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import type { Learn } from "@/features/learn/learn.types";
import { useGetLearns } from "@/features/learn/use-get-learn";
import { baseUrl, stripHtml } from "@/lib/utils";

const FALLBACK_COURSE_IMAGE = "/images/pngs/laptop.png";
const RECOMMENDED_COURSE_COUNT = 4;

type CourseLevel = "Beginner" | "Intermediate";

const HARDCODED_COURSE_LEVELS: CourseLevel[] = ["Beginner", "Intermediate"];
const DISPLAY_RATING = 4.5;
const LEGACY_LEARN_WATCH_URL = "https://app.amdari.io/learn/watch";

function getLegacyWatchHref(course: Learn): string {
  const params = new URLSearchParams({
    courseId: String(course.id),
    resume: "true",
  });

  const curriculum = [...(course.curriculums ?? [])].sort(
    (a, b) => a.order - b.order,
  )[0];
  if (curriculum) {
    params.set("c_Id", String(curriculum.id));
    const lesson = [...(curriculum.lessons ?? [])].sort(
      (a, b) => a.order - b.order,
    )[0];
    if (lesson) params.set("l_Id", String(lesson.id));
  }

  return `${LEGACY_LEARN_WATCH_URL}?${params.toString()}`;
}

function CourseCard({
  course,
  level,
}: {
  course: Learn;
  level: CourseLevel;
}) {
  const imageSrc = course.thumbnail
    ? `${baseUrl.replace(/\/$/, "")}/${course.thumbnail.replace(/^\//, "")}`
    : FALLBACK_COURSE_IMAGE;
  const href = getLegacyWatchHref(course);
  const description =
    stripHtml(course.description) || "Explore this course on Amdari Learn.";

  return (
    <a
      href={href}
      aria-label={`Open ${course.title}`}
      className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-4 transition-colors hover:border-[#134E5E]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-[#E0F2FE] px-2.5 py-0.5 text-xs font-medium text-[#1A6B8A]">
          {level}
        </span>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#134E5E] text-white">
          <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
        </span>
      </div>

      <h4 className="mt-3 text-sm font-semibold leading-snug text-[#0B2B33]">
        {course.title}
      </h4>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#667085]">
        {description}
      </p>

      <div className="relative mt-3 aspect-16/10 w-full overflow-hidden rounded-lg bg-[#E8EFF1]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="size-3 fill-[#FAC5C5] text-[#FAC5C5]" aria-hidden />
          {DISPLAY_RATING}
        </span>
      </div>
    </a>
  );
}

function CourseCardSkeleton() {
  return (
    <article
      className="flex animate-pulse flex-col rounded-xl border border-[#E2E8F0] bg-white p-4"
      aria-hidden
    >
      <div className="flex justify-between gap-2">
        <div className="h-5 w-24 rounded-full bg-[#E8EFF1]" />
        <div className="size-7 rounded-full bg-[#E8EFF1]" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-[#E8EFF1]" />
      <div className="mt-2 h-8 w-full rounded bg-[#E8EFF1]" />
      <div className="mt-3 aspect-16/10 w-full rounded-lg bg-[#E8EFF1]" />
    </article>
  );
}

const RecommendedCourses = () => {
  const { data, isLoading, isError } = useGetLearns({
    page: 1,
    per_page: RECOMMENDED_COURSE_COUNT,
  });

  const courses = data?.data ?? [];

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-[#0B2B33]">Recommended courses</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading
          ? Array.from({ length: RECOMMENDED_COURSE_COUNT }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          : courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                level={
                  HARDCODED_COURSE_LEVELS[
                    index % HARDCODED_COURSE_LEVELS.length
                  ]
                }
              />
            ))}
      </div>

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-[#667085]">
          We couldn&apos;t load courses right now. Please try again later.
        </p>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <p className="mt-4 text-sm text-[#667085]">No courses available yet.</p>
      )}
    </section>
  );
};

export default RecommendedCourses;
