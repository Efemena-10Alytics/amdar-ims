import Image from "next/image";
import type { Project } from "../data";

const CARD_STYLES = [
  {
    card: "bg-[#E7F0F1]",
    image: "mt-8 h-auto w-full max-w-md self-end",
  },
  {
    card: "bg-[#F3EDF6]",
    image: "mt-8 h-auto w-[88%] max-w-sm self-end",
  },
];

const Approach = ({ project }: { project: Project }) => {
  const approach = project.details?.approach;
  if (!approach?.featured || !approach.cards?.length) return null;

  const { intro, featured, cards } = approach;

  return (
    <section className="bg-[#F6F7F8] py-12 sm:py-16 lg:py-20">
      <div className="app-width">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#12343C] sm:text-4xl">
            The Approach
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-[#5E6A70] lg:pt-1">
            {intro}
          </p>
        </div>

        <article className="mt-8 grid items-center gap-8 rounded-[28px] bg-[#FBF6EE] p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:p-10">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold tracking-tight text-[#12343C]">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5E6A70] sm:text-base">
              {featured.body}
            </p>
          </div>
          <Image
            src={featured.image}
            alt={featured.imageAlt}
            width={592}
            height={438}
            className="h-auto w-full"
          />
        </article>

        <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`flex flex-col rounded-[28px] p-6 sm:p-8 ${CARD_STYLES[index]?.card ?? "bg-[#E7F0F1]"}`}
            >
              <div className="max-w-sm">
                <h3 className="text-2xl font-bold tracking-tight text-[#12343C]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5E6A70] sm:text-base">
                  {card.body}
                </p>
              </div>
              <Image
                src={card.image}
                alt={card.imageAlt}
                width={574}
                height={240}
                className={CARD_STYLES[index]?.image ?? "mt-8 h-auto w-full"}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
