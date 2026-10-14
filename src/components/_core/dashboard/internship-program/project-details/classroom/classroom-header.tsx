import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/_core/dashboard/dashboard/header";

export default function ClassroomHeader({
  backHref,
}: {
  backHref: string;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-base font-semibold text-[#173740]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-[#EDF1F2] text-[#94A3B8]">
          <ArrowLeft className="size-4" />
        </span>
        Classroom
      </Link>

      <PageHeader />
    </header>
  );
}
