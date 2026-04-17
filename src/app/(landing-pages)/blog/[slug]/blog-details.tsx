import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogCard, {
    type BlogCardData,
} from "@/components/_core/landing-pages/blog/blog-card";
import type { BlogDetail } from "@/features/blog/use-get-blog";
import { imageStorageUrl } from "@/lib/utils";

type BlogDetailsProps = {
    slug: string;
    blog: BlogDetail | null;
    recommendedPosts: BlogCardData[];
};

const PARAGRAPH =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

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

export default function BlogDetails({ slug, blog, recommendedPosts }: BlogDetailsProps) {
    const title = blog?.title
    const author = blog?.author
    const date = formatBlogDate(
        (blog?.date as string | null | undefined) ??
        ((blog as { created_at?: string } | null)?.created_at ?? null),
    );
    const coverImage = `${imageStorageUrl}/images/${blog?.image}`
    const contentHtml =
        typeof blog?.text === "string" && blog.text.trim().length > 0
            ? blog.text
            : PARAGRAPH;

    if (!blog) {
        return (
            <main className="app-width py-10">
                <p className="text-sm text-red-600">Unable to load this blog post.</p>
            </main>
        );
    }

    return (
        <main className="app-width py-10">
            <div className="grid gap-10 lg:gap-20 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="space-y-8 pt-2">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-[#7D8F98] hover:text-[#092A31]"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>

                    <div className="space-y-6 text-[#7D8F98]">
                        <div>
                            <p className="text-[11px] uppercase tracking-wide">Category</p>
                            <div className="flex flex-wrap gap-2">
                                {blog.categories?.map((item: string, index: number) => (
                                    <p key={index} className="mt-1 flex gap-1 items-center capitalize text-sm font-medium text-[#092A31]">
                                       <div className="h-1 w-1 rounded-full bg-primary/20" /> {item.replace(/-/g, " ")} 
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide">Written by</p>
                            <p className="mt-1 text-sm font-medium text-[#092A31]">
                                {author}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide">Date</p>
                            <p className="mt-1 text-sm font-medium text-[#092A31]">{date}</p>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 space-y-6">
                    <header className="space-y-4">
                        <h1 className="max-w-3xl text-xl sm:text-2xl md:text-4xl font-semibold leading-tight text-[#092A31]">
                            {title}
                        </h1>
                        <div className="overflow-hidden rounded-xl">
                            <img
                                src={coverImage}
                                alt={title ?? ""}
                                className="h-72.5 w-full object-cover"
                            />
                        </div>
                    </header>

                    <article className="space-y-6">
                        <section className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#092A31]">
                                Important things to know
                            </h2>
                            <div
                                className="text-lg leading-6 text-[#5F7380]"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        </section>
                    </article>

                </section>
            </div>
            <section className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold text-[#092A31]">Recommended Post</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {recommendedPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
            <p className="sr-only">{slug}</p>
        </main>
    );
}
