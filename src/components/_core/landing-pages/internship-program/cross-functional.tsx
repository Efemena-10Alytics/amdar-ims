import Image from "next/image";
import type { InternshipProgram } from "@/types/internship-program";

interface CrossFunctionalProps {
  program?: InternshipProgram;
}

const CrossFunctional = ({ program }: CrossFunctionalProps) => {
  return (
    <div className="app-width py-16">
      <div className="flex flex-col md:flex-row gap-2 md:gap-6">
        <div className="flex-1">
          <h2 className="max-w-104 font-semibold text-3xl text-[#092A31] lg:text-5xl">
            Cross-Functional Experience
          </h2>
        </div>
        <div className="flex-1 text-[#0C3640] text-lg lg:text-2xl">
          Because in real companies, no team works alone At Amdari, you don’t
          work in a silo. You collaborate with:
        </div>
      </div>
      <div className="mt-6 md:mt-10 mx-auto">
        <Image
          src={"/images/svgs/cross-functional.svg"}
          alt="Cross functional teams"
          width={1400}
          height={400}
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default CrossFunctional;
