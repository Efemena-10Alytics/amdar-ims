"use client";

import dynamic from "next/dynamic";
import "./n8n-chat.css";
import Image from "next/image";

const N8nChat = dynamic(() => import("@/components/N8nChat"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#f5f7fa]">
      <p className="text-muted-foreground">Loading chat...</p>
    </div>
  ),
});

export default function ChatPage() {
  return (
    <>
      <Image
        src={"/chat-logo.svg"}
        alt="Amdari"
        sizes="64px"
        height={64}
        width={64}
        className="fixed left-5 top-5"
      />
      <N8nChat />
    </>
  );
}
