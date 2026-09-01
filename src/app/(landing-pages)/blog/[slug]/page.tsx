import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogDetails from "./blog-details";
import type { BlogCardData } from "@/components/_core/landing-pages/blog/blog-card";
import type { BlogDetail } from "@/features/blog/use-get-blog";
import type { BlogItem } from "@/features/blog/use-get-all-blog";
import { getBlogBySlug, getBlogsPage } from "@/features/blog/blog-server";

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const FALLBACK_BLOG_IMAGE = "/images/pngs/template/classic.png";

/** Must stay a literal — Next only statically analyses segment config, not imported constants. Keep in sync with BLOG_REVALIDATE_SECONDS. */
export const revalidate = 3600;

/** Dedupes the post fetch across generateMetadata and the page render. */
const getBlogCached = cache(async (slug: string): Promise<BlogDetail | null> =>
  getBlogBySlug(slug),
);

/**
 * Prerenders the most recent posts — the ones linked from /blog and the ones that
 * actually get traffic. The long tail is deliberately left to on-demand ISR: the
 * API rate-limits per IP, and prerendering every post at once trips a 429 and fails
 * the build. Those posts still render once and cache for an hour after the first hit.
 *
 * `dynamicParams` stays on by default, so posts published after a deploy work too.
 * An unreachable API degrades to fully on-demand rather than breaking the build.
 */
export async function generateStaticParams() {
  try {
    const { data } = await getBlogsPage(1);
    const slugs = new Set<string>();

    for (const item of data) {
      const slug = item.slug?.toString().trim();
      if (slug) slugs.add(slug);
    }

    return [...slugs].map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

function formatBlogDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * The recommendation rail is secondary to the article, so a failure here degrades
 * to an empty rail rather than taking down the post.
 */
async function getRecommendedPosts(currentSlug: string): Promise<BlogCardData[]> {
  let items: BlogItem[];
  try {
    ({ data: items } = await getBlogsPage(1));
  } catch {
    return [];
  }

  return items
    .filter((item) => item.slug?.toString().trim() !== currentSlug)
    .slice(0, 3)
    .map((item, index) => {
      const itemSlug = item.slug?.toString().trim();
      const imagePath = item.image?.toString().trim();
      return {
        id: item.id ?? `recommended-${index}`,
        title: item.title?.toString().trim() || "Untitled blog post",
        category: item.category?.toString().trim().replace(/-/g, " ") || "General",
        date: formatBlogDate(
          (item.date as string | null | undefined) ??
          ((item as { created_at?: string } | null)?.created_at ?? null),
        ),
        href: itemSlug ? `/blog/${itemSlug}` : "#",
        image: imagePath ? imagePath : FALLBACK_BLOG_IMAGE,
      };
    });
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogCached(slug).catch(() => null);

  const defaultTitle = "Blog | Amdari";
  const seoTitle =
    typeof (blog as { seo_title?: unknown } | null)?.seo_title === "string"
      ? ((blog as { seo_title?: string }).seo_title ?? "").trim()
      : "";
  const title = seoTitle || blog?.title?.toString().trim() || defaultTitle;

  const descriptionSource =
    typeof (blog as { seo_description?: unknown } | null)?.seo_description === "string" &&
      ((blog as { seo_description?: string }).seo_description ?? "").trim().length > 0
      ? ((blog as { seo_description?: string }).seo_description ?? "")
      : typeof blog?.excerpt === "string" && blog.excerpt.trim().length > 0
        ? blog.excerpt
        : typeof blog?.content === "string" && blog.content.trim().length > 0
          ? blog.content
          : typeof (blog as { text?: unknown } | null)?.text === "string"
            ? ((blog as { text?: string }).text ?? "")
            : "";

  const normalizedDescription = stripHtml(descriptionSource).slice(0, 160);
  const description =
    normalizedDescription.length > 0
      ? normalizedDescription
      : "Read this blog post on Amdari.";

  return {
    title,
    description,
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const [blog, recommendedPosts] = await Promise.all([
    getBlogCached(slug),
    getRecommendedPosts(slug),
  ]);

  if (!blog) {
    notFound();
  }

  return <BlogDetails slug={slug} blog={blog} recommendedPosts={recommendedPosts} />;
}
