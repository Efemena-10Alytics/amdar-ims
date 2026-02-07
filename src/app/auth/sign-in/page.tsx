import { Suspense } from "react";
import SignInContent from "./sign-in-content";

function SignInFallback() {
  return (
    <main className="flex-1 w-full h-full overflow-y-auto flex flex-col items-center justify-center p-6">
      <p className="text-[#64748B]">Loading…</p>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}
