import { CORE_VALUES } from "./data";

const CoreValues = () => {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="app-width">
        <h2 className="text-center font-clash-display text-3xl leading-[110%] font-semibold text-[#092A31] sm:text-4xl lg:text-5xl">
          Our
          <br />
          Core Value
        </h2>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          {CORE_VALUES.map(({ title, Icon }) => (
            <div
              key={title}
              className="flex h-30 items-center gap-5 rounded-[20px] bg-[#E8EFF1] p-4"
            >
              <Icon />
              <p className="font-sora text-lg leading-snug font-medium whitespace-pre-line text-[#092A31] sm:text-xl">
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
