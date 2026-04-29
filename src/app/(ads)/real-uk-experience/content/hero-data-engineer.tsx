"use client"

import { ArrowDown, ArrowUpRight, } from 'lucide-react'
import Aos from 'aos'
import Image from 'next/image'
import React from 'react'

const pipelineSteps = [
    { title: 'Raw Data', subtitle: 'ingest', isActive: false },
    { title: 'ETL Pipeline', subtitle: 'airflow + dbt', isActive: true },
    { title: 'Warehouse', subtitle: 'snowflake', isActive: true },
    { title: 'Transform', subtitle: 'business logic', isActive: true },
    { title: 'Dashboard', subtitle: 'stakeholder', isActive: false },
]

const heroStats = [
    { value: '39%', label: 'REJECTED FOR ZERO\nUK EXPERIENCE' },
    { value: '43%', label: 'JOB APPLICANTS TO BECOME\nCV SHORTLISTED' },
    { value: '90%', label: 'WANT RESULTS WITHIN 1-3 MONTHS' },
    { value: '1000+', label: 'ATTENDED - MANY NOW WORKING IN\nTECH ROLES' },
]

type HeroDataEngineerProps = {
    onCtaClick?: () => void
}

const HeroDataEngineer = ({ onCtaClick }: HeroDataEngineerProps) => {
    React.useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
        })
    }, [])

    return (
        <section className="relative overflow-hidden app-width py-12 lg:py-16">
            <Image
                height={676}
                width={676}
                alt="ellipse"
                src="/images/svgs/ads/ads-ellipse.svg"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            />
            <Image
                height={676}
                width={676}
                alt="ellipse"
                src="/images/svgs/ads/ads-ellipse.svg"
                className="pointer-events-none absolute -bottom-28 left-0 animate-bounce-6"
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
                <div data-aos="fade-right">
                    <div className="mb-5 inline-flex rounded-full border border-[#FFE08259] bg-[#FFF1C6] px-4 py-2 text-sm font-semibold text-[#564103]">
                        Free - Cloud Data Engineering Transformation Session
                    </div>

                    <h1 className="max-w-[15ch] text-[2.5rem] font-bold leading-[1.04] tracking-[-0.03em] text-[#EEF4F4] sm:text-[3.2rem] lg:text-[4rem]">
                        From <span className="text-[#FFE082]">{"{"}"I've learned it{"}"}</span> to <span className="text-[#2BE798]">{"{"}"I've built it{"}"}</span>
                        <br />
                        Become a Data Engineer UK companies can trust
                    </h1>

                    <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[#D0DEDE]">
                        Right now, you're qualified but not chosen. Not because you don't know Python, SQL, or cloud but because you've never
                        proven you can use them in a real environment that matters.
                    </p>

                    <button
                        type="button"
                        onClick={onCtaClick}
                        className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amdari-yellow px-6 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow"
                    >
                        Save My Spot
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-amdari-yellow transition-colors group-hover:bg-amdari-yellow group-hover:text-primary">
                            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                    </button>

                    <p className="mt-4 text-xl font-semibold tracking-[-0.01em] text-[#E9F0F0]">Free - 60 mins - Built for real job outcomes</p>
                </div>

                <div className="mx-auto w-full max-w-76 pt-2 lg:pt-6" data-aos="fade-left" data-aos-delay="120">
                    <div className="space-y-2">
                        {pipelineSteps.map((step, index) => (
                            <React.Fragment key={step.title}>
                                <div
                                    className={`rounded-xl border px-5 py-4 text-center shadow-[0_8px_22px_rgba(0,0,0,0.25)] ${step.isActive
                                        ? 'border-[#CF6F2E] bg-[#1F2731] text-[#CF6F2E]'
                                        : 'border-[#3D5366] bg-[#2B3A4C] text-[#E6ECEE]'
                                        }`}
                                    data-aos="fade-up"
                                    data-aos-delay={180 + index * 90}
                                >
                                    <p className="text-[1.05rem] font-bold tracking-[0.02em]">{step.title}</p>
                                    <p className={`mt-1 text-xs font-medium tracking-[0.09em] ${step.isActive ? 'text-[#6F8597]' : 'text-[#93A8B7]'}`}>{step.subtitle}</p>
                                </div>

                                {index < pipelineSteps.length - 1 ? (
                                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay={220 + index * 90}>
                                        <ArrowDown size={24} color='#64748B' />
                                    </div>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-10 grid gap-0 overflow-hidden rounded-md border border-[#27606F] bg-[#052B35]/95 md:grid-cols-4" data-aos="fade-up" data-aos-delay="220">
                {heroStats.map((stat, index) => (
                    <div key={stat.value} className={`px-4 py-4 text-center ${index !== 0 ? 'border-t border-[#27606F] md:border-l md:border-t-0' : ''}`}>
                        <p className="text-[2.1rem] font-black leading-none tracking-[-0.02em] text-[#FFD86E]">{stat.value}</p>
                        <p className="mt-2 whitespace-pre-line text-[0.62rem] font-semibold leading-tight tracking-[0.09em] text-[#9FB2BC]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HeroDataEngineer
