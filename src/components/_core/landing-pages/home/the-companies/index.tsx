import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NEW_HOME_PARTNER_LOGOS } from "@/constants/company-logos";

const TheCompanies = () => {
  return (
    <section className="bg-[#FFE082]">
      <div className="app-width flex flex-col gap-8 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-10">
        <div className="shrink-0">
          <h2 className="max-w-[320px] text-xl leading-tight font-semibold text-[#092A31] sm:text-2xl">
            Companies that have hired our consultant
          </h2>
          <Link
            href="#become-a-partner"
            className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#156374] py-2 pr-2 pl-5 text-sm font-semibold text-white"
          >
            Join the team
            <span className="flex size-7 items-center justify-center rounded-full bg-[#F6D56A] text-[#156374]">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="hired-companies-scroll flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-3 pr-3">
                {NEW_HOME_PARTNER_LOGOS.map((company) => (
                  <li
                    key={`${company.src}-${copy}`}
                    className="flex size-20 shrink-0 items-center justify-center rounded-md bg-[#E8CC76] p-3 sm:size-24"
                  >
                    <Image
                      src={company.src}
                      alt={copy === 0 ? company.alt : ""}
                      width={96}
                      height={56}
                      className="max-h-12 w-auto max-w-full object-contain"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-[#F8E59A] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-[#F8E59A] to-transparent"
            aria-hidden
          />
          <style>{`
            .hired-companies-scroll {
              animation: hired-companies-scroll 45s linear infinite;
            }
            @keyframes hired-companies-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hired-companies-scroll { animation: none; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default TheCompanies;
