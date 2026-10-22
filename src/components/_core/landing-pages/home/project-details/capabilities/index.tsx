const PHASES = [
  {
    phase: "Phase 1",
    badge: "Beginning",
    title: "Data & Analytics",
    body: "Turning business data into insight that supports confident decisions.",
    cardClass: "bg-[#E4EEF1]",
    dotClass: "bg-[#156374]",
  },
  {
    phase: "Phase 2",
    badge: "Action",
    title: "AI & Digital Transformation",
    body: "Applying AI and digital capabilities to improve how organizations operate.",
    cardClass: "bg-[#FBF6EE]",
    dotClass: "bg-[#156374]",
  },
  {
    phase: "Phase 3",
    badge: "Learning",
    title: "Operational Excellence",
    body: "Strengthening operational performance and execution.",
    cardClass: "bg-[#E4EEF1]",
    dotClass: "bg-[#C5D0D4]",
  },
  {
    phase: "Phase 4",
    badge: "Experience",
    title: "Project & Programme Management",
    body: "Coordinating complex initiatives from plan through delivery.",
    cardClass: "bg-[#FBF6EE]",
    dotClass: "bg-[#C5D0D4]",
  },
];

const Capabilities = () => {
  return (
    <section id="capabilities" className="bg-[#F4F7F8] py-14 sm:py-20">
      <div className="app-width grid items-start gap-10 lg:grid-cols-[minmax(220px,0.7fr)_1.3fr] lg:gap-16">
        <h2 className="max-w-72 text-3xl leading-tight font-bold tracking-tight text-[#12343C] sm:text-4xl">
          Capabilities Behind the Work
        </h2>

        <ol>
          {PHASES.map((item, index) => (
            <li
              key={item.phase}
              className="relative grid grid-cols-[4.5rem_0.9rem_minmax(0,1fr)] pb-10 last:pb-0"
            >
              {index < PHASES.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute top-2.75 -bottom-2.75 left-[4.95rem] w-0.5 -translate-x-1/2 bg-linear-to-b ${
                    [
                      "from-[#156374] to-[#4E8A96]",
                      "from-[#4E8A96] to-[#A9C4C9]",
                      "from-[#A9C4C9] to-[#D5DEE2]",
                    ][index]
                  }`}
                />
              )}
              <div className="flex h-5.5 items-center justify-end pr-3">
                <span className="text-xs leading-none text-[#8A969C]">
                  {item.phase}
                </span>
              </div>
              <div className="z-10 flex h-5.5 items-center justify-center">
                <span
                  className={`size-2.5 rounded-full ring-4 ring-[#F4F7F8] ${item.dotClass}`}
                />
              </div>
              <div className="pl-6 sm:pl-8">
                <span className="inline-flex h-5.5 items-center rounded-md bg-[#156374] px-2.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                  {item.badge}
                </span>
                <div className={`mt-3 rounded-2xl px-5 py-5 ${item.cardClass}`}>
                  <h3 className="text-lg font-bold text-[#12343C]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#5E6A70]">
                    {item.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Capabilities;
