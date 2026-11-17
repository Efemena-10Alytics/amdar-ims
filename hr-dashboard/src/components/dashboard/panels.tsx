import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  LineChart,
  User,
  Video,
} from "lucide-react";
import {
  INTERVIEW_DAYS,
  OPEN_ROLES,
  PIPELINE,
  RECENT_APPLICANTS,
  STATS,
  UPCOMING_INTERVIEWS,
  type ApplicantStage,
  type RoleStatus,
} from "./data";

const STAT_ICONS = {
  briefcase: BriefcaseBusiness,
  user: User,
  calendar: CalendarDays,
  chart: LineChart,
};

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => {
        const Icon = STAT_ICONS[stat.icon];
        return (
          <div key={stat.label} className="app-card min-w-0 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-[#64748B]">{stat.label}</p>
              <Icon className="size-5 shrink-0 text-[#156374]" aria-hidden />
            </div>
            <p className="mt-2 font-clash-display text-4xl font-semibold text-[#092A31]">
              {stat.value}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#E9F7EF] px-1.5 py-0.5 text-xs font-medium text-[#1F7A4A]">
                <ArrowUpRight className="size-3" aria-hidden />
                {stat.delta}
              </span>
              <span className="text-xs text-[#94A3B8]">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Chart body is intentionally blank until the charting pass. */
export function ApplicationOverview() {
  return (
    <section className="app-card min-w-0 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-clash-display text-xl font-semibold text-[#092A31]">
            Application overview
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">248 applications received this month</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E6EDEF] px-3 text-sm text-[#092A31]"
        >
          Last two months
          <ChevronDown className="size-4 text-[#64748B]" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-5 text-sm">
        <span className="flex items-center gap-2 text-[#092A31]">
          <span className="size-2 rounded-full bg-[#156374]" aria-hidden />
          October
        </span>
        <span className="flex items-center gap-2 text-[#94A3B8]">
          <span className="size-2 rounded-full bg-[#CBD5E1]" aria-hidden />
          September
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex h-45 flex-col justify-between py-1 text-xs text-[#94A3B8]">
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        {/* Chart goes here. */}
        <div className="h-45 flex-1 rounded-lg border border-dashed border-[#E2E8F0]" />
      </div>

      <div className="mt-2 flex justify-between pl-9 text-xs text-[#94A3B8]">
        {["1 Oct", "3 Oct", "5 Oct", "7 Oct", "9 Oct", "11 Oct", "14 Oct"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}

export function HiringPipeline() {
  const max = Math.max(...PIPELINE.map((row) => row.count));

  return (
    <section className="app-card flex min-w-0 flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-xl font-semibold text-[#092A31]">
          Hiring pipeline
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#156374]"
        >
          View pipeline
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {PIPELINE.map((row) => (
          <div key={row.stage} className="flex items-center gap-3">
            <span className="w-33 shrink-0 text-sm text-[#475569]">{row.stage}</span>
            <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(row.count / max) * 100}%`, background: row.tone }}
              />
            </span>
            <span className="w-9 shrink-0 text-right text-sm font-semibold text-[#092A31]">
              {row.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-[#FFF8E6] px-4 py-3">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#E9A23B]" aria-hidden />
        <p className="text-sm text-[#5A431B]">
          18 new applications need your review{" "}
          <button type="button" className="font-semibold text-[#092A31] underline-offset-2 hover:underline">
            Review →
          </button>
        </p>
      </div>
    </section>
  );
}

const ROLE_STATUS_STYLE: Record<RoleStatus, string> = {
  Open: "bg-[#E9F7EF] text-[#1F7A4A]",
  "Closing soon": "bg-[#FFF4D6] text-[#8A6D1B]",
};

export function OpenRolesTable() {
  return (
    <section className="app-card min-w-0 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-xl font-semibold text-[#092A31]">Open roles</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#156374]"
        >
          View all 12 roles
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-150 border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EEF2F6] text-xs tracking-wide text-[#94A3B8] uppercase">
              <th className="pb-3 font-medium">Role / Department</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Applicants</th>
              <th className="pb-3 font-medium">Deadline</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {OPEN_ROLES.map((role) => (
              <tr key={role.role} className="border-b border-[#F4F7F8] last:border-b-0">
                <td className="py-4">
                  <p className="font-semibold text-[#092A31]">{role.role}</p>
                  <p className="mt-0.5 text-sm text-[#64748B]">{role.department}</p>
                </td>
                <td className="py-4 text-sm text-[#475569]">{role.location}</td>
                <td className="py-4 text-sm font-medium text-[#156374]">{role.applicants}</td>
                <td className="py-4 text-sm text-[#475569]">{role.deadline}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${ROLE_STATUS_STYLE[role.status]}`}
                  >
                    {role.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const STAGE_STYLE: Record<ApplicantStage, string> = {
  New: "bg-[#E6F1FB] text-[#1D5E92]",
  Screening: "bg-[#E8EFF1] text-[#0C3640]",
  Interview: "bg-[#FFF4D6] text-[#8A6D1B]",
};

export function RecentApplicants() {
  return (
    <section className="app-card min-w-0 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-clash-display text-xl font-semibold text-[#092A31]">
          Recent applicants
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#156374]"
        >
          View all applicants
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-150 border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EEF2F6] text-xs tracking-wide text-[#94A3B8] uppercase">
              <th className="pb-3 font-medium">Applicant</th>
              <th className="pb-3 font-medium">Applied for</th>
              <th className="pb-3 font-medium">Stage</th>
              <th className="pb-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_APPLICANTS.map((person) => (
              <tr key={person.email} className="border-b border-[#F4F7F8] last:border-b-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#092A31]"
                      style={{ background: person.avatarTone }}
                    >
                      {person.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#092A31]">{person.name}</p>
                      <p className="truncate text-sm text-[#64748B]">{person.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-[#475569]">{person.appliedFor}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${STAGE_STYLE[person.stage]}`}
                  >
                    {person.stage}
                  </span>
                </td>
                <td className="py-4 text-sm text-[#475569]">{person.applied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function UpcomingInterviews() {
  return (
    <section className="app-card flex min-w-0 flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-clash-display text-xl font-semibold text-[#092A31]">
            Upcoming interviews
          </h2>
          <p className="mt-3 text-sm font-medium text-[#092A31]">Today, 14 October</p>
          <p className="mt-0.5 text-sm text-[#64748B]">2 interviews · West Africa Time</p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#156374]"
        >
          Calendar
          <CalendarDays className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {INTERVIEW_DAYS.map((day) => (
          <div
            key={day.day}
            className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-sm ${
              day.active
                ? "border-[#156374] bg-[#156374] font-semibold text-white"
                : "border-[#EEF2F6] text-[#475569]"
            }`}
          >
            <span className="text-xs opacity-80">{day.letter}</span>
            {day.day}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {UPCOMING_INTERVIEWS.map((interview) => (
          <article key={interview.candidate} className="rounded-xl border border-[#EEF2F6] p-4">
            <h3 className="font-clash-display text-lg font-semibold text-[#092A31]">
              {interview.candidate}
            </h3>
            <p className="mt-1 text-sm text-[#475569]">{interview.role}</p>
            <p className="text-sm text-[#64748B]">{interview.kind}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F1F5F6] px-2.5 text-xs text-[#092A31]">
                <CalendarDays className="size-3.5 text-[#156374]" aria-hidden />
                {interview.time}
              </span>
              <span className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F1F5F6] px-2.5 text-xs text-[#475569]">
                <Video className="size-3.5" aria-hidden />
                Video call
              </span>
            </div>

            <button
              type="button"
              className="mt-3 h-11 w-full rounded-xl border border-[#D9E5E8] bg-[#F7FAFA] text-sm font-semibold text-[#156374] transition-colors hover:bg-[#EEF4F5]"
            >
              View interview
            </button>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#FFF8E6] p-4">
        <p className="text-sm font-semibold text-[#092A31]">Keep the conversation moving</p>
        <p className="mt-1 text-sm text-[#5A431B]">
          2 interview scorecards are waiting for feedback from your hiring team.
        </p>
        <button
          type="button"
          className="mt-2 text-sm font-semibold text-[#092A31] underline-offset-2 hover:underline"
        >
          Review scorecards →
        </button>
      </div>
    </section>
  );
}
