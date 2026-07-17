"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  isPortfolioShareNotFoundError,
  useGetPortfolioBySharePathname,
} from "@/features/portfolio/use-get-portfolio-share";
import ClassicPublic from "@/components/_core/public-portfolio/classic";
import BoldPublic from "@/components/_core/public-portfolio/bold";

type AvailableTemplateId = "classic" | "bold";

function PortfolioNotFound() {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-semibold tracking-tight text-[#0F4652]">404</p>
      <h1 className="mt-3 text-xl font-semibold text-[#173740]">
        Portfolio not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#64748B]">
        This portfolio link is invalid or the portfolio no longer exists.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:bg-primary/90"
      >
        Go to homepage
      </Link>
    </main>
  );
}

function PortfolioFetchError({
  isRetrying,
  onRetry,
}: {
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-[#173740]">
        Something went wrong while fetching data
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#64748B]">
        We couldn&apos;t load this portfolio right now. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </main>
  );
}

export default function PortfolioByUserIdPage() {
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const {
    data: portfolio,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetPortfolioBySharePathname(userId ?? null);
  const selectedTemplate = useMemo<AvailableTemplateId>(() => {
    const template = portfolio?.setting?.template?.trim().toLowerCase();
    if (template === "bold") return "bold";
    return "classic";
  }, [portfolio?.setting?.template]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-12 animate-spin text-primary" aria-hidden />
        <p className="text-sm font-medium text-primary">Loading portfolio...</p>
      </div>
    );
  }

  if (isError && isPortfolioShareNotFoundError(error)) {
    return <PortfolioNotFound />;
  }

  if (isError) {
    return (
      <PortfolioFetchError
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  // Query finished without error but returned no portfolio.
  if (!portfolio) {
    return (
      <PortfolioFetchError
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="mt-10">
      {selectedTemplate === "bold" ? (
        <BoldPublic
          portfolio={portfolio}
          isLoading={false}
          error={null}
          portfolioUserId={userId}
        />
      ) : (
        <ClassicPublic
          portfolio={portfolio}
          isLoading={false}
          error={null}
          portfolioUserId={userId}
        />
      )}
    </div>
  );
}
