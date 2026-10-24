import Image from "next/image";
import type { Project } from "../data";

const Challenges = ({ project }: { project: Project }) => {
  const challenge = project.details?.challenge;
  if (!challenge?.paragraphs?.length) return null;

  const { paragraphs, image, imageAlt, heading = "The Challenge" } = challenge;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="app-width">
        <h2 className="text-3xl font-bold tracking-tight text-[#101820] sm:text-4xl">
          {heading}
        </h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-[#5E6A70] md:text-lg">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="relative mx-auto w-full max-w-3xl">
          <Image
            src={image}
            alt={imageAlt}
            width={911}
            height={512}
            className="mt-10 h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Challenges;
