"use client";

type FormativeTaskStatus = "todo" | "external";

type FormativeTask = {
  id: string;
  label: string;
  status: FormativeTaskStatus;
};

const FORMATIVE_DESCRIPTION =
  "Establishes a consistent operational baseline by ensuring alignment in foundational knowledge, tools, and professional working standards.";

const FORMATIVE_TASKS: FormativeTask[] = [
  {
    id: "foundational-videos",
    label: "Foundational Introduction videos",
    status: "todo",
  },
  { id: "how-to-videos", label: "How-To-Videos", status: "todo" },
  {
    id: "guided-walkthroughs",
    label: "Guided Practical Walkthroughs",
    status: "todo",
  },
  {
    id: "assessments",
    label: "Assessments and project submissions",
    status: "todo",
  },
  { id: "games-nights", label: "Games nights", status: "external" },
];

function FormativeTaskBadge({ status }: { status: FormativeTaskStatus }) {
  if (status === "external") {
    return (
      <span className="rounded-full bg-[#EDE4FF] px-2.5 py-0.5 text-xs font-semibold text-[#5B4B8A]">
        Externals
      </span>
    );
  }

  return (
    <span className="rounded-full border border-[#DCE5E9] bg-[#F8FAFC] px-2.5 py-0.5 text-xs font-semibold text-[#94A3B8]">
      Todo
    </span>
  );
}

function FormativeTaskCheckbox() {
  return (
    <span
      className="size-3.5 shrink-0 rounded-sm border border-[#CBD5E1] bg-white"
      aria-hidden
    />
  );
}

const FormativeStage = () => {
  return (
    <div className="border-t border-[#F0D9C4] px-3 pb-4 pt-3 sm:px-4">
      <p className="text-sm leading-relaxed text-[#64748B]">
        {FORMATIVE_DESCRIPTION}
      </p>

      <div className="my-4 border-t border-[#F0D9C4]" aria-hidden />

      <ul className="space-y-3">
        {FORMATIVE_TASKS.map((task) => (
          <li key={task.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <FormativeTaskCheckbox />
              <span className="text-sm font-medium text-[#092A31]">
                {task.label}
              </span>
            </div>
            <FormativeTaskBadge status={task.status} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormativeStage;
