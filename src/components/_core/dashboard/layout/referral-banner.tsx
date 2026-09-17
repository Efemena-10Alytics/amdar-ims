"use client";

import Link from "next/link";
import { SVGProps } from "react";

export function ReferralBanner() {
  return (
    <div className="relative bg-[#FFE082] py-2 overflow-hidden shrink-0 grid items-center justify-center shadow-sm xl:h-16 pr-4 md:pr-5">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `,
        }}
      />

      {/* Marquee Text Container */}
      <div className="w-full overflow-hidden flex items-center whitespace-nowrap">
        <div className="flex animate-marquee text-[#0F5A62] font-sora text-sm md:text-base">
          {/* We duplicate the text multiple times to create a seamless scroll effect */}
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center px-2">
              Refer a Friend <span className="mx-2">•</span> Earn Up to £50+ Per
              Referral! <span className="mx-2">•</span> Get Cash Payouts Upon
              Enrolment <DividerIcon className="mx-2" />
            </span>
          ))}
        </div>
      </div>

      {/* Absolute Button (floating on top of marquee) */}
      <div className="absolute right-0 sm:right-4 md:right-5 bg-[#FDE047]/50 backdrop-blur-sm rounded-lg">
        <Link
          href="https://wa.me/2348160395002"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center gap-2 bg-[#156374] hover:bg-[#0F4A57] text-white px-3 md:px-5 py-1.5 md:py-2 rounded-md font-medium text-xs xl:text-sm transition-colors font-display shadow-md whitespace-nowrap"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">Start Earning &rarr; </span>
          WhatsApp Us
        </Link>
      </div>
    </div>
  );
}

const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={16}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="url(#b)"
        d="M.318 7.904a7.96 7.96 0 0 0 .963 3.813L.258 15.67l3.822-1.06a6.895 6.895 0 0 0 3.445.928h.003c3.974 0 7.209-3.422 7.21-7.628.001-2.039-.748-3.955-2.11-5.397C11.268 1.07 9.457.276 7.528.275 3.554.275.32 3.697.318 7.904"
      />
      <path
        fill="url(#c)"
        d="M.063 7.902c0 1.392.343 2.752.997 3.95L0 15.947l3.96-1.099c1.09.63 2.318.962 3.568.962h.003c4.117 0 7.467-3.545 7.469-7.902 0-2.111-.775-4.097-2.185-5.59C11.405.823 9.529 0 7.53 0 3.415 0 .064 3.545.063 7.902Zm2.358 3.744-.148-.248a6.835 6.835 0 0 1-.95-3.496c.002-3.621 2.787-6.567 6.21-6.567 1.659 0 3.217.684 4.39 1.926 1.171 1.241 1.816 2.891 1.816 4.647-.002 3.621-2.786 6.568-6.208 6.568H7.53a5.944 5.944 0 0 1-3.16-.916l-.226-.142-2.35.652.628-2.424Z"
      />
      <path
        fill="#fff"
        d="M5.667 4.598c-.14-.329-.287-.336-.42-.341-.11-.005-.234-.005-.358-.005a.67.67 0 0 0-.498.247c-.17.198-.653.676-.653 1.647 0 .972.669 1.911.762 2.043.094.132 1.291 2.19 3.188 2.981 1.576.658 1.897.527 2.24.494.342-.032 1.103-.477 1.259-.938.155-.462.155-.857.109-.94-.047-.082-.171-.131-.358-.23-.187-.099-1.104-.577-1.275-.643-.171-.065-.296-.098-.42.1-.124.197-.482.642-.59.773-.11.133-.218.149-.405.05-.187-.099-.788-.307-1.5-.98-.556-.524-.93-1.17-1.039-1.368-.109-.197-.012-.304.082-.403.084-.088.187-.23.28-.346.093-.115.124-.197.186-.33.063-.13.032-.246-.015-.345-.047-.099-.41-1.076-.575-1.466Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={7.498}
        x2={7.498}
        y1={15.67}
        y2={0.275}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1FAF38" />
        <stop offset={1} stopColor="#60D669" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={7.5}
        x2={7.5}
        y1={15.947}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9F9F9" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h15v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

const DividerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={5}
    height={44}
    fill="none"
    {...props}
  >
    <path stroke="#146374" strokeDasharray="0.8 0.8" d="M2.5 2.023v16" />
    <rect
      width={4.602}
      height={4.374}
      x={-0.199}
      y={0.199}
      stroke="#146374"
      strokeWidth={0.398}
      rx={2.187}
      transform="matrix(-1 0 0 1 4.602 19.613)"
    />
    <circle
      cx={1.591}
      cy={1.591}
      r={1.591}
      fill="#146374"
      transform="matrix(-1 0 0 1 4.203 20.408)"
    />
    <path stroke="#146374" strokeDasharray="0.8 0.8" d="M2.5 25.977v16" />
  </svg>
);
