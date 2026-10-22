import { Crosshair, Eye, TrendingUp } from "lucide-react";

const HIGHLIGHTS = [
  {
    title: "Productivity Requires More Than Technology",
    body: "Business value depends on connecting technology to real operational priorities.",
    icon: Crosshair,
    iconClass: "bg-[#156374] text-white",
    cardClass: "border-[#E7C96A]",
  },
  {
    title: "Data Strengthens Decision-Making",
    body: "Better use of data can help organisations evaluate opportunities and make more informed decisions.",
    icon: Eye,
    iconClass: "bg-[#F6D56A] text-[#156374]",
    cardClass: "border-[#E6E8EA] bg-[#F7F8F9]",
  },
  {
    title: "Execution Connects Insight to Impact",
    body: "The value of an insight is realised when it translates into meaningful business action.",
    icon: TrendingUp,
    iconClass: "bg-[#156374] text-white",
    cardClass: "border-[#E6E8EA]",
  },
];

const Highlights = () => {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="app-width">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#12343C] sm:text-4xl">
          What This Engagement Highlights
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-0">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`border-l-2 px-6 py-6 sm:px-8 ${item.cardClass}`}
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 max-w-[16rem] text-lg font-bold leading-snug text-[#12343C]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5E6A70]">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
