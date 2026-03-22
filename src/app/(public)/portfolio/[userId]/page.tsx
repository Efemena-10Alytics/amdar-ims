"use client";

import { useParams } from "next/navigation";
import Classic from "@/components/_core/public-portfolio/classic";
import { useGetPortfolioByUserId } from "@/features/portfolio/use-get-portfolio-by-id";

export default function PortfolioByUserIdPage() {
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const { data: portfolio, isLoading, error } = useGetPortfolioByUserId(userId ?? null);

  return (
    <div className="mt-10">
      <Classic portfolio={portfolio} isLoading={isLoading} error={error} />
    </div>
  );
}
