"use client";

import { Suspense } from "react";
import ClassroomPageContent from "@/components/_core/dashboard/internship-program/project-details/classroom/classroom-page-content";

export default function ClassroomPage() {
  return (
    <Suspense
      fallback={
        <main className="px-4 py-10 text-center text-sm text-[#64748B] lg:px-6">
          Loading classroom...
        </main>
      }
    >
      <ClassroomPageContent />
    </Suspense>
  );
}
