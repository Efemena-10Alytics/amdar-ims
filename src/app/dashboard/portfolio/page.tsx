"use client";

import { useState } from "react";
import Link from "next/link";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { ArrowLeft, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoToastBanner } from "@/components/ui/info-toast-banner";
import {
  LockKeyHoleIcon,
  PencilFilledIcon,
  ShareFilledIcon,
} from "@/components/_core/dashboard/svg";
import { cn } from "@/lib/utils";
import { PortfolioSettingsModal } from "@/components/_core/dashboard/portfolio/portfolio-settings-modal";
import { ViewLinkModal } from "@/components/_core/dashboard/portfolio/view-link-modal";
import CreateClassic from "@/components/_core/dashboard/portfolio/template/classic";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { usePortfolioCompletionRedirect } from "@/hooks/use-portfolio-completion-redirect";

const TEMPLATES = [
  { id: "classic", label: "Classic", comingSoon: false },
  { id: "bold", label: "Bold", comingSoon: true },
  { id: "simple", label: "Simple", comingSoon: true },
  // { id: "highlight", label: "Highlight", comingSoon: true },
  // { id: "whole", label: "Whole", comingSoon: true },
  // { id: "dark", label: "Dark", comingSoon: true },
  // { id: "square", label: "Square", comingSoon: true },
] as const;

// Template images from public/pngs/template/ (e.g. classic.png, bold.png, ...)
const TEMPLATE_IMAGE_BASE = "/images/pngs/template";

function TemplatePreview({
  id,
  label,
  selected,
  comingSoon,
  onClick,
}: {
  id: string;
  label: string;
  selected: boolean;
  comingSoon?: boolean;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const src = `${TEMPLATE_IMAGE_BASE}/${id}.png`;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={comingSoon ? undefined : onClick}
        disabled={comingSoon}
        className={cn(
          "flex shrink-0 flex-col items-center gap-2 min-h-35 text-left rounded-xl w-full max-w-30",
          comingSoon ? "cursor-not-allowed" : "transition-colors",
          !comingSoon &&
          (selected
            ? "border-primary bg-primary/5"
            : "border-zinc-200 bg-white hover:border-zinc-300"),
        )}
        aria-pressed={selected}
        aria-label={comingSoon ? `${label} (Coming soon)` : `Template: ${label}`}
      >
        <div className="relative w-full min-h-35 aspect-4/3 rounded-lg overflow-hidden bg-zinc-100">
          {!imgError ? (
            <img
              src={src}
              alt=""
              className={cn(
                "h-full min-h-35 w-full object-cover object-top border-2 rounded-xl",
                comingSoon && "blur-xs",
                !comingSoon &&
                (selected
                  ? "border-primary bg-primary/5"
                  : "border-zinc-200 bg-white hover:border-zinc-300"),
              )}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-400 text-xs">
              Preview
            </div>
          )}
          {comingSoon && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <div className="flex size-10 items-center justify-center rounded-md  text-primary">
                <LockKeyHoleIcon />
              </div>
            </div>
          )}
        </div>
      </button>
      <span
        className={cn(
          "text-sm font-medium",
          comingSoon && "text-[#C19A5B] font-medium",
          !comingSoon && (selected ? "text-primary" : "text-zinc-700"),
        )}
      >
        {comingSoon ? "Coming soon!" : label}
      </span>
    </div>
  );
}

export default function PortfolioPage() {
  const { data: portfolio, isLoading, error } = useGetPortfolio();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);
  const portfolioHref = userId != null ? `/portfolio/${userId}` : "/portfolio";
  const hasAtLeastOneProject = (portfolio?.projects?.length ?? 0) > 0;
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewLinkOpen, setViewLinkOpen] = useState(false);
  const [shareWarning, setShareWarning] = useState<string | null>(null);
  const { shouldRedirectToCreate } = usePortfolioCompletionRedirect({
    portfolio,
    isLoading,
    hasError: !!error,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] max-w-md text-center mx-auto items-center justify-center">
        <p className="text-sm text-red-600">You have not created and Portfolio hence will be redirect to create portfolio page.</p>
      </div>
    );
  }

  if (shouldRedirectToCreate) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow rounded-2xl p-5">
        <header className="flex items-center justify-between w-full bg-white py-4 px-0">
          <Link
            href="/dashboard"
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
              onClick={() => {
                if (!hasAtLeastOneProject) {
                  setShareWarning(
                    "User must add at least one project before they can share their portfolio.",
                  );
                  setTimeout(() => setShareWarning(null), 3500);
                  return;
                }
                setViewLinkOpen(true);
              }}
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

        <section className="py-6" aria-label="Portfolio template">
          <div className="overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1">
            <div className="flex gap-4">
              {TEMPLATES.map((t) => (
                <TemplatePreview
                  key={t.id}
                  id={t.id}
                  label={t.label}
                  selected={selectedTemplate === t.id}
                  comingSoon={t.comingSoon ?? false}
                  onClick={() => setSelectedTemplate(t.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <PortfolioSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        portfolioHref={portfolioHref}
      />
      <ViewLinkModal
        open={viewLinkOpen}
        onOpenChange={setViewLinkOpen}
        href={portfolioHref}
      />


      <CreateClassic />
      {shareWarning ? (
        <InfoToastBanner
          message={shareWarning}
          onDismiss={() => setShareWarning(null)}
        />
      ) : null}
    </div>
  );
}
