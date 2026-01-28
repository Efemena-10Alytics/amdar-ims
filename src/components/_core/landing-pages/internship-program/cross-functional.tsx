import Image from "next/image";

const CrossFunctional = () => {
  return (
    <div className="max-w-325 mx-auto py-16 px-4 sm:px-6 lg:px-8">
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
      <div className="mt-6 md:mt-10">
        <Image
          src={"/images/svgs/cross-functional.svg"}
          alt="Cross functional teams"
          width={1200}
          height={400}
        />
      </div>
    </div>
  );
};

export default CrossFunctional;
