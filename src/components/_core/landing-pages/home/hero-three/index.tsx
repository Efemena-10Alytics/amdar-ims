"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Aos from "aos";
import { ArrowUpRight, Play, } from "lucide-react";
import LearnMoreVideo from "../learn-more-video";
import ConsultantsDeliver from "./consultants-deliver";
import { NEW_HOME_PARTNER_LOGOS } from "@/constants/company-logos";
import { RocketIcon } from "@/components/_core/dashboard/internship-program/svg";

const HeroThree = () => {
    const [showPopUpVid, setShowPopUpVid] = React.useState(false);

    React.useEffect(() => {
        Aos.init();
    }, []);

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
                    <video
                        src="/images/pngs/new-home/videos/hero-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controls={false}
                        data-aos="zoom-out"
                        data-aos-duration="1400"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_30%] [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                    />
                    <div
                        className="absolute inset-0 backdrop-blur-[4px]"
                        style={{
                            background:
                                "linear-gradient(0deg, rgba(9, 42, 49, 0.5), rgba(9, 42, 49, 0.5)), linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55))",
                        }}
                    />
                </div>

                <div className="relative z-10 px-5 pt-32 pb-16 sm:px-8 sm:pt-36 lg:px-12 lg:pt-40 lg:pb-28">
                    <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
                        <div>
                            <p className="mb-5 inline-flex items-center gap-2 text-sm text-[#F6D56A] sm:text-base">
                                <RocketIcon className="size-6" />
                                Real Work Experience
                            </p>

                            <h1
                                data-aos="fade-right"
                                // data-aos-duration="800"
                                className="hero-slide-right font-display font-clash-display! max-w-3xl text-[1.85rem] leading-[0.95] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.2rem]"
                            >
                                Building
                                <span className="text-[#F6D56A] font-display"> Solutions</span>
                                <br />
                                Shaping Careers <br />
                                <span className="text-[#F6D56A] font-display">Making</span> an <span className="text-[#F6D56A] font-display"> Impact</span>
                            </h1>

                            <p
                                data-aos="fade-up"
                                // data-aos-duration="800"
                                // data-aos-delay="120"
                                className="hero-slide-right mt-6 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg"
                            >
                                Join Amdari Consulting and help businesses move forward. We
                                partner with organisations to solve complex challenges through
                                data, technology and strategic problem-solving.
                            </p>

                            <Link
                                href="/auth/sign-up"
                                className="group mt-8 inline-flex h-13.5 items-center gap-8 rounded-full bg-[#0F4652] px-5 py-6 text-base text-white transition-colors duration-300 hover:bg-amdari-yellow hover:text-primary"
                            >
                                Become Part of the Team
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amdari-yellow text-primary group-hover:bg-primary group-hover:text-white">
                                    <ArrowUpRight className="size-3" />
                                </span>
                            </Link>

                            <div className="relative mt-12 max-w-2xl overflow-hidden lg:mt-16">
                                <div
                                    className="partners-scroll flex w-max"
                                    style={{ animation: "partners-scroll 40s linear infinite" }}
                                >
                                    {[NEW_HOME_PARTNER_LOGOS, NEW_HOME_PARTNER_LOGOS].map((group, groupIndex) => (
                                        <div
                                            key={groupIndex}
                                            className="flex items-center gap-10 pr-10"
                                            aria-hidden={groupIndex === 1}
                                        >
                                            {group.map((partner) => (
                                                <Image
                                                    key={`${partner.alt}-${groupIndex}`}
                                                    src={partner.src}
                                                    alt={groupIndex === 0 ? partner.alt : ""}
                                                    width={120}
                                                    height={36}
                                                    className="h-7 w-auto max-w-28 shrink-0 object-contain sm:h-8"
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <style
                                    dangerouslySetInnerHTML={{
                                        __html: `
                                          @keyframes partners-scroll {
                                            from { transform: translateX(0); }
                                            to { transform: translateX(-50%); }
                                          }
                                          @media (prefers-reduced-motion: reduce) {
                                            .partners-scroll { animation: none !important; }
                                          }
                                          [data-aos="fade-right"].hero-slide-right {
                                            transform: translate3d(-28px, 0, 0);
                                          }
                                        `,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="max-w-sm lg:ml-auto lg:pb-2">
                            <p
                                data-aos="fade-left"
                                className="max-w-xs text-sm leading-relaxed text-white/95 sm:text-base">
                                Become part of a consulting team, contribute to client projects
                                and develop the professional expertise to take on bigger
                                challenges.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowPopUpVid(true)}
                                className="group cursor-pointer mt-5 inline-flex items-center bg-transparent border-2 border-primary gap-3 rounded-full  py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-[#0E4C58] sm:text-base"
                            >
                                Learn more
                                <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#156374]">
                                    <Play className="size-3.5 fill-current" />
                                </span>
                            </button>
                        </div>
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
