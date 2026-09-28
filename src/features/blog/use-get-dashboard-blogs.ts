import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { apiBaseURL } from "@/lib/axios-instance";

export const DASHBOARD_BLOGS_QUERY_KEY = ["blogs", "dashboard"] as const;

/**
 * Shape returned by GET /blogs.
 *
 * Verified against the live endpoint: posts carry
 * `id, title, slug, text, author, seo_title, seo_description, image,
 *  categories, status, created_at, updated_at`.
 *
 * `date`, `commentNo`, `subHeader`, `subArticle` and `tags` are documented in
 * the older dashboard contract but are absent from every post the live API
 * currently returns, so they are optional and rendered only when present.
 */
export type DashboardBlog = {
  id: number;
  title: string;
  slug: string;
  text: string;
  author: string;
  image: string;
  categories?: string[] | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
  // Legacy/optional fields.
  date?: string;
  commentNo?: number;
  subHeader?: string;
  subArticle?: string[];
  tags?: string[];
};

type DashboardBlogsApiResponse = { data?: DashboardBlog[] } | DashboardBlog[];

/** API origin without the trailing /api — image paths hang off the root. */
const apiOrigin = apiBaseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");

/**
 * `image` comes back relative, and the prefix depends on the shape:
 * "/images/..." hangs off the API root, anything else off /storage/images/.
 * Both forms appear in the live payload.
 */
export function resolveDashboardBlogImage(image: string | null | undefined): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/images")) return `${apiOrigin}${image}`;
  return `${apiOrigin}/storage/images/${image.replace(/^\/+/, "")}`;
}

/** Authors come back prefixed, e.g. "Author: Christiana C.A. John". */
export function cleanBlogAuthor(author: string | null | undefined): string {
  if (!author) return "—";
  return author.replace(/^\s*author\s*:\s*/i, "").trim() || "—";
}

export function formatBlogDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** Posts list the category ids used by useBlogCategory (e.g. "portfolio-building"). */
export function getBlogCategories(blog: DashboardBlog): string[] {
  if (Array.isArray(blog.categories)) return blog.categories;
  if (Array.isArray(blog.tags)) return blog.tags;
  return [];
}

/**
 * GET /blogs — public, returns every post in one payload. There is no
 * single-post endpoint, so the detail page pulls this list and matches
 * the post client-side.
 *
 * Uses a bare axios call rather than the shared axiosInstance on purpose:
 * this endpoint is unauthenticated, and the shared instance's 401
 * interceptor would log the user out if a stale token were rejected.
 */
export function useGetDashboardBlogs() {
  return useQuery({
    queryKey: DASHBOARD_BLOGS_QUERY_KEY,
    queryFn: async (): Promise<DashboardBlog[]> => {
      const { data } = await axios.get<DashboardBlogsApiResponse>(
        `${apiBaseURL}/blogs`,
        { headers: { Accept: "application/json" } },
      );

      if (Array.isArray(data)) return data;
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled: !!apiBaseURL,
    staleTime: 1000 * 60 * 5,
  });
}
