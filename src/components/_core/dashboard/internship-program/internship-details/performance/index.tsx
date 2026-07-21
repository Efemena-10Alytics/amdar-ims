import { Folder, Star, TrendingUp, UserRound } from "lucide-react";

const PROJECT_TITLE =
  "Tenant Retention Optimization: Building an Interactive Power BI Dashboard for...";

const PERFORMANCE_ITEMS = [
  { id: 1, rating: 5 },
  { id: 2, rating: 5 },
  { id: 3, rating: 4 },
  { id: 4, rating: 4 },
  { id: 5, rating: 4 },
] as const;

function RatingStars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            className={
              size === "lg"
                ? "size-5 text-[#E5A23A]"
                : "size-3.5 text-[#E5A23A]"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={1.75}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function PerformanceRoadMap() {
  return (
    <article className="relative min-h-80 overflow-hidden rounded-xl bg-[#F8FAFC] p-4 sm:min-h-100">
      <h2 className="relative z-10 text-sm font-semibold text-[#173740]">
        Your road map
      </h2>

      <div className="absolute inset-x-0 bottom-0 h-[82%]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 360 300"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M-35 292 C 38 269, 91 265, 139 226 C 194 181, 181 131, 242 105 C 282 88, 326 78, 394 70"
            fill="none"
            stroke="#B9D8DE"
            strokeWidth="70"
            strokeLinecap="round"
          />
          <path
            d="M-35 292 C 38 269, 91 265, 139 226 C 194 181, 181 131, 242 105 C 282 88, 326 78, 394 70"
            fill="none"
            stroke="#7AB5C0"
            strokeWidth="3"
            strokeDasharray="8 10"
            strokeLinecap="round"
          />
          <path
            d="M-35 292 C 30 274, 69 268, 103 249"
            fill="none"
            stroke="#0F6371"
            strokeWidth="4"
            strokeDasharray="10 9"
            strokeLinecap="round"
          />
        </svg>

        <Star
          className="absolute bottom-[17%] left-[48%] size-3 fill-[#E5A23A] text-[#E5A23A]"
          aria-hidden
        />
        <Star
          className="absolute bottom-[28%] left-[61%] size-3 fill-[#E5A23A] text-[#E5A23A]"
          aria-hidden
        />
        <Star
          className="absolute bottom-[42%] left-[94%] size-3 fill-[#E5A23A] text-[#E5A23A]"
          aria-hidden
        />

        <div className="absolute bottom-[8%] left-[18%] flex -translate-x-1/2 flex-col items-center">
          <span className="mb-1 flex size-7 items-center justify-center rounded-lg border-2 border-[#E5A23A] bg-[#F8D5C8] text-[#173740] shadow-sm">
            <UserRound className="size-4" aria-hidden />
          </span>
          <span className="text-[10px] font-semibold text-[#173740]">Start</span>
          <span className="mt-3 rounded-full bg-[#CFF6DA] px-2.5 py-1 text-[10px] font-semibold text-[#1F7A4A] shadow-sm">
            Uniformity
          </span>
        </div>

        <div className="absolute top-[20%] left-[66%] flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="rounded-full bg-[#E8EDF0] px-2.5 py-1 text-[10px] font-semibold text-[#94A3B8]">
            Formative
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#B8C5CC] shadow-sm">
            <Star className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

function OverallRating() {
  return (
    <section className="rounded-xl border border-[#C8E6D0] bg-[#E8F7EC] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#64748B]">Overall rating</p>
          <p className="mt-1 text-2xl font-semibold text-[#173740]">4.8</p>
        </div>
        <RatingStars rating={5} size="lg" />
      </div>

      <p className="mt-5 inline-flex items-center gap-2 text-xs text-[#7A9A92]">
        <span className="flex size-5 items-center justify-center rounded-full bg-[#CFF6DA] text-[#238A50]">
          <TrendingUp className="size-3" strokeWidth={2.5} aria-hidden />
        </span>
        You&apos;re trending upward
      </p>
    </section>
  );
}

function PerformanceItem({
  rating,
}: {
  rating: number;
}) {
  return (
    <article className="flex items-center gap-3 border-b border-[#E2E8F0] px-4 py-3 last:border-b-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#4F8EF7]">
        <Folder className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#173740] sm:text-sm">
          {PROJECT_TITLE}
        </p>
        <p className="mt-0.5 text-[11px] text-[#94A3B8] sm:text-xs">
          Rated by Ambler · 2 days ago
        </p>
      </div>

      <div className="shrink-0 text-right">
        <RatingStars rating={rating} />
        <p className="mt-1 text-[10px] text-[#64748B]">{rating}.0</p>
      </div>
    </article>
  );
}

const Performance = () => {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.4fr)]">
      <PerformanceRoadMap />

      <div className="min-w-0 space-y-4">
        <OverallRating />

        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          {PERFORMANCE_ITEMS.map((item) => (
            <PerformanceItem key={item.id} rating={item.rating} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Performance;
