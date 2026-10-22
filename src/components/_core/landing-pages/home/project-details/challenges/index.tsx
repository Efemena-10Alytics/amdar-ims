import Image from "next/image";

const Challenges = () => {
    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="app-width">
                <h2 className="text-3xl font-bold tracking-tight text-[#101820] sm:text-4xl">
                    The Challenge
                </h2>
                <div className="mt-5 space-y-4 text-base md:text-lg leading-relaxed text-[#5E6A70]">
                    <p>
                        Large technology organisations must continuously improve
                        productivity while managing complex operations, execution demands,
                        and competing business priorities.
                    </p>
                    <p>
                        This engagement focused on reimagining productivity at scale and
                        identifying opportunities to improve operational performance through
                        more effective use of AI and data-driven decision-making.
                    </p>
                </div>
                <div className="relative max-w-3xl mx-auto w-full">
                    <Image
                        src="/images/pngs/new-home/project-1/challenge.png"
                        alt="Project brief on a laptop beside an Amdari mug"
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
