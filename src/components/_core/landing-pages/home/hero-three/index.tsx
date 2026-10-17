"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowUpRight, Check, Play } from "lucide-react";
import LearnMoreVideo from "../learn-more-video";
import ConsultantsDeliver from "./consultants-deliver";

const PARTNERS = [
    { src: "/images/svgs/companies/age-uk.svg", alt: "Age UK" },
    { src: "/images/svgs/companies/hsbc.svg", alt: "HSBC" },
    { src: "/images/svgs/companies/mcc.svg", alt: "Manchester City Council" },
    { src: "/images/svgs/companies/ukri.svg", alt: "UK Research and Innovation" },
    { src: "/images/svgs/companies/croydon.svg", alt: "Croydon Council" },
];

const HeroThree = () => {
    const [showPopUpVid, setShowPopUpVid] = React.useState(false);

    return (
        <section
            id="home-hero-section"
            className="relative -mt-30 bg-[#187F8C] px-2.5 pt-1 pb-10 sm:px-3.5 lg:-mt-35  lg:px-4 lg:pb-14"
        >
            <div className="relative overflow-hidden rounded-[28px] lg:rounded-[40px]">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent), linear-gradient(to bottom, transparent, #000 16px, #000 100%)",
                        maskImage:
                            "linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent), linear-gradient(to bottom, transparent, #000 16px, #000 100%)",
                        WebkitMaskComposite: "source-in",
                        maskComposite: "intersect",
                    }}
                    aria-hidden
                >
                    <Image
                        src="/images/pngs/hero-three/office-bg.png"
                        alt=""
                        fill
                        priority
                        className="object-cover object-[center_30%]"
                        sizes="100vw"
                    />
                    <div
                        className="absolute inset-0 backdrop-blur-[3px]"
                        style={{
                            background:
                                "linear-gradient(0deg, rgba(9, 42, 49, 0.5), rgba(9, 42, 49, 0.5)), linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55))",
                        }}
                    />
                </div>

                <div className="relative z-10 px-5 pt-32 pb-16 sm:px-8 sm:pt-36 lg:px-12 lg:pt-40 lg:pb-28">
                    <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
                        <div>
                            <p className="mb-5 inline-flex items-center gap-2 text-sm text-white/90 sm:text-base">
                                <span className="flex size-4 items-center justify-center rounded-full bg-[#3DDC97] text-[#0B3C46]">
                                    <Check className="size-2.5" strokeWidth={3} />
                                </span>
                                Real Work Experience
                            </p>

                            <h1 className="max-w-3xl text-[1.85rem] leading-[0.95] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.2rem]">
                                <span className="inline-flex flex-wrap items-center gap-x-[0.12em] gap-y-1">
                                    Where <span className="text-[#F6D56A]">Emerging Tech</span>
                                </span>
                                <br />
                                <span className="text-[#F6D56A]">Professionals</span> Make
                                <br />
                                Their Mark
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                                Join Amdari Consulting and help businesses move forward. We
                                partner with organisations to solve complex challenges through
                                data, technology and strategic problem-solving.
                            </p>

                            <Link
                                href="/auth/sign-up"
                                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#0E4C58] py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-[#0B3C46] sm:text-base"
                            >
                                Become Part of the Team
                                <span className="flex size-8 items-center justify-center rounded-full bg-[#F6D56A] text-[#0E4C58] transition-transform group-hover:translate-x-0.5">
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </Link>
                        </div>

                        <div className="max-w-sm lg:ml-auto lg:pb-2">
                            <span className="mb-3 inline-flex size-11 items-center justify-center">
                                <svg
                                    viewBox="0 0 48 48"
                                    className="size-11"
                                    aria-hidden
                                >
                                    <path
                                        d="M24 2C15.2 2 8 9.1 8 17.8 8 29.2 24 46 24 46s16-16.8 16-28.2C40 9.1 32.8 2 24 2z"
                                        fill="#2F7BFF"
                                    />
                                    <circle cx="24" cy="18" r="10" fill="#2F7BFF" />
                                    <text
                                        x="24"
                                        y="23"
                                        textAnchor="middle"
                                        fontSize="14"
                                        fontWeight="700"
                                        fill="white"
                                        fontFamily="inherit"
                                    >
                                        E
                                    </text>
                                </svg>
                            </span>
                            <p className="max-w-xs text-sm leading-relaxed text-white/95 sm:text-base">
                                Become part of a consulting team, contribute to client projects
                                and develop the professional expertise to take on bigger
                                challenges.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowPopUpVid(true)}
                                className="group mt-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-[#123F4A]/80 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-[#0E4C58] sm:text-base"
                            >
                                Learn more
                                <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#156374]">
                                    <Play className="size-3.5 fill-current" />
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-16">
                        {PARTNERS.map((partner) => (
                            <Image
                                key={partner.alt}
                                src={partner.src}
                                alt={partner.alt}
                                width={120}
                                height={36}
                                className="h-7 w-auto max-w-28 object-contain brightness-0 invert sm:h-8"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ConsultantsDeliver />

            <LearnMoreVideo
                showPopUpVid={showPopUpVid}
                setShowPopUpVid={setShowPopUpVid}
            />
        </section>
    );
};

export default HeroThree;
