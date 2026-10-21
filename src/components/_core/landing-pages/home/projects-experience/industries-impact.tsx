import Image from "next/image";

const INDUSTRIES = [
  "Manufacturing",
  "Technology",
  "Telecommunication",
  "Fintech",
  "Healthcare",
  "Education",
] as const;

const IndustriesImpact = () => {
  return (
    <section className="pt-10 pb-14 lg:pt-14 lg:pb-20">
      <div className="app-width grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-md lg:pt-6">
          <h2 className="text-4xl leading-tight font-semibold text-[#092A31] sm:text-5xl">
            Industries we
            <br />
            serve
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B] sm:text-base">
            Our consultants have gone on to work with leading companies across
            tech, finance, care, and beyond, proof that the right experience
            opens the right doors.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {INDUSTRIES.map((industry) => (
            <li
              key={industry}
              className="relative flex min-h-16 items-center justify-center rounded-xl bg-[#F3F6F8] px-6 py-5 text-center text-lg font-semibold text-[#092A31] sm:text-xl"
            >
              {industry}
              {industry === "Technology" ? (
                <span className="absolute top-1/2 left-1/2 size-11 -translate-x-2 translate-y-1 overflow-hidden rounded-full border-[3px] border-[#3B82F6] bg-white shadow-md">
                  <Image
                    src="/images/pngs/about/adeiza.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IndustriesImpact;
