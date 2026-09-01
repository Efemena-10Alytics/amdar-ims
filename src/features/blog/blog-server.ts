import { apiBaseURL } from "@/lib/axios-instance";
import type { BlogDetail } from "./use-get-blog";
import type { AllBlogsResponse, BlogItem } from "./use-get-all-blog";

/**
 * Server-side blog reads.
 *
 * These use native `fetch` rather than `axiosInstance` on purpose: only `fetch`
 * goes through Next's Data Cache, so a single upstream call is shared by every
 * request and every blog slug rendered inside the revalidate window. Axios stays
 * the right tool for browser calls, where the auth interceptor is needed.
 */

/** Blog content changes on the order of days, so an hour of staleness is invisible to readers. */
export const BLOG_REVALIDATE_SECONDS = 3600;

/** Matches the cap the sitemap already applies when walking the blog list. */
const MAX_BLOG_PAGES = 20;

/**
 * The API rate-limits per IP (see the note in `lib/axios-instance`). Server renders all
 * share one egress IP, so bursts — a build prerendering many posts, or several ISR
 * revalidations landing together — can trip a 429. Retry a few times before giving up.
 */
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const RETRY_BASE_DELAY_MS = 750;

/** Raised when the upstream API is unreachable or errors, as distinct from a post that does not exist. */
export class BlogFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogFetchError";
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetches with the Data Cache enabled, backing off on rate limits and transient upstream errors. */
async function fetchBlogJson(url: string, label: string): Promise<Response> {
  let lastStatus = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await delay(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
    }

    let response: Response;
    try {
      response = await fetch(url, {
        next: { revalidate: BLOG_REVALIDATE_SECONDS },
      });
    } catch (error) {
      lastStatus = 0;
      if (attempt === MAX_ATTEMPTS - 1) {
        throw new BlogFetchError(`${label} failed: ${(error as Error).message}`);
      }
      continue;
    }

    if (response.ok || response.status === 404) return response;

    lastStatus = response.status;
    if (!RETRY_STATUSES.has(response.status)) break;
  }

  throw new BlogFetchError(`${label} failed: ${lastStatus}`);
}

export type BlogsPage = {
  data: BlogItem[];
  last_page: number;
};

/**
 * The API has returned three shapes for the blog list over time: a bare array,
 * `{ data: BlogItem[] }`, and `{ data: { data: BlogItem[], last_page } }`.
 */
export function normalizeBlogsPayload(payload: unknown): BlogsPage {
  if (Array.isArray(payload)) {
    return { data: payload as BlogItem[], last_page: 1 };
  }

  if (!payload || typeof payload !== "object") {
    return { data: [], last_page: 1 };
  }

  const outer = payload as { data?: unknown };

  if (outer.data && typeof outer.data === "object" && !Array.isArray(outer.data)) {
    const inner = outer.data as AllBlogsResponse;
    return {
      data: Array.isArray(inner.data) ? inner.data : [],
      last_page: inner.last_page ?? 1,
    };
  }

  if (Array.isArray(outer.data)) {
    const flat = payload as AllBlogsResponse;
    return { data: flat.data, last_page: flat.last_page ?? 1 };
  }

  return { data: [], last_page: 1 };
}

function requireApiBase(): string {
  if (!apiBaseURL) {
    throw new BlogFetchError("NEXT_PUBLIC_REACT_APP_API_URL is not configured");
  }
  return apiBaseURL;
}

/**
 * Returns `null` only when the post genuinely does not exist upstream. Every other
 * failure throws, so a transient API error is never baked into the ISR cache —
 * Next keeps serving the last good render instead.
 */
export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const base = requireApiBase();
  const response = await fetchBlogJson(
    `${base}/blogs/${encodeURIComponent(trimmed)}/`,
    `blogs/${trimmed}`,
  );

  if (response.status === 404) return null;

  const payload = (await response.json()) as unknown;
  if (!payload || typeof payload !== "object") return null;

  const wrapped = payload as { data?: unknown };
  if (wrapped.data && typeof wrapped.data === "object") {
    return wrapped.data as BlogDetail;
  }
  return payload as BlogDetail;
}

/**
 * One page of the blog list. Cached, so the recommendation rail on every article
 * shares a single upstream call per revalidate window instead of one per pageview.
 */
export async function getBlogsPage(page = 1): Promise<BlogsPage> {
  const base = requireApiBase();
  const response = await fetchBlogJson(
    `${base}/blogs/all/?page=${page}`,
    `blogs/all page ${page}`,
  );

  return normalizeBlogsPayload((await response.json()) as unknown);
}

/**
 * Every blog post, for `generateStaticParams` and the sitemap.
 *
 * Page 1 establishes `last_page`, then the remainder are fetched together —
 * total latency is one round trip rather than the sum of up to 20.
 */
export async function getAllBlogs(): Promise<BlogItem[]> {
  const first = await getBlogsPage(1);
  const totalPages = Math.min(Math.max(first.last_page, 1), MAX_BLOG_PAGES);

  if (totalPages <= 1) return first.data;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => getBlogsPage(index + 2)),
  );

  return [first.data, ...rest.map((page) => page.data)].flat();
}

/** Unique, non-empty slugs across every blog post. */
export async function getAllBlogSlugs(): Promise<string[]> {
  const blogs = await getAllBlogs();
  const slugs = new Set<string>();

  for (const blog of blogs) {
    const slug = blog.slug?.toString().trim();
    if (slug) slugs.add(slug);
  }

  return [...slugs];
}
