import { Suspense } from "react";
import SignUpContent from "./sign-up-content";

function SignUpFallback() {
  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col items-center justify-center p-6">
      <p className="text-[#64748B]">Loading…</p>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpContent />
    </Suspense>
  );
}
