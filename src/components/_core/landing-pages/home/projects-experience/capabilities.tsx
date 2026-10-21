import Image from "next/image";

const CAPABILITIES = [
  {
    title: "Artificial Intelligence",
    image: "/images/pngs/capabilities/ai.png",
    label: "above",
  },
  {
    title: "Innovation Strategy & Delivery",
    image: "/images/pngs/capabilities/isd.png",
    label: "below",
  },
  {
    title: "Customer Insight",
    image: "/images/pngs/capabilities/ci.png",
    label: "above",
  },
  {
    title: "Digital Tech Data",
    image: "/images/pngs/capabilities/dt.png",
    label: "below",
  },
  {
    title: "Business Transformation",
    image: "/images/pngs/capabilities/ba.png",
    label: "above",
  },
] as const;

const Capabilities = () => {
  return (
    <section className="pt-10 pb-14 lg:pt-14 lg:pb-20">
      <div className="app-width">
        <h2 className="text-4xl font-semibold text-[#092A31] sm:text-5xl">
          Our capability
        </h2>

        <ul className="mt-8 flex items-start gap-8 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {CAPABILITIES.map((item) => (
            <li
              key={item.title}
              className={`flex w-44 shrink-0 flex-col lg:w-auto ${item.label === "below" ? "mt-28" : ""}`}
            >
              {item.label === "above" ? (
                <p className="mb-3 max-w-[140px] text-sm leading-snug font-semibold text-[#092A31]">
                  {item.title}
                </p>
              ) : null}

              <div className="relative h-[480px] overflow-hidden bg-[#E8EEF0]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 18vw, 176px"
                />
              </div>

              {item.label === "below" ? (
                <p className="mt-3 max-w-[150px] text-sm leading-snug font-semibold text-[#092A31]">
                  {item.title}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Capabilities;
