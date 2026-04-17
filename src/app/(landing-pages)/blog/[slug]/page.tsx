import BlogDetails from "./blog-details";
import type { BlogCardData } from "@/components/_core/landing-pages/blog/blog-card";
import { apiBaseURL } from "@/lib/axios-instance";
import type { BlogDetail } from "@/features/blog/use-get-blog";
import type { AllBlogsResponse, BlogItem } from "@/features/blog/use-get-all-blog";

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const FALLBACK_BLOG_IMAGE = "/images/pngs/template/classic.png";

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

async function getBlog(slug: string): Promise<BlogDetail | null> {
  if (!apiBaseURL || !slug.trim()) return null;
  try {
    const response = await fetch(`${apiBaseURL}/blogs/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as unknown;
    if (!data || typeof data !== "object") return null;

    if ("data" in data) {
      const wrapped = data as { data?: unknown };
      if (wrapped.data && typeof wrapped.data === "object") {
        return wrapped.data as BlogDetail;
      }
    }
    return data as BlogDetail;
  } catch {
    return null;
  }
}

async function getAllBlogsFirstPage(): Promise<BlogItem[]> {
  if (!apiBaseURL) return [];
  try {
    const response = await fetch(`${apiBaseURL}/blogs/all?page=1`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;

    if (Array.isArray(data)) return data;
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      "data" in data &&
      (data as { data?: unknown }).data &&
      typeof (data as { data?: unknown }).data === "object" &&
      !Array.isArray((data as { data?: unknown }).data) &&
      Array.isArray(((data as { data?: { data?: unknown } }).data?.data ?? null))
    ) {
      return (data as { data: { data: BlogItem[] } }).data.data;
    }
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Array.isArray((data as AllBlogsResponse).data)
    ) {
      return (data as AllBlogsResponse).data;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const [blog, allBlogs] = await Promise.all([getBlog(slug), getAllBlogsFirstPage()]);

  const recommendedPosts: BlogCardData[] = allBlogs
    .filter((item) => item.slug?.toString().trim() !== slug)
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

  return <BlogDetails slug={slug} blog={blog} recommendedPosts={recommendedPosts} />;
}
