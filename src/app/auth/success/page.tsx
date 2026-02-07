import { Suspense } from "react";
import SuccessContent from "./success-content";

function SuccessFallback() {
  return (
    <div className="flex-1 w-full h-full overflow-y-auto flex items-center justify-center">
      <p className="text-[#64748B]">Loading…</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
