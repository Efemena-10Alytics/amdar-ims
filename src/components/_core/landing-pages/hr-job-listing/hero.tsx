import Image from "next/image";
import Link from "next/link";
import { GoogleMark, HeroArrowDown, ReviewsPill } from "./svg";

/**
 * The Figma hero sits on an illustrated background that has not been supplied
 * yet, so the section stays plain white until it arrives.
 */
const HrJobListingHero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="app-width grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 lg:py-16">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ReviewsPill />
            <GoogleMark />
          </div>

          {/* "Join" and "Together" are Clash Display black; the rest is Sora grey. */}
          <h1 className="mt-8 font-sora text-[2.6rem] leading-[0.85] font-medium tracking-[-0.05em] text-[#999999] sm:text-6xl lg:text-[5.25rem] xl:text-[95.1px]">
            <span className="font-clash-display tracking-[-0.02em] text-black">Join</span>{" "}
            <Image
              src="/images/pngs/teams/teams1.png"
              alt=""
              width={160}
              height={72}
              className="mx-1 inline-block h-[0.62em] w-[1.35em] rounded-full object-cover align-middle"
              aria-hidden
            />{" "}
            our team
            <br />
            and Build the Future
            <br />
            <span className="font-clash-display tracking-[-0.02em] text-black">Together</span>
          </h1>

          <p className="mt-7 max-w-xl font-sora text-base leading-[162%] text-black sm:text-lg lg:text-[22px]">
            Join a team focused on data, innovation, and real-world impact. Grow your career with
            industry leaders.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="#job-openings"
              className="inline-flex h-14 items-center rounded-xl bg-[#156374] px-7 font-sora text-base font-medium text-white transition-colors hover:bg-[#0f4d5a]"
            >
              View Open Roles
            </Link>
            <Link
              href="#job-openings"
              aria-label="Scroll to open roles"
              className="transition-transform hover:translate-y-0.5"
            >
              <HeroArrowDown />
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <Image
            src="/hr-job-img1.png"
            alt="An Amdari team member holding a laptop"
            width={720}
            height={640}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HrJobListingHero;
