"use client"

import { ArrowUpRight } from 'lucide-react'
import Aos from 'aos'
import Image from 'next/image'
import React from 'react'
import Flag from './flag'
import HeroBottom from './hero-bottom'

type HeroStat = {
  value: string
  label: string
}

type HeroNAContent = {
  badge: string
  titleBeforeHighlight: string
  titleHighlight: string
  titleAfterHighlight: string
  finalHighlight: string
  descriptionOne: string
  descriptionTwo: string
  ctaText: string
  metaItems: [string, string, string]
  imageSrc: string
  imageAlt: string
  emojiChip: string
  stats: HeroStat[]
}

const defaultHeroStats: HeroStat[] = [
  { value: '39%', label: 'SAY "NO LOCAL EXPERIENCE" IS THEIR BIGGEST BARRIER' },
  { value: '43%', label: 'JOINED AMDARI FOR REAL WORK EXPERIENCE, NOT MORE COURSES' },
  { value: '29%', label: 'ARE IMMIGRANTS OR CAREER SWITCHERS' },
  { value: '90%', label: 'WANT RESULTS WITHIN 1-3 MONTHS' },
]

const defaultHeroContent: HeroNAContent = {
  badge: 'Free - Project Management Job Readiness Workshop',
  titleBeforeHighlight: "You've got the certification. You've applied to dozens of",
  titleHighlight: 'Project Management roles',
  titleAfterHighlight: 'in Canada or the US.',
  finalHighlight: 'Still no callbacks.',
  descriptionOne: "The issue isn't your PMP, PRINCE2, or Agile certification, it's the lack of local (Canada/US) project experience on your CV.",
  descriptionTwo:
    'This free 60-minute workshop shows you how to gain portfolio-ready North American PM experience, position it correctly, and start getting interviews even as an immigrant or career switcher.',
  ctaText: 'Save My Free Spot',
  metaItems: ['100% free', '60 minutes', 'Recording included'],
  imageSrc: '/images/pngs/ads/woman.png',
  imageAlt: 'Professional stressed after repeated job application rejections',
  emojiChip: '🇨🇦🇺🇸',
  stats: defaultHeroStats,
}

type HeroNAExperienceProps = {
  content?: HeroNAContent
  onCtaClick?: () => void
}

const HeroNAExperience = ({ content = defaultHeroContent, onCtaClick }: HeroNAExperienceProps) => {
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
        height={776}
        width={776}
        alt="ellipse"
        src="/images/svgs/ads/na-ellipse.svg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
      />
      <Image
        height={776}
        width={776}
        alt="ellipse"
        src="/images/svgs/ads/na-ellipse.svg"
        className="pointer-events-none absolute left-[18%] top-[64%] -translate-x-1/2 -translate-y-1/2 animate-pulse"
      />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <div data-aos="fade-right">
          <div className="mb-5 inline-flex rounded-full border border-[#FFE08266] bg-[#FFF1C6] px-4 py-2 text-sm font-semibold text-[#564103]">
            {content.badge}
          </div>

          <h1 className="max-w-[16ch] text-[2.4rem] font-black leading-[1.04] tracking-[-0.03em] text-[#FFFCF3] sm:text-[3.1rem] lg:text-[4rem]">
            {content.titleBeforeHighlight}{' '}
            <span className="text-[#FFE082]">{content.titleHighlight}</span> {content.titleAfterHighlight}
            <br />
            <span className="bg-[#2A8BA4] px-2 text-white rounded-lg">{content.finalHighlight}</span>
          </h1>

          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-[#C7D5D6]">
            {content.descriptionOne}
          </p>
          <p className="mt-3 max-w-[66ch] text-base leading-relaxed text-[#C7D5D6]">
            {content.descriptionTwo}
          </p>

        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-[#6D838A66]" data-aos="fade-left" data-aos-delay="120">
          <Image
            src={content.imageSrc}
            alt={content.imageAlt}
            width={720}
            height={760}
            className="h-150 w-full object-cover"
          />
          <div className="absolute bottom-4 right-4 rounded-full bg-[#0E2430CC] px-3 py-1.5 text-lg">{content.emojiChip}</div>
        </div>
      </div>


      <div className="mt-7 flex flex-wrap justify-between items-center gap-6">
        <button
          type="button"
          onClick={onCtaClick}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amdari-yellow px-6 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow"
        >
          {content.ctaText}
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-amdari-yellow transition-colors group-hover:bg-amdari-yellow group-hover:text-primary">
            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </button>

        <p className="flex items-center gap-4 font-medium tracking-[0.01em] text-[#E6EEF0]">
          <span className="text-[#F3C642]">•</span>
          <span>{content.metaItems[0]}</span>
          <span className="text-[#F3C642]">•</span>
          <span>{content.metaItems[1]}</span>
          <span className="text-[#F3C642]">•</span>
          <span>{content.metaItems[2]}</span>
        </p>
        <Flag />
      </div>
      <HeroBottom heroStats={content.stats} />
    </section>
  )
}

export default HeroNAExperience
