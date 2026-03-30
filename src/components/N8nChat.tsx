"use client";

import { useEffect } from "react";
import { createChat } from "@n8n/chat";
import "@/styles/n8n-chat-vendor.css";

const webhookUrl =
  process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL ??
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

export default function N8nChat() {
  useEffect(() => {
    if (!webhookUrl) {
      return;
    }

    const chat = createChat({
      webhookUrl,
      mode: "fullscreen",
      target: "#n8n-chat",
      loadPreviousSession: true,
      showWelcomeScreen: true,
      enableStreaming: false,
      initialMessages: ["Hi there! I'm Amda 👋"],
      i18n: {
        en: {
          title: "",
          subtitle: "",
          footer: "",
          getStarted: "New Conversation",
          inputPlaceholder: "Type your message...",
          closeButtonTooltip: "",
        },
      },
    });

    return () => {
      chat?.unmount?.();
    };
  }, []);

  if (!webhookUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-clash-display text-2xl text-slate-900">
            Chat is not configured
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Set <code>NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL</code> in your env file
            to connect this page to your n8n Chat Trigger webhook.
          </p>
        </div>
      </div>
    );
  }

  return <div id="n8n-chat" className="n8n-chat-shell" />;
}
