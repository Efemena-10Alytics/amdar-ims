"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetPortfolioBySharePathname } from "@/features/portfolio/use-get-portfolio-share";
import ClassicPublic from "@/components/_core/public-portfolio/classic";
import BoldPublic from "@/components/_core/public-portfolio/bold";

type AvailableTemplateId = "classic" | "bold";

export default function PortfolioByUserIdPage() {
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const { data: portfolio, isLoading, error } = useGetPortfolioBySharePathname(userId ?? null);
  const selectedTemplate = useMemo<AvailableTemplateId>(() => {
    const template = portfolio?.setting?.template?.trim().toLowerCase();
    if (template === "bold") return "bold";
    return "classic";
  }, [portfolio?.setting?.template]);

  return (
    <div className="mt-10">
      {selectedTemplate === "bold" ? (
        <BoldPublic
          portfolio={portfolio}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <ClassicPublic
          portfolio={portfolio}
          isLoading={isLoading}
          error={error}
          portfolioUserId={userId}
        />
      )}
    </div>
  );
}
