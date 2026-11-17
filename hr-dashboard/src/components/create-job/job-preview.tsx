import type { JobDraft } from "./create-job-form";

const CURRENCY_SYMBOL: Record<string, string> = {
  "NGN (₦)": "₦",
  "USD ($)": "$",
  "GBP (£)": "£",
  "CAD (C$)": "C$",
};

function formatAmount(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString();
}

function CompanyMark() {
  return (
    <svg width="48" height="48" viewBox="0 0 66 67" fill="none" aria-hidden>
      <rect width="66" height="67" rx="20" fill="#E8EFF1" />
      <rect x="18.5625" y="19.0625" width="28.8756" height="28.8756" rx="14.4378" fill="#005E6C" />
      <path
        d="M25.7812 40.3626L33.0916 26.2812L40.219 40.719"
        strokeWidth="2.88756"
        strokeMiterlimit="2.61313"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
    </svg>
  );
}

/** Mirrors the card a candidate sees on the careers page. */
export function JobPreview({ draft }: { draft: JobDraft }) {
  const symbol = CURRENCY_SYMBOL[draft.currency] ?? "";
  const min = formatAmount(draft.minSalary);
  const max = formatAmount(draft.maxSalary);
  const showSalary = draft.showSalary && Boolean(min || max);
  const salaryLine = [min && `${symbol}${min}`, max && `${symbol}${max}`]
    .filter(Boolean)
    .join(" – ");

  return (
    <section className="app-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">Job preview</h2>
        <span className="text-sm text-[#156374]">Candidate view</span>
      </div>

      <div className="mt-4 rounded-2xl border border-[#EEF2F6] p-4">
        <div className="flex items-center gap-3">
          <CompanyMark />
          <div className="min-w-0">
            <p className="truncate text-sm text-[#64748B]">
              {draft.department || "Design & Engineering"}
            </p>
            <h3 className="truncate font-clash-display text-xl font-semibold text-[#092A31]">
              {draft.title || "Product Designer"}
            </h3>
          </div>
        </div>

        <dl className="mt-4 flex flex-col gap-1.5 text-sm">
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 text-[#94A3B8]">Vacancies  :</dt>
            <dd className="font-semibold text-[#092A31]">{draft.openings || "1"}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="shrink-0 text-[#94A3B8]">Work Hours</dt>
            <dd className="truncate font-semibold text-[#092A31]">
              {draft.workDays || "Mon – Fri"},&nbsp; {draft.workTime || "9 AM – 5 PM"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 grid grid-cols-3 divide-x divide-[#E2E8F0] border-t border-[#E2E8F0] pt-3">
          <div className="pr-2">
            <p className="text-xs text-[#94A3B8]">Job Type</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#156374]">
              {draft.workplace === "Remote" ? "Fully Remote" : draft.workplace || "Fully Remote"}
            </p>
          </div>
          <div className="px-2">
            <p className="text-xs text-[#94A3B8]">Experience</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#156374]">
              {draft.experience.replace(/ level$/i, "") || "Senior"}
            </p>
          </div>
          <div className="pl-2">
            <p className="text-xs text-[#94A3B8]">Deadline:</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#156374]">
              {draft.deadline || "31 Oct. 2026"}
            </p>
          </div>
        </div>

        {(showSalary || draft.deadline) && (
          <div className="mt-4 border-t border-[#E2E8F0] pt-3">
            {showSalary && (
              <p className="text-sm font-semibold text-[#092A31]">{salaryLine} / month</p>
            )}
            {draft.deadline && (
              <p className="mt-0.5 text-sm text-[#64748B]">Apply by {draft.deadline}</p>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-[#64748B]">
        A quick look at how your role will appear on your careers page.
      </p>
    </section>
  );
}
