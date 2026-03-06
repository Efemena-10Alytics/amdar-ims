"use client";

type MySpecializationProps = {
  specializations?: string[];
  softSkills?: string[];
};

export function MySpecialization({
  specializations = [],
  softSkills = [],
}: MySpecializationProps) {
  return (
    <section className="mt-10" aria-label="Specialization and skills">
      {/* My Specialization */}
      <h2 className="text-sm font-medium text-zinc-500 mb-4">
        My Specialization
      </h2>
      <ul className="grid max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 list-none">
        {specializations.map((item, index) => (
          <li key={index} className="flex items-center justify-center gap-2">
            <span
              className="shrink-0 size-1.5 rounded-full bg-primary"
              aria-hidden
            />
            <span className="text-sm font-semibold text-[#092A31]">{item}</span>
          </li>
        ))}
      </ul>

      {/* Soft skills */}
      <h3 className="text-2xl font-extrabold text-[#E8EFF1] text-center mt-20 mb-6">
        Soft skills
      </h3>
      <div className="flex flex-wrap max-w-2xl mx-auto gap-4 justify-center">
        {softSkills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-sm font-medium text-[#64748B]"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
