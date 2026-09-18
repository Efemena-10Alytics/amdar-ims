import { Suspense } from "react";
import { ReferralsDashboard } from "@/components/_core/dashboard/referrals/referrals-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

function ReferralsFallback() {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

const ReferralsPage = () => {
  return (
    <Suspense fallback={<ReferralsFallback />}>
      <ReferralsDashboard />
    </Suspense>
  );
};

export default ReferralsPage;
