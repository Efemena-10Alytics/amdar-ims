const JobCardSkeleton = () => {
  return (
    <div className="flex h-[297px] flex-col justify-between rounded-xl bg-[#F8FAFC] p-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E2E8F0]" />
          <div className="flex-1">
            <div className="mt-4 h-3.5 w-24 animate-pulse rounded bg-[#E2E8F0]" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[#E2E8F0]" />
          </div>
        </div>

        <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-[#E2E8F0]" />
        <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded bg-[#E2E8F0]" />
      </div>

      <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
        <div className="h-3 w-20 animate-pulse rounded bg-[#E2E8F0]" />
        <div className="h-[42px] w-20 animate-pulse rounded-xl bg-[#E2E8F0]" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;
