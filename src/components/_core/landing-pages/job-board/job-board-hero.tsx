"use-client"
import Image from "next/image";

const ArrowIcon = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="#FFE082"/>
<path d="M16.5003 8V14.5C16.5003 14.6326 16.4476 14.7598 16.3538 14.8536C16.2601 14.9473 16.1329 15 16.0003 15C15.8677 15 15.7405 14.9473 15.6467 14.8536C15.553 14.7598 15.5003 14.6326 15.5003 14.5V9.20687L8.35403 16.3538C8.26021 16.4476 8.13296 16.5003 8.00028 16.5003C7.8676 16.5003 7.74035 16.4476 7.64653 16.3538C7.55271 16.2599 7.5 16.1327 7.5 16C7.5 15.8673 7.55271 15.7401 7.64653 15.6462L14.7934 8.5H9.50028C9.36767 8.5 9.24049 8.44732 9.14672 8.35355C9.05296 8.25979 9.00028 8.13261 9.00028 8C9.00028 7.86739 9.05296 7.74021 9.14672 7.64645C9.24049 7.55268 9.36767 7.5 9.50028 7.5H16.0003C16.1329 7.5 16.2601 7.55268 16.3538 7.64645C16.4476 7.74021 16.5003 7.86739 16.5003 8Z" fill="#156374"/>
</svg>

);

const FLOATING_USERS = [
  { src: "/user-flag-img-1.png", position: "left-[46%] top-[10%]" },
  { src: "/user-flag-img-2.png", position: "right-[8%] top-[8%]" },
  { src: "/user-flag-img-3.png", position: "left-[38%] bottom-[18%]" },
  { src: "/user-flag-img-4.png", position: "right-[4%] bottom-[6%]" },
];

const COUNTRY_FLAGS = ["/uk-flag.png", "/canada-flag.png", "/us-flag.png"];

const JobBoardHero = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#E8EFF1] bg-cover bg-center bg-no-repeat py-16 lg:py-24"
      style={{ backgroundImage: "url('/job-board-herobg.png')" }}
    >
      <div className="app-width grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left column */}
        <div>
          <h1 className="font-clash-display text-[32px] font-semibold leading-[1.15] text-[#092A31] lg:text-[48px]">
            Find &amp; Apply to Jobs that suits your program
          </h1>

          <div className="mt-8 flex flex-wrap gap-10">
            <div>
              <p className="font-sora text-xl font-semibold text-[#092A31]">
                Jobs in 50+ location
              </p>
              <p className="mt-1 font-sora text-base text-[#64748B]">
                Across the UK and
                <br />
                opportunity across EU
              </p>
            </div>
            <div>
              <p className="font-sora text-xl font-semibold text-[#092A31]">
                50+ companies hiring
              </p>
              <p className="mt-1 font-sora text-base text-[#64748B]">
                Including Fortune 500s,
                <br />
                Start-ups and more
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-10 flex h-14 items-center gap-2 rounded-[40px] bg-[#156374] px-6 font-sora text-lg text-white transition-opacity hover:opacity-90"
          >
            Find your next job
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <ArrowIcon />
            </span>
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {COUNTRY_FLAGS.map((flag) => (
                <Image
                  key={flag}
                  src={flag}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="font-sora text-lg font-normal text-[#A1A8B1]">
              + 30K interns
              <span className="mx-1">·</span>
              Across the world Got hired
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="relative mx-auto h-[280px] w-full max-w-[560px] lg:h-[380px]">
          <Image
            src="/canada-map.png"
            alt="Map of hiring locations"
            fill
            className="object-contain"
            priority
          />
          {FLOATING_USERS.map((user) => (
            <div
              key={user.src}
              className={`absolute h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-md ${user.position}`}
            >
              <Image src={user.src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobBoardHero;


