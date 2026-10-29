const Bone = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-[#E8EFF1] ${className}`} />
);

/** Mirrors the bank drawer's layout while a locale's form is being swapped in. */
export function WithdrawalDrawerSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" aria-busy aria-live="polite">
      <span className="sr-only">Loading withdrawal form</span>

      {/* Account holder banner */}
      <div className="flex items-center gap-3 rounded-xl bg-[#156374]/90 px-4 py-3.5">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-white/25" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-white/25" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/20" />
        </div>
      </div>

      {/* Balance + amount */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <Bone className="h-3.5 w-28" />
          <Bone className="h-3.5 w-32" />
        </div>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-[#F6F8FA] p-2">
          <div className="size-8 shrink-0 animate-pulse rounded-full bg-[#E8EFF1]" />
          <Bone className="h-4 w-20" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-white" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Bone className="h-3 w-40" />
          <div className="flex gap-2">
            <Bone className="h-8 w-16 rounded-lg" />
            <Bone className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Country + currency */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index}>
            <Bone className="h-3.5 w-20" />
            <Bone className="mt-1.5 h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Account details */}
      <Bone className="mt-6 h-5 w-44" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mt-4">
          <Bone className="h-3.5 w-40" />
          <Bone className="mt-1.5 h-11 w-full rounded-xl" />
        </div>
      ))}

      <Bone className="mt-5 h-5 w-32" />
    </div>
  );
}
