"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBlogCategory } from "@/hooks/use-blog-category";
import {
  formatBlogDate,
  getBlogCategories,
  resolveDashboardBlogImage,
  useGetDashboardBlogs,
} from "@/features/blog/use-get-dashboard-blogs";
import DashboardBlogCard, { type DashboardBlogCardData } from "./blog-card";
import { StageBadges } from "./stage-badges";

// Order the filter chips the way the design lays them out; anything the hook
// adds later still renders, just after these.
const GROUP_ORDER = [
  "Career Essentials",
  "Interview Prep",
  "Tech Pathways",
  "UK Tech Job Market",
  "Workplace Skills",
  "Internship & Experience",
];

// GET /blogs returns every post in one payload, so paging is client-side.
const POSTS_PER_PAGE = 6;

const ELLIPSIS = "ellipsis" as const;
type PageToken = number | typeof ELLIPSIS;

/**
 * The feed runs to dozens of pages, so show a window around the current page
 * with the first/last always reachable: 1 … 7 8 9 … 45
 */
function getPageTokens(current: number, last: number): PageToken[] {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);

  const tokens: PageToken[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) tokens.push(ELLIPSIS);
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    tokens.push(pageNumber);
  }
  if (end < last - 1) tokens.push(ELLIPSIS);
  tokens.push(last);

  return tokens;
}

const CardSkeleton = () => (
  <div className="rounded-xl p-3">
    <div className="h-44 w-full animate-pulse rounded-lg bg-[#E8EFF1]" />
    <div className="mt-3 h-3 w-28 animate-pulse rounded bg-[#E8EFF1]" />
    <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-[#E8EFF1]" />
    <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-[#E8EFF1]" />
    <div className="mt-4 h-4 w-24 animate-pulse rounded bg-[#E8EFF1]" />
  </div>
);

export default function DashboardBlogContent() {
  const [page, setPage] = useState(1);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categoryGroups } = useBlogCategory();
  const { data: blogs, isLoading, isError } = useGetDashboardBlogs();
  const sectionRef = useRef<HTMLDivElement>(null);

  const orderedGroups = useMemo(() => {
    return [...categoryGroups].sort((a, b) => {
      const aIndex = GROUP_ORDER.indexOf(a.title);
      const bIndex = GROUP_ORDER.indexOf(b.title);
      return (aIndex === -1 ? GROUP_ORDER.length : aIndex) -
        (bIndex === -1 ? GROUP_ORDER.length : bIndex);
    });
  }, [categoryGroups]);

  // Posts carry the same category ids the filter groups use, so this is a
  // straight membership check.
  const allPosts = useMemo<DashboardBlogCardData[]>(() => {
    const filtered = (blogs ?? []).filter((blog) => {
      if (selectedCategories.length === 0) return true;
      const categories = getBlogCategories(blog);
      return selectedCategories.some((selected) => categories.includes(selected));
    });

    return filtered.map((blog) => ({
      id: blog.id,
      title: blog.title?.trim() || "Untitled blog post",
      category: getBlogCategories(blog)[0]?.replace(/-/g, " ") || "GENERAL",
      date: formatBlogDate(blog.created_at ?? blog.date),
      href: `/dashboard/blog/${blog.slug}`,
      image: resolveDashboardBlogImage(blog.image),
    }));
  }, [blogs, selectedCategories]);

  const lastPage = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, lastPage);
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), lastPage));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={sectionRef} className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Heading + stage badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-clash-display text-2xl font-semibold text-[#092A31]">Blog</h1>
        <StageBadges />
      </div>

      {/* Category filters — one scrollable row rather than wrapping on narrow screens */}
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {orderedGroups.map((group) => {
          const activeCount = group.options.filter((option) =>
            selectedCategories.includes(option.value),
          ).length;

          return (
            <Popover
              key={group.title}
              open={openGroup === group.title}
              onOpenChange={(isOpen) => setOpenGroup(isOpen ? group.title : null)}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex h-8.5 shrink-0 items-center gap-2 rounded-lg px-3 font-sora text-sm transition-colors ${
                    activeCount > 0
                      ? "bg-[#B6CFD4] text-[#0C3640]"
                      : "bg-[#E8EFF1] text-[#4C6A70]"
                  }`}
                >
                  <span>{group.title}</span>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-[#0E6A76] px-1.5 text-xs text-white">
                      {activeCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`size-3.5 transition-transform ${
                      openGroup === group.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 border-[#DCE5E8] p-2">
                <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 font-sora text-xs text-[#4C6A70] hover:bg-[#F3F7F8]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(option.value)}
                        onChange={() => toggleCategory(option.value)}
                        className="size-3.5 rounded border-[#BFCFD3] text-[#156374] focus:ring-[#156374]"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)
          : posts.map((post) => <DashboardBlogCard key={post.id} post={post} />)}
      </div>

      {!isLoading && isError && (
        <p className="font-sora text-sm text-red-500">
          Unable to load blog posts right now. Please try again later.
        </p>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <p className="font-sora text-sm text-[#7D8F98]">
          {selectedCategories.length > 0
            ? "No blog posts match the selected categories."
            : "No blog posts available."}
        </p>
      )}

      {/* Pagination */}
      {!isLoading && lastPage > 1 && (
        <nav
          aria-label="Blog pagination"
          className="flex flex-wrap items-center justify-center gap-1 font-sora text-sm sm:justify-end"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>

          {getPageTokens(currentPage, lastPage).map((token, index) =>
            token === ELLIPSIS ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden
                className="flex size-8 items-center justify-center text-[#94A3B8]"
              >
                …
              </span>
            ) : (
              <button
                key={token}
                type="button"
                onClick={() => goToPage(token)}
                aria-current={token === currentPage ? "page" : undefined}
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  token === currentPage
                    ? "bg-[#E8EFF1] font-semibold text-[#092A31]"
                    : "text-[#64748B] hover:bg-[#F6F8FA]"
                }`}
              >
                {token}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>

          {/* Jump straight to a page — the windowed numbers above only reach
              a page or two either side of the current one. */}
          <div className="ml-2 flex items-center gap-2">
            <label htmlFor="blog-page-select" className="text-[#64748B]">
              Go to
            </label>
            <Select value={String(currentPage)} onValueChange={(value) => goToPage(Number(value))}>
              <SelectTrigger
                id="blog-page-select"
                aria-label="Go to page"
                className="h-8 w-auto min-w-18 rounded-md border-[#DCE5E9] bg-white px-2 font-sora text-sm text-[#0C3640]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-18">
                {Array.from({ length: lastPage }, (_, index) => index + 1).map((pageNumber) => (
                  <SelectItem key={pageNumber} value={String(pageNumber)}>
                    {pageNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-[#64748B]">of {lastPage}</span>
          </div>
        </nav>
      )}
    </div>
  );
}
