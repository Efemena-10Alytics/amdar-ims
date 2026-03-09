"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PencilFilledIcon,
  ShareFilledIcon,
} from "@/components/_core/dashboard/svg";
import { cn } from "@/lib/utils";
import { PortfolioSettingsModal } from "@/components/_core/dashboard/portfolio/portfolio-settings-modal";
import { ViewLinkModal } from "@/components/_core/dashboard/portfolio/view-link-modal";
import CreateClassic from "@/components/_core/dashboard/portfolio/template/classic";

const TEMPLATES = [
  { id: "classic", label: "Classic" },
  { id: "bold", label: "Bold" },
  { id: "simple", label: "Simple" },
  { id: "highlight", label: "Highlight" },
  { id: "whole", label: "Whole" },
  { id: "dark", label: "Dark" },
  { id: "square", label: "Square" },
] as const;

// Template images from public/pngs/template/ (e.g. classic.png, bold.png, ...)
const TEMPLATE_IMAGE_BASE = "/images/pngs/template";

function TemplatePreview({
  id,
  label,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const src = `${TEMPLATE_IMAGE_BASE}/${id}.png`;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex shrink-0 flex-col items-center gap-2 min-h-35 text-left transition-colors rounded-xl w-full max-w-30",
          selected
            ? "border-primary bg-primary/5"
            : "border-zinc-200 bg-white hover:border-zinc-300",
        )}
        aria-pressed={selected}
        aria-label={`Template: ${label}`}
      >
        <div className="relative w-full min-h-35 aspect-4/3 rounded-lg overflow-hidden bg-zinc-100">
          {!imgError ? (
            <img
              src={src}
              alt=""
              className={cn(
                "h-full min-h-35 w-full object-cover object-top border-2 rounded-xl",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-zinc-200 bg-white hover:border-zinc-300",
              )}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-400 text-xs">
              Preview
            </div>
          )}
        </div>
      </button>
      <span
        className={cn(
          "text-sm font-medium",
          selected ? "text-primary" : "text-zinc-700",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function PortfolioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewLinkOpen, setViewLinkOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between w-full border-b border-zinc-200 bg-white py-4 px-0">
        <Link
          href="/dashboard-dev"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <Link href={"portfolio/create-portfolio"}>
            <Button
              type="button"
              variant="secondary"
              className="rounded-lg bg-[#F1F5F9] text-zinc-700 hover:bg-zinc-200 border-0"
            >
              <PencilFilledIcon />
              Edit details
            </Button>
          </Link>
          <Button
            type="button"
            className="rounded-lg bg-primary text-white hover:bg-primary/90"
            onClick={() => setViewLinkOpen(true)}
          >
            Share portfolio
            <ShareFilledIcon />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full bg-[#F1F5F9] text-zinc-700 hover:bg-zinc-200 border-0 size-9"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      <PortfolioSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
      <ViewLinkModal
        open={viewLinkOpen}
        onOpenChange={setViewLinkOpen}
        onContinue={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/portfolio";
          }
        }}
      />

      <section className="py-6" aria-label="Portfolio template">
        <div className="overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1">
          <div className="flex gap-4">
            {TEMPLATES.map((t) => (
              <TemplatePreview
                key={t.id}
                id={t.id}
                label={t.label}
                selected={selectedTemplate === t.id}
                onClick={() => setSelectedTemplate(t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <CreateClassic />
    </div>
  );
}
