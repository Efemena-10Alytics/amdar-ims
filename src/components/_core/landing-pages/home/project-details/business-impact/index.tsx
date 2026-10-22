import Image from "next/image";

const BusinessImpact = () => {
  return (
    <section className="pb-14 sm:pb-20">
        <div className="relative overflow-hidden bg-[#0C3E48]">
          <Image
            src="/images/pngs/new-home/office-bg.png"
            alt=""
            fill
            className="scale-110 object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0C3E48]/55" />
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-md text-white">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
                Business Impact
              </p>
              <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                Measurable Business
                <br />
                Value
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                The engagement demonstrates the potential of combining AI,
                data-driven decision-making, and operational execution to unlock
                significant business value.
              </p>
            </div>
            <div className="border border-amdari-yellow px-6 py-10 text-center sm:px-10 sm:py-12">
              <p className="text-5xl font-bold tracking-tight text-[#F6D56A] sm:text-6xl">
                $4.5B+
              </p>
              <p className="mt-3 text-sm text-[#F6D56A]/85">
                Reported bottom-line impact
              </p>
            </div>
          </div>
        </div>
    </section>
  );
};

export default BusinessImpact;
