"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") ?? "";
  const programParam = searchParams.get("program") ?? "";
  const signInHref = programParam
    ? `/auth/sign-in?program=${programParam}`
    : "/auth/sign-in";

  return (
    <div className="flex-1 w-full h-full overflow-y-auto flex items-center justify-center">
      <div className="rounded-2xl bg-white p-8 sm:p-10 border border-gray-100 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-[#092A31]">Successful!</h2>

        <div className="mt-6 flex justify-center">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#359E5B] bg-white text-[#359E5B]"
            aria-hidden
          >
            <Check className="h-10 w-10" strokeWidth={1} />
          </span>
        </div>

        <p className="mt-6 text-[#64748B] text-base leading-relaxed max-w-xs mx-auto">
          {typeParam === "forgot-password"
            ? "You have successfully reset your password.Click login to continue"
            : "You have successfully created your Amdari account"}
        </p>

        {/* {emailParam && (
          <p className="mt-2 text-sm text-[#64748B]">
            Confirmation sent to <span className="font-medium text-[#092A31]">{emailParam}</span>
          </p>
        )} */}

        <div className="mt-6">
          <Button asChild className="w-full rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12">
            <Link href={signInHref}>Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
