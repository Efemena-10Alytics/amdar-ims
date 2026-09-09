"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { imageStorageUrl } from "@/lib/utils";
import {
  TreasureSpot,
  useTreasureHunt,
} from "@/components/_core/treasure-hunt/treasure-hunt-provider";

export type BlogCardData = {
  id: string | number;
  title: string;
  category: string;
  date: string;
  href: string;
  image: string;
};

type BlogCardTreasureConfig = {
  category?: "decoy" | "win";
  categorySlot?: number;
  date?: "decoy" | "win";
  dateSlot?: number;
  read?: "decoy" | "win";
  readSlot?: number;
  arrow?: "decoy" | "win";
  arrowSlot?: number;
};

export default function BlogCard({
  post,
  treasure,
}: {
  post: BlogCardData;
  treasure?: BlogCardTreasureConfig;
}) {
  const { isHuntActive } = useTreasureHunt();
  const blogImageUrl = post.image.startsWith("http")
    ? post.image
    : post.image.startsWith("/")
      ? post.image
      : `${imageStorageUrl}/images/${post.image}`;

  const wrap = (
    kind: "decoy" | "win" | undefined,
    slot: number | undefined,
    className: string,
    children: React.ReactNode,
  ) => {
    if (!isHuntActive || !kind) return children;
    return (
      <TreasureSpot
        kind={kind}
        treasureSlotIndex={slot}
        className={className}
      >
        {children}
      </TreasureSpot>
    );
  };

  return (
    <Link href={isHuntActive && treasure?.read === "win" ? "#" : post.href}>
      <article className="space-y-3 cursor-pointer w-full hover:bg-[#E8EFF1] group rounded-lg duration-300 transition-all">
        <div className="overflow-hidden rounded-lg bg-[#E8EFF1]">
          <img
            src={blogImageUrl}
            alt={post.title}
            className="h-44 w-full object-cover"
          />
        </div>
        <div className="space-y-3 group-hover:p-3 transition-all duration-300">
          <div className="flex items-center gap-3 text-xs font-medium uppercase text-[#8EA0AA]">
            {wrap(
              treasure?.category,
              treasure?.categorySlot,
              "text-inherit uppercase",
              <span>{post.category}</span>,
            )}
            {wrap(
              treasure?.date,
              treasure?.dateSlot,
              "normal-case text-inherit",
              <span className="normal-case">{post.date}</span>,
            )}
          </div>

          <h2 className="text-lg font-semibold text-[#092A31] md:text-xl">
            {post.title}
          </h2>

          <div className="flex items-center justify-between pt-1">
            {isHuntActive && treasure?.read ? (
              <TreasureSpot
                kind={treasure.read}
                treasureSlotIndex={treasure.readSlot}
                className="text-base font-medium leading-none text-[#092A31]"
              >
                Read article
              </TreasureSpot>
            ) : (
              <span className="text-base font-medium leading-none text-[#092A31] hover:underline">
                Read article
              </span>
            )}
            {wrap(
              treasure?.arrow,
              treasure?.arrowSlot,
              "inline-flex",
              <span className="inline-flex group-hover:text-primary size-6 items-center justify-center rounded-full bg-[#0E6A76] group-hover:bg-amdari-yellow text-white">
                <ArrowUpRight className="size-3.5" />
              </span>,
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
