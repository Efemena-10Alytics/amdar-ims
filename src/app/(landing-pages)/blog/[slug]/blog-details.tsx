"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import BlogCard from "@/components/_core/landing-pages/blog/blog-card";

type BlogDetailsProps = {
    slug: string;
};

const RECOMMENDED_POSTS = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    title: "Diffrences between product design and product development",
    category: "DESING",
    date: "Feb 28, 2026",
    href: "#",
    image: "/images/pngs/template/classic.png",
}));

const PARAGRAPH =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export default function BlogDetails({ slug }: BlogDetailsProps) {
    const title = "Difference between product design and Product development";

    return (
        <main className="app-width py-10">
            <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
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
                            <p className="mt-1 text-sm font-medium text-[#092A31]">Desing</p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide">Written by</p>
                            <p className="mt-1 text-sm font-medium text-[#092A31]">
                                Lorem for Rickcy
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-wide">Date</p>
                            <p className="mt-1 text-sm font-medium text-[#092A31]">Feb 28, 2026</p>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 space-y-6">
                    <header className="space-y-4">
                        <h1 className="max-w-3xl text-xl xl:text-4xl font-semibold leading-tight text-[#092A31]">
                            {title}
                        </h1>
                        <div className="overflow-hidden rounded-xl">
                            <img
                                src="/images/pngs/template/classic.png"
                                alt={title}
                                className="h-72.5 w-full object-cover"
                            />
                        </div>
                    </header>

                    <article className="space-y-6">
                        <section className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#092A31]">
                                Important things to know
                            </h2>
                            <p className="text-lg leading-6 text-[#5F7380]">{PARAGRAPH}</p>
                        </section>
                        <section className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#092A31]">
                                Important things to know
                            </h2>
                            <p className="text-lg leading-6 text-[#5F7380]">{PARAGRAPH}</p>
                        </section>
                        <section className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#092A31]">
                                Important things to know
                            </h2>
                            <p className="text-lg leading-6 text-[#5F7380]">{PARAGRAPH}</p>
                        </section>
                    </article>

                </section>
            </div>
            <section className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold text-[#092A31]">Recommanded Post</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {RECOMMENDED_POSTS.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
            <p className="sr-only">{slug}</p>
        </main>
    );
}
