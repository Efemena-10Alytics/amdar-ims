"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import BlogCard, { type BlogCardData } from "./blog-card";
import { useGetAllBlog, type BlogItem } from "@/features/blog/use-get-all-blog";
import { useBlogCategory } from "@/hooks/use-blog-category";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm] = useState("");
    const { categoryGroups } = useBlogCategory();
    const { data: blogsResponse, isLoading, isFetching } = useGetAllBlog({
        page,
        search: searchTerm,
        categories: selectedCategories,
    });

    useEffect(() => {
        setPage(1);
        setPosts([]);
    }, [searchTerm, selectedCategories]);

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

    const toggleCategory = (value: string) => {
        setSelectedCategories((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
        );
    };

    return (
        <main className="app-width py-12">
            <section className="space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                    <h1 className="mr-4 text-[28px] font-semibold leading-none text-[#092A31]">
                        Blog
                    </h1>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categoryGroups.map((group) => (
                            <Popover
                                key={group.title}
                                open={openGroup === group.title}
                                onOpenChange={(isOpen) =>
                                    setOpenGroup(isOpen ? group.title : null)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#E8EFF1] px-3 py-1.5 text-xs font-medium text-[#4C6A70]"
                                    >
                                        <span>{group.title}</span>
                                        <ChevronDown
                                            className={`size-3.5 transition-transform ${
                                                openGroup === group.title ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-64 border-[#DCE5E8] p-2"
                                >
                                    <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                                        {group.options.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4C6A70] hover:bg-[#F3F7F8]"
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
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading && posts.length === 0 ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={`blog-skeleton-${index}`}
                                className="overflow-hidden rounded-2xl border border-[#E3EAED] bg-white"
                            >
                                <div className="h-44 w-full animate-pulse bg-[#E8EFF1]" />
                                <div className="space-y-3 p-4">
                                    <div className="h-3 w-24 animate-pulse rounded bg-[#E8EFF1]" />
                                    <div className="h-4 w-4/5 animate-pulse rounded bg-[#E8EFF1]" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#E8EFF1]" />
                                </div>
                            </div>
                        ))
                    ) : (
                        posts.map((post) => <BlogCard key={post.id} post={post} />)
                    )}
                </div>
                {isFetching && posts.length > 0 ? (
                    <p className="text-sm text-[#7D8F98]">Fetching latest blogs...</p>
                ) : null}
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
