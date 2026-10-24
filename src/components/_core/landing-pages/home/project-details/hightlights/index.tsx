import { Crosshair, Eye, TrendingUp } from "lucide-react";
import type { Project } from "../data";

const HIGHLIGHT_STYLES = [
  {
    icon: Crosshair,
    iconClass: "bg-[#156374] text-white",
    cardClass: "border-[#E7C96A]",
  },
  {
    icon: Eye,
    iconClass: "bg-[#F6D56A] text-[#156374]",
    cardClass: "border-[#E6E8EA] bg-[#F7F8F9]",
  },
  {
    icon: TrendingUp,
    iconClass: "bg-[#156374] text-white",
    cardClass: "border-[#E6E8EA]",
  },
];

const Highlights = ({ project }: { project: Project }) => {
  const items = project.details?.highlights;
  const title = project.details?.highlightsTitle;
  if (!title || !items?.length) return null;

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="app-width">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#12343C] sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-0">
          {items.map((item, index) => {
            const style = HIGHLIGHT_STYLES[index % HIGHLIGHT_STYLES.length];
            const Icon = style.icon;
            return (
              <article
                key={item.title}
                className={`border-l-2 px-6 py-6 sm:px-8 ${style.cardClass}`}
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-xl ${style.iconClass}`}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 max-w-[16rem] text-lg leading-snug font-bold text-[#12343C]">
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
