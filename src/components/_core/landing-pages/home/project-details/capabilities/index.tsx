import type { Project } from "../data";

const PHASE_STYLES = [
  { cardClass: "bg-[#E4EEF1]", dotClass: "bg-[#156374]" },
  { cardClass: "bg-[#FBF6EE]", dotClass: "bg-[#156374]" },
  { cardClass: "bg-[#E4EEF1]", dotClass: "bg-[#C5D0D4]" },
  { cardClass: "bg-[#FBF6EE]", dotClass: "bg-[#C5D0D4]" },
];

const LINE_STYLES = [
  "from-[#156374] to-[#4E8A96]",
  "from-[#4E8A96] to-[#A9C4C9]",
  "from-[#A9C4C9] to-[#D5DEE2]",
];

const Capabilities = ({ project }: { project: Project }) => {
  const phases = project.details?.capabilities;
  const title = project.details?.capabilitiesTitle;
  if (!title || !phases?.length) return null;

  return (
    <section id="capabilities" className="bg-[#F4F7F8] py-14 sm:py-20">
      <div className="app-width grid items-start gap-10 lg:grid-cols-[minmax(220px,0.7fr)_1.3fr] lg:gap-16">
        <h2 className="max-w-72 text-3xl leading-tight font-bold tracking-tight text-[#12343C] sm:text-4xl">
          {title}
        </h2>

        <ol>
          {phases.map((item, index) => {
            const style = PHASE_STYLES[index % PHASE_STYLES.length];
            return (
              <li
                key={item.phase}
                className="relative grid grid-cols-[4.5rem_0.9rem_minmax(0,1fr)] pb-10 last:pb-0"
              >
                {index < phases.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute top-2.75 -bottom-2.75 left-[4.95rem] w-0.5 -translate-x-1/2 bg-linear-to-b ${LINE_STYLES[index] ?? ""}`}
                  />
                )}
                <div className="flex h-5.5 items-center justify-end pr-3">
                  <span className="text-xs leading-none text-[#8A969C]">
                    {item.phase}
                  </span>
                </div>
                <div className="z-10 flex h-5.5 items-center justify-center">
                  <span
                    className={`size-2.5 rounded-full ring-4 ring-[#F4F7F8] ${style.dotClass}`}
                  />
                </div>
                <div className="pl-6 sm:pl-8">
                  <span className="inline-flex h-5.5 items-center rounded-md bg-[#156374] px-2.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                    {item.badge}
                  </span>
                  <div className={`mt-3 rounded-2xl px-5 py-5 ${style.cardClass}`}>
                    <h3 className="text-lg font-bold text-[#12343C]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#5E6A70]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Capabilities;
