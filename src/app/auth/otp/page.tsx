import { Suspense } from "react";
import OtpContent from "./otp-content";

function OtpFallback() {
  return (
    <main className="flex-1 w-full min-h-full overflow-y-auto flex flex-col items-center justify-center p-6">
      <p className="text-[#64748B]">Loading…</p>
    </main>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<OtpFallback />}>
      <OtpContent />
    </Suspense>
  );
}
