"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type DashboardBlogCardData = {
  id: string | number;
  title: string;
  category: string;
  /** Already-resolved absolute URL — see resolveDashboardBlogImage. */
  image: string;
  date: string;
  href: string;
};

export default function DashboardBlogCard({ post }: { post: DashboardBlogCardData }) {
  return (
    <Link href={post.href} className="group block">
      <article className="overflow-hidden rounded-xl p-3 transition-colors duration-200 group-hover:bg-[#E8EFF1]">
        <div className="overflow-hidden rounded-lg bg-[#E8EFF1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
        </div>

        <div className="mt-3 flex items-center gap-3 font-sora text-xs font-medium uppercase text-[#8EA0AA]">
          <span>{post.category}</span>
          <span className="normal-case">{post.date}</span>
        </div>

        <h2 className="mt-2 line-clamp-2 font-clash-display text-lg font-semibold text-[#092A31]">
          {post.title}
        </h2>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-sora text-base font-medium leading-none text-[#092A31]">
            Read article
          </span>
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#0E6A76] text-white transition-colors group-hover:bg-amdari-yellow group-hover:text-[#0E6A76]">
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
