import Image from "next/image";

const Approach = () => {
  return (
    <section className="bg-[#F6F7F8] py-12 sm:py-16 lg:py-20">
      <div className="app-width">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#12343C] sm:text-4xl">
            The Approach
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-[#5E6A70] lg:pt-1">
            AMDARI Consultants worked at the intersection of technology, data,
            and operational execution to support a more effective approach to
            productivity.
          </p>
        </div>

        <article className="mt-8 grid items-center gap-8 rounded-[28px] bg-[#FBF6EE] p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:p-10">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold tracking-tight text-[#12343C]">
              AI-Enabled Decision-Making
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5E6A70] sm:text-base">
              Explore how AI can support more informed business decisions and
              improve the way organizations evaluate opportunities for
              productivity.
            </p>
          </div>
          <Image
            src="/images/pngs/new-home/project-1/ui%20snippet.png"
            alt="Brief is generating"
            width={592}
            height={438}
            className="h-auto w-full"
          />
        </article>

        <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
          <article className="flex flex-col rounded-[28px] bg-[#E7F0F1] p-6 sm:p-8">
            <div className="max-w-sm">
              <h3 className="text-2xl font-bold tracking-tight text-[#12343C]">
                Data-Driven Operations
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5E6A70] sm:text-base">
                Use business data and performance insights to identify
                opportunities to streamline operations and strengthen
                decision-making.
              </p>
            </div>
            <Image
              src="/images/pngs/new-home/project-1/ui%20snippet%20(1).png"
              alt="Reports"
              width={574}
              height={240}
              className="mt-8 h-auto w-full max-w-md self-end"
            />
          </article>

          <article className="flex flex-col rounded-[28px] bg-[#F3EDF6] p-6 sm:p-8">
            <div className="max-w-sm">
              <h3 className="text-2xl font-bold tracking-tight text-[#12343C]">
                Execution and Business Value
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5E6A70] sm:text-base">
                Connect insights to operational priorities and execution, with a
                focus on improving productivity and delivering measurable
                business value.
              </p>
            </div>
            <Image
              src="/images/pngs/new-home/project-1/Window.png"
              alt="APIs window"
              width={492}
              height={240}
              className="mt-8 h-auto w-[88%] max-w-sm self-end"
            />
          </article>
        </div>
      </div>
    </section>
  );
};

export default Approach;
