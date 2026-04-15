import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { baseUrl, imageStorageUrl, imageUrl } from "@/lib/utils";

export type BlogCardData = {
    id: string | number;
    title: string;
    category: string;
    date: string;
    href: string;
    image: string;
};

export default function BlogCard({ post }: { post: BlogCardData }) {
    const blogImageUrl = `${imageStorageUrl}/images/${post.image}`;
    console.log(blogImageUrl);
    return (
        <article className="space-y-3 cursor-pointer hover:p-3 w-full hover:bg-[#E8EFF1] group rounded-lg duration-300 transition-all">
            <div className="overflow-hidden rounded-lg bg-[#E8EFF1]">
                <img
                    src={blogImageUrl}
                    alt={post.title}
                    className="h-44 w-full object-cover"
                />
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-medium uppercase text-[#8EA0AA]">
                    <span>{post.category}</span>
                    <span className="normal-case">{post.date}</span>
                </div>

                <h2 className="text-lg font-semibold text-[#092A31] md:text-xl">
                    {post.title}
                </h2>

                <div className="flex items-center justify-between pt-1">
                    <Link
                        href={post.href}
                        className="text-base font-medium leading-none text-[#092A31] hover:underline"
                    >
                        Read article
                    </Link>
                    <span className="inline-flex group-hover:text-primary size-6 items-center justify-center rounded-full bg-[#0E6A76] group-hover:bg-amdari-yellow text-white">
                        <ArrowUpRight className="size-3.5" />
                    </span>
                </div>
            </div>
        </article>
    )
}