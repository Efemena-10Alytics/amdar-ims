"use client";

import { useState } from "react";
import { Heart, MessageSquare, SendHorizontal, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { getAvatarUrlFromUser, useGetUserInfo } from "@/features/auth/use-get-user-info";

/* ------------------------------------------------------------------ */
/* Mock data — there is no blog comments/reactions API yet, so the      */
/* thread below is local state. Swap this for the real endpoint when    */
/* it lands; the components take plain props.                          */
/* ------------------------------------------------------------------ */

export type BlogComment = {
  id: string;
  author: string;
  initials: string;
  color: string;
  body: string;
  time: string;
  date: string;
  likes: number;
  dislikes: number;
  replyCount: number;
  liked?: boolean;
  replies?: BlogComment[];
};

const MOCK_BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.reate user-centered designs, product requirements, roadmaps, prototypes, and…";

const MOCK_COMMENTS: BlogComment[] = [
  {
    id: "1",
    author: "Priscilla",
    initials: "P",
    color: "#F97432",
    body: MOCK_BODY,
    time: "08:34am",
    date: "May 12, 2026",
    likes: 234000,
    dislikes: 12,
    replyCount: 12,
    replies: [
      {
        id: "1-1",
        author: "Priscilla",
        initials: "P",
        color: "#6366F1",
        body: MOCK_BODY,
        time: "08:34am",
        date: "May 12, 2026",
        likes: 0,
        dislikes: 0,
        replyCount: 0,
      },
      {
        id: "1-2",
        author: "Priscilla",
        initials: "P",
        color: "#C13584",
        body: MOCK_BODY,
        time: "08:34am",
        date: "May 12, 2026",
        likes: 0,
        dislikes: 0,
        replyCount: 0,
      },
    ],
  },
  {
    id: "2",
    author: "Andrew",
    initials: "A",
    color: "#0E6A76",
    body: MOCK_BODY,
    time: "08:34am",
    date: "May 12, 2026",
    likes: 234000,
    dislikes: 12,
    replyCount: 12,
    liked: true,
  },
  {
    id: "3",
    author: "Andrew",
    initials: "A",
    color: "#B45309",
    body: MOCK_BODY,
    time: "08:34am",
    date: "May 12, 2026",
    likes: 0,
    dislikes: 0,
    replyCount: 0,
  },
];

export function formatCount(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return String(value);
}

function Avatar({
  initials,
  color,
  src,
  className = "size-8",
}: {
  initials: string;
  color: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={40}
        height={40}
        unoptimized={src.startsWith("http")}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${className} flex shrink-0 items-center justify-center rounded-full font-sora text-xs font-semibold text-white`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function ReactionPills({
  likes,
  dislikes,
  comments,
  liked,
  onToggleLike,
}: {
  likes: number;
  dislikes: number;
  comments: number;
  liked?: boolean;
  onToggleLike?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleLike}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFF1] px-2.5 py-1 font-sora text-xs text-[#0C3640]"
      >
        <Heart
          className={`size-3.5 ${liked ? "fill-[#E4572E] text-[#E4572E]" : "text-[#0E6A76]"}`}
        />
        {formatCount(likes)}
      </button>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFF1] px-2.5 py-1 font-sora text-xs text-[#0C3640]">
        <ThumbsDown className="size-3.5 text-[#0E6A76]" />
        {formatCount(dislikes)}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFF1] px-2.5 py-1 font-sora text-xs text-[#0C3640]">
        <MessageSquare className="size-3.5 text-[#0E6A76]" />
        {formatCount(comments)}
      </span>
    </div>
  );
}

function CommentBody({ comment }: { comment: BlogComment }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <p className="font-sora text-sm font-semibold text-[#092A31]">{comment.author}</p>
      <p className="mt-1 font-sora text-xs leading-relaxed text-[#4C6A70]">{comment.body}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="font-sora text-[11px] text-[#8EA0AA]">{comment.time}</span>
        <span className="font-sora text-[11px] text-[#8EA0AA]">{comment.date}</span>
      </div>
    </div>
  );
}

export default function BlogComments() {
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  const [comments, setComments] = useState<BlogComment[]>(MOCK_COMMENTS);
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>("3");
  const [replyDraft, setReplyDraft] = useState("");

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    );
  };

  const submitComment = () => {
    const body = draft.trim();
    if (!body) return;
    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: "You",
        initials: "Y",
        color: "#156374",
        body,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        likes: 0,
        dislikes: 0,
        replyCount: 0,
      },
    ]);
    setDraft("");
  };

  return (
    <section className="space-y-4">
      {/* Composer */}
      <div className="flex items-center gap-3">
        <Avatar initials="Y" color="#156374" src={avatarUrl} className="size-10" />
        <div className="flex h-12 flex-1 items-center gap-2 rounded-full bg-[#E8EFF1] pr-2 pl-4">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitComment();
            }}
            placeholder="Type comment here..."
            className="h-full w-full bg-transparent font-sora text-sm text-[#092A31] outline-none placeholder:text-[#8EA0AA]"
          />
          <button
            type="button"
            onClick={submitComment}
            aria-label="Post comment"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0E6A76] transition-colors hover:bg-white"
          >
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <h2 className="font-sora text-base font-semibold text-[#092A31]">Comment</h2>

      <div className="space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-xl bg-[#F8FAFC] p-4">
            <div className="flex gap-3">
              <Avatar initials={comment.initials} color={comment.color} />
              <CommentBody comment={comment} />
            </div>

            {comment.replies?.map((reply) => (
              <div key={reply.id} className="mt-4 flex gap-3 pl-3 sm:pl-6">
                <Avatar initials={reply.initials} color={reply.color} />
                <CommentBody comment={reply} />
              </div>
            ))}

            {replyingTo === comment.id ? (
              <div className="mt-4 flex items-center gap-2 pl-3 sm:gap-3 sm:pl-6">
                <Avatar initials="Y" color="#156374" src={avatarUrl} />
                <div className="flex h-10 flex-1 items-center rounded-lg bg-white px-3">
                  <input
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    placeholder="Type reply here..."
                    className="h-full w-full bg-transparent font-sora text-sm text-[#092A31] outline-none placeholder:text-[#8EA0AA]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReplyDraft("");
                    setReplyingTo(null);
                  }}
                  className="h-10 shrink-0 rounded-lg bg-[#0C3640] px-4 font-sora text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <ReactionPills
                  likes={comment.likes}
                  dislikes={comment.dislikes}
                  comments={comment.replyCount}
                  liked={comment.liked}
                  onToggleLike={() => toggleLike(comment.id)}
                />
                <button
                  type="button"
                  onClick={() => setReplyingTo(comment.id)}
                  className="h-8 shrink-0 rounded-lg bg-[#E8EFF1] px-3 font-sora text-sm text-[#0C3640] transition-opacity hover:opacity-90"
                >
                  Reply
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
