import Image from "next/image";

const INDUSTRIES = [
  "Manufacturing",
  "Technology",
  "Telecommunication",
  "Fintech",
  "Healthcare",
  "Education",
  "E-commerce",
] as const;

const IndustriesImpact = () => {
  return (
    <section className="py-10 lg:py-14">
      <div className="app-width">
        <div className="relative overflow-hidden rounded-[28px]">
          <Image
            src="/images/pngs/new-home/industries.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="relative px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
            <div className="grid gap-8 rounded-[24px] bg-black/45 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:p-10">
              <div className="max-w-md text-white">
                <h2 className="text-4xl leading-tight font-semibold sm:text-5xl">
                  Industries we
                  <br />
                  serve
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                  Our consultants have gone on to work with leading companies
                  across tech, finance, care, and beyond, proof that the right
                  experience opens the right doors.
                </p>
              </div>

              <div className="relative h-92 overflow-hidden">
                <div className="industries-scroll flex flex-col">
                  {[0, 1].map((copy) => (
                    <ul key={copy} className="flex shrink-0 flex-col gap-3 pb-3">
                      {INDUSTRIES.map((industry) => (
                        <li
                          key={`${industry}-${copy}`}
                          className="flex min-h-14 items-center font-display justify-center bg-[#F6E7C1] px-6 py-4 text-center text-base font-semibold text-[#5C4A2A] sm:text-3xl"
                        >
                          {industry}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <style>{`
                  .industries-scroll {
                    animation: industries-scroll 16s linear infinite;
                  }
                  @keyframes industries-scroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .industries-scroll { animation: none; }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesImpact;
