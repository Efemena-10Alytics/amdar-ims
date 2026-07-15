import Link from "next/link";
import { ArrowLeft, } from "lucide-react";

type PreviousStepButtonProps = {
  href: string;
};

export default function PreviousStepButton({ href }: PreviousStepButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Go to previous step"
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#C9DDE2] text-[#5F8993] transition-colors hover:bg-[#B6CFD4] hover:text-[#156374]"
    >
      <ArrowLeft className="size-4" strokeWidth={2.5} />
    </Link>
  );
}
