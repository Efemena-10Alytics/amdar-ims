import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-[#E8EFF1] py-14 lg:py-20">
      <div className="app-width grid items-start gap-8 lg:grid-cols-2 lg:gap-24 xl:gap-32">
        <div className="rounded-2xl bg-[#156374] p-5 sm:p-6 lg:p-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/images/pngs/lady.png"
              alt="Amdari participant on a video call"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-4 text-sm leading-relaxed text-white sm:p-5 sm:text-[15px]">
              Our program is not a course. It is work experience, with
              expectations, deliverables, teamwork, leadership guidance, and
              results for real clients.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-[#092A31] sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#3D4F55] sm:text-base">
            At Amdari, we know what it&apos;s like to navigate the modern job
            market, it&apos;s complex, competitive, and often overwhelming.
            That&apos;s why we built Amdari, a platform created by professionals
            who&apos;ve walked the same path and understand the real challenges
            of getting hired today. We believe that opportunities should be
            accessible to everyone willing to put in the work.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block text-sm font-medium text-[#156374] underline underline-offset-4"
          >
            See more about us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
