"use client";

import { useParams } from "next/navigation";
import Classic from "@/components/_core/public-portfolio/classic";
import { useGetPortfolioByUserId } from "@/features/portfolio/use-get-portfolio-by-id";
import { useGetPortfolioBySharePathname } from "@/features/portfolio/use-get-portfolio-share";

export default function PortfolioByUserIdPage() {
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const { data: portfolio, isLoading, error } = useGetPortfolioBySharePathname(userId ?? null);

  return (
    <div className="mt-10">
      <Classic
        portfolio={portfolio}
        isLoading={isLoading}
        error={error}
        portfolioUserId={userId}
      />
    </div>
  );
}
