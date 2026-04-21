import type { MetadataRoute } from "next";
import { EXCLUDED_INTERNSHIP_PROGRAM_SLUGS } from "@/features/internship/excluded-internship-program-slugs";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const FETCH_INIT = { next: { revalidate: 3600 } } as const;
const SITEMAP_REQUEST_TIMEOUT_MS = 8000;
const SITEMAP_MAX_BLOG_PAGES = 20;

type BlogListItem = {
  slug?: string | null;
  date?: string | null;
  created_at?: string | null;
};

type AllBlogsResponseShape = {
  current_page: number;
  data: BlogListItem[];
  last_page: number;
};

type AllBlogsApiResponse =
  | AllBlogsResponseShape
  | { data?: AllBlogsResponseShape }
  | BlogListItem[];

function normalizeBlogsPayload(
  data: AllBlogsApiResponse,
): { data: BlogListItem[]; last_page: number } {
  if (Array.isArray(data)) {
    return {
      data,
      last_page: 1,
    };
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    data.data &&
    typeof data.data === "object" &&
    !Array.isArray(data.data)
  ) {
    const inner = data.data as AllBlogsResponseShape;
    return {
      data: inner.data ?? [],
      last_page: inner.last_page ?? 1,
    };
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as AllBlogsResponseShape).data)
  ) {
    const d = data as AllBlogsResponseShape;
    return {
      data: d.data,
      last_page: d.last_page ?? 1,
    };
  }

  return { data: [], last_page: 1 };
}

function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_REACT_APP_API_URL ?? "").replace(/\/+$/, "");
}

function blogLastModified(item: BlogListItem): Date | undefined {
  const raw = item.date ?? item.created_at;
  if (raw == null || String(raw).trim() === "") return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function fetchAllBlogsForSitemap(
  apiBase: string,
): Promise<BlogListItem[]> {
  const collected: BlogListItem[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await fetch(
      `${apiBase}/blogs/all?page=${page}`,
      {
        ...FETCH_INIT,
        signal: AbortSignal.timeout(SITEMAP_REQUEST_TIMEOUT_MS),
      },
    );
    if (!res.ok) throw new Error(`blogs/all failed: ${res.status}`);
    const payload = (await res.json()) as AllBlogsApiResponse;
    const { data, last_page } = normalizeBlogsPayload(payload);
    collected.push(...data);
    lastPage = last_page;
    page += 1;
  } while (page <= lastPage && page <= SITEMAP_MAX_BLOG_PAGES);

  return collected;
}

type InternshipProgramRow = {
  id?: number | string | null;
  slug?: string | null;
  updated_at?: string | null;
};

function normalizeInternshipProgramsPayload(data: unknown): InternshipProgramRow[] {
  if (Array.isArray(data)) return data as InternshipProgramRow[];
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: InternshipProgramRow[] }).data;
  }
  return [];
}

async function fetchInternshipProgramsForSitemap(
  apiBase: string,
): Promise<InternshipProgramRow[]> {
  const res = await fetch(`${apiBase}/internship-programs-all`, {
    ...FETCH_INIT,
    signal: AbortSignal.timeout(SITEMAP_REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`internship-programs-all failed: ${res.status}`);
  const json: unknown = await res.json();
  return normalizeInternshipProgramsPayload(json);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const apiBase = getApiBase();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/home`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/internship`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  if (!apiBase) {
    return staticEntries;
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  let internshipEntries: MetadataRoute.Sitemap = [];

  const [blogsResult, programsResult] = await Promise.allSettled([
    fetchAllBlogsForSitemap(apiBase),
    fetchInternshipProgramsForSitemap(apiBase),
  ]);

  if (blogsResult.status === "fulfilled") {
    const blogs = blogsResult.value;
    const seenSlugs = new Set<string>();
    blogEntries = blogs
      .map((item) => {
        const slug = item.slug?.toString().trim();
        if (!slug || seenSlugs.has(slug)) return null;
        seenSlugs.add(slug);
        const lastMod = blogLastModified(item);
        return {
          url: `${base}/blog/${slug}`,
          lastModified: lastMod ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e != null);
  } else {
    blogEntries = [];
  }

  if (programsResult.status === "fulfilled") {
    const programs = programsResult.value;
    const excludedSlugs = new Set<string>(EXCLUDED_INTERNSHIP_PROGRAM_SLUGS);
    internshipEntries = programs
      .filter(
        (p) =>
          p.id != null &&
          String(p.id).trim() !== "" &&
          !excludedSlugs.has(p.slug ?? ""),
      )
      .map((p) => {
        const updated = p.updated_at?.trim()
          ? new Date(p.updated_at)
          : undefined;
        const lastModified =
          updated && !Number.isNaN(updated.getTime())
            ? updated
            : new Date();
        return {
          url: `${base}/internship/${p.id}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      });
  } else {
    internshipEntries = [];
  }

  return [...staticEntries, ...blogEntries, ...internshipEntries];
}
