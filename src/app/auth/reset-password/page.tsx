import { Suspense } from "react";
import ResetPasswordContent from "./reset-password-content";

function ResetPasswordFallback() {
  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col items-center justify-center p-6">
      <p className="text-[#64748B]">Loading…</p>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
