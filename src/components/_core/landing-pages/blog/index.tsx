"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import BlogCard, { type BlogCardData } from "./blog-card";
import { useGetAllBlog, type BlogItem } from "@/features/blog/use-get-all-blog";

const BLOG_FILTERS = [
    "Career Essentials",
    "Interview Prep",
    "Tech pathway",
    "UK Tech Job Market",
    "Workplace skills",
    "Internship",
];

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

function mapBlogToCard(blog: BlogItem, index: number): BlogCardData {
    const numericId = blog.id ?? index + 1;
    const title = blog.title?.trim() || "Untitled blog post";
    const category = blog.category?.trim() || "GENERAL";
    const date =
        formatBlogDate((blog as BlogItem & { created_at?: string }).created_at ?? blog.date) ||
        "—";
    const slug = blog.slug?.trim();
    const href = slug ? `/blog/${slug}` : "#";
    const image = blog.coverImage ?? blog.image ?? FALLBACK_BLOG_IMAGE;

    return {
        id: numericId,
        title,
        category,
        date,
        href,
        image,
    };
}

function getPageFromNextUrl(nextPageUrl: string | null | undefined): number | null {
    if (!nextPageUrl) return null;
    try {
        const parsed = new URL(nextPageUrl);
        const page = Number(parsed.searchParams.get("page"));
        if (Number.isNaN(page) || page < 1) return null;
        return page;
    } catch {
        return null;
    }
}

export default function BlogContent() {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<BlogCardData[]>([]);
    const { data: blogsResponse, isLoading, isFetching } = useGetAllBlog({ page });

    useEffect(() => {
        if (!blogsResponse) return;
        const mapped = blogsResponse.data.map(mapBlogToCard);
        setPosts((prev) => {
            const existing = new Set(prev.map((post) => String(post.id)));
            const nextItems = mapped.filter((post) => !existing.has(String(post.id)));
            return [...prev, ...nextItems];
        });
    }, [blogsResponse]);

    const nextPage = getPageFromNextUrl(blogsResponse?.next_page_url);
    const canLoadMore = nextPage != null;

    const handleLoadMore = () => {
        if (!nextPage) return;
        setPage(nextPage);
    };

    return (
        <main className="app-width py-12">
            <section className="space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                    <h1 className="mr-4 text-[28px] font-semibold leading-none text-[#092A31]">
                        Blog
                    </h1>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {BLOG_FILTERS.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md bg-[#E8EFF1] px-3 py-1.5 text-xs font-medium text-[#4C6A70]"
                            >
                                <span>{filter}</span>
                                <ChevronDown className="size-3.5" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
                {!isLoading && posts.length === 0 ? (
                    <p className="text-sm text-[#7D8F98]">No blog posts available.</p>
                ) : null}

                <div className="flex items-center justify-between pt-2 text-[#7D8F98]">
                    <p>
                        {blogsResponse?.current_page ?? 1} of {blogsResponse?.last_page ?? 1}
                    </p>
                    <button
                        type="button"
                        className="font-medium text-[#092A31] underline underline-offset-4"
                        onClick={handleLoadMore}
                        disabled={!canLoadMore || isFetching}
                    >
                        {isFetching ? "Loading..." : "Load more"}
                    </button>
                </div>
            </section>
        </main>
    );
}
