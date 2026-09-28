"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  cleanBlogAuthor,
  formatBlogDate,
  getBlogCategories,
  resolveDashboardBlogImage,
  useGetDashboardBlogs,
} from "@/features/blog/use-get-dashboard-blogs";
import DashboardBlogCard, { type DashboardBlogCardData } from "./blog-card";
import BlogComments, { ReactionPills } from "./comments";
import { StageBadges } from "./stage-badges";

// GET /blogs carries no like/dislike counts, so these two pills stay static
// until an endpoint exists. `commentNo` below is real.
const PLACEHOLDER_LIKES = 234000;
const PLACEHOLDER_DISLIKES = 12;

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-sora text-[11px] uppercase tracking-wide text-[#8EA0AA]">{label}</p>
      <div className="mt-1 font-sora text-sm font-semibold text-[#092A31]">{children}</div>
    </div>
  );
}

export default function DashboardBlogDetail({ slug }: { slug: string }) {
  const { data: blogs, isLoading, isError } = useGetDashboardBlogs();
  const [liked, setLiked] = useState(false);

  // No single-post endpoint — match against the full list. Slug drives our
  // route, but fall back to id so numeric legacy links still resolve.
  const blog = (blogs ?? []).find(
    (item) => item.slug === slug || String(item.id) === slug,
  );

  const recommended: DashboardBlogCardData[] = (blogs ?? [])
    .filter((item) => item.slug !== blog?.slug)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title?.trim() || "Untitled blog post",
      category: getBlogCategories(item)[0]?.replace(/-/g, " ") || "GENERAL",
      date: formatBlogDate(item.created_at ?? item.date),
      href: `/dashboard/blog/${item.slug}`,
      image: resolveDashboardBlogImage(item.image),
    }));

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Back + stage badges */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/blog"
          aria-label="Back to blog"
          className="flex size-9 items-center justify-center rounded-full bg-[#E8EFF1] text-[#0C3640] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <StageBadges />
      </div>

      {isLoading ? (
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 w-32 animate-pulse rounded bg-[#E8EFF1]" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-[#E8EFF1]" />
            <div className="h-72 w-full animate-pulse rounded-xl bg-[#E8EFF1]" />
          </div>
        </div>
      ) : isError ? (
        <p className="font-sora text-sm text-red-500">Unable to load this blog post.</p>
      ) : !blog ? (
        <p className="font-sora text-sm text-[#7D8F98]">This blog post could not be found.</p>
      ) : (
        <>
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            {/* Meta sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <MetaField label="Category">
                <div className="flex flex-wrap gap-x-2 capitalize">
                  {getBlogCategories(blog).length > 0
                    ? getBlogCategories(blog).map((category) => (
                        <span key={category}>{category.replace(/-/g, " ")}</span>
                      ))
                    : "—"}
                </div>
              </MetaField>
              <MetaField label="Witten by">{cleanBlogAuthor(blog.author)}</MetaField>
              <MetaField label="Date">
                {formatBlogDate(blog.created_at ?? blog.date)}
              </MetaField>
            </aside>

            {/* Article */}
            <section className="min-w-0 space-y-5">
              <h1 className="max-w-2xl font-clash-display text-3xl font-semibold leading-tight text-[#092A31] sm:text-4xl">
                {blog.title}
              </h1>

              <ReactionPills
                likes={liked ? PLACEHOLDER_LIKES + 1 : PLACEHOLDER_LIKES}
                dislikes={PLACEHOLDER_DISLIKES}
                comments={blog.commentNo ?? 0}
                liked={liked}
                onToggleLike={() => setLiked((prev) => !prev)}
              />

              {blog.image && (
                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveDashboardBlogImage(blog.image)}
                    alt={blog.title}
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}

              {blog.subHeader && (
                <h2 className="font-sora text-base font-semibold text-[#092A31]">
                  {blog.subHeader}
                </h2>
              )}

              {blog.text && (
                <article
                  className="tinymce-content max-w-full break-words [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#092A31] [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:text-sm [&_p]:my-0 [&_p]:text-sm [&_p]:leading-relaxed [&_table]:block [&_table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: blog.text }}
                />
              )}

              {Array.isArray(blog.subArticle) && blog.subArticle.length > 0 && (
                <ul className="list-disc space-y-2 pl-5 font-sora text-sm leading-relaxed text-[#4C6A70]">
                  {blog.subArticle.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}

              {getBlogCategories(blog).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {getBlogCategories(blog).map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-[#E8EFF1] px-3 py-1 font-sora text-xs capitalize text-[#0C3640]"
                    >
                      {category.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              <BlogComments />
            </section>
          </div>

          {recommended.length > 0 && (
            <section className="space-y-4 pt-4">
              <h3 className="font-sora text-base font-semibold text-[#092A31]">
                Recommended Post
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommended.map((post) => (
                  <DashboardBlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
