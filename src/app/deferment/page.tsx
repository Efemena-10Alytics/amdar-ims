"use client";

import { Suspense } from "react";
import { DeferInternshipForm } from "@/components/_core/deferment/defer-internship-form";

function DefermentFallback() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <p className="text-sm text-[#64748B]">Loading deferment form...</p>
    </div>
  );
}

export default function DefermentPage() {
  return (
    <Suspense fallback={<DefermentFallback />}>
      <DeferInternshipForm />
    </Suspense>
  );
}
