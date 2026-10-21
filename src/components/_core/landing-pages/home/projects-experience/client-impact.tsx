import Image from "next/image";
import { cn } from "@/lib/utils";

const QUOTE =
  "Loved the system hacking test we had with the team, absolutely brilliant and a thumbs up on the result collation slide. Looking to work with you more!";

const GoogleMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const Author = ({ onDark = false }: { onDark?: boolean }) => (
  <div className="mt-5 flex items-center gap-2.5">
    <GoogleMark className="size-6 shrink-0" />
    <div className="leading-tight">
      <p className={cn("text-sm font-semibold", onDark ? "text-white" : "text-[#092A31]")}>
        Amina
      </p>
      <p className={cn("text-xs", onDark ? "text-white/80" : "text-[#7B8A90]")}>
        Head of Product, Google
      </p>
    </div>
  </div>
);

const TextCard = ({ className }: { className?: string }) => (
  <article className={cn("rounded-3xl bg-[#F3F6F8] p-5 sm:p-6", className)}>
    <p className="text-sm leading-relaxed text-[#1C3A42] sm:text-[15px]">{QUOTE}</p>
    <Author />
  </article>
);

const ClientImpact = () => {
  return (
    <section className="pt-8 pb-14 lg:pt-10 lg:pb-20">
      <div className="app-width">
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-semibold text-[#092A31] sm:text-5xl">
              Client impact
            </h2>
            <div className="relative min-h-80 flex-1">
              <span className="absolute top-1/2 -left-5 z-10 size-12 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-[#3B82F6] bg-white shadow-md">
                <Image
                  src="/images/pngs/about/adeiza.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </span>
              <article className="absolute inset-0 overflow-hidden rounded-3xl">
                <Image
                  src="/images/pngs/business-testimonial/meeting.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B3A44]/90 via-[#0B3A44]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-white sm:text-[15px]">{QUOTE}</p>
                  <Author onDark />
                </div>
              </article>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <TextCard className="flex-1" />
            <TextCard className="flex-1" />
          </div>

          <div className="flex flex-col gap-4">
            <TextCard className="flex-1" />
            <TextCard className="flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientImpact;
