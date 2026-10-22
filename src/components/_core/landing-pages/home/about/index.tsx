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
              At Amdari we immerse you in a real-world work environment, where you collaborate on live projects that solve actual business challenges.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-[#092A31] sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#3D4F55] sm:text-base">
            Amdari Consulting brings together  technology professionals across the UK, US, Canada, and beyond to work on  business challenges, contribute to meaningful projects, and deliver practical solutions. Through collaborative consulting teams spanning data, business analysis, project management, cybersecurity, and other technology disciplines, we help organizations move ideas forward while enabling our consultants to build practical experience, demonstrate their capabilities, and progress towards global tech careers.
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
