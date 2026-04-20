"use client";

import { useParams } from "next/navigation";
import { useGetPortfolioBySharePathname } from "@/features/portfolio/use-get-portfolio-share";
import ClassicPublic from "@/components/_core/public-portfolio/classic";
import BoldPublic from "@/components/_core/public-portfolio/bold";

export default function PortfolioByUserIdPage() {
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const { data: portfolio, isLoading, error } = useGetPortfolioBySharePathname(userId ?? null);

  return (
    <div className="mt-10">
      {/* <ClassicPublic
        portfolio={portfolio}
        isLoading={isLoading}
        error={error}
        portfolioUserId={userId}
      /> */}
      <BoldPublic
        portfolio={portfolio}
        isLoading={isLoading}
        error={error}
      // portfolioUserId={userId}
      />
    </div>
  );
}
