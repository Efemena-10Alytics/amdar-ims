"use client"

import { CircleUserRound, FileText, MessageCircleMore, UsersRound } from 'lucide-react'
import Aos from 'aos'
import Image from 'next/image'
import React from 'react'

const outcomeIcons = [FileText, MessageCircleMore, CircleUserRound, UsersRound]

type YourOutcomeContent = {
  eyebrow: string
  title: string
  imageSrc: string
  imageAlt: string
  outcomes: string[]
}

const defaultYourOutcomeContent: YourOutcomeContent = {
  eyebrow: '- Your Outcome',
  title: 'This is who you become',
  imageSrc: '/images/pngs/ads/your-outcome.png',
  imageAlt: 'Successful cybersecurity learner showcasing practical outcomes',
  outcomes: [
    'Someone with real SOC work on your CV',
    'Someone who can explain what they have done - not what they have learned',
    'Someone who walks into interviews with proof, not pressure',
    "Someone recruiters don't ignore",
  ],
}

type YourOutcomeProps = {
  content?: YourOutcomeContent
}

const YourOutcome = ({ content = defaultYourOutcomeContent }: YourOutcomeProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="relative overflow-hidden">
      <Image
        height={676}
        width={676}
        alt="ellipse"
        src="/images/svgs/ads/ads-ellipse.svg"
        className="pointer-events-none absolute -top-48 -left-2-"
      />
      <div className="app-width py-8 lg:py-12">
        <div className="mb-5" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{content.eyebrow}</p>
          <h2 className="mt-2 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-5xl">{content.title}</h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#051720]" data-aos="zoom-in" data-aos-delay="100">
          <Image
            src={content.imageSrc}
            alt={content.imageAlt}
            width={1200}
            height={760}
            className="min-h-130 w-full object-cover object-left"
          />

          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-linear-to-r from-transparent via-[#07172233] to-[#0E2A35CC] lg:w-[48%]" />

          <div className="absolute right-4 top-[36%] z-10 flex w-[calc(100%-2rem)] max-w-120 -translate-y-1/2 flex-col gap-3 sm:right-8">
            {content.outcomes.map((outcomeText, index) => {
              const Icon = outcomeIcons[index % outcomeIcons.length]

              return (
                <div
                  key={outcomeText}
                  className="flex min-h-20 items-center gap-3 rounded-2xl border border-[#87A7B233] bg-[#0D1F2BA3] px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md"
                  data-aos="fade-left"
                  data-aos-delay={150 + index * 100}
                >
                  <Icon className="h-5 w-5 shrink-0 text-[#30DC8F]" />
                  <p className="text-base font-semibold leading-snug text-[#ECF4F4]">{outcomeText}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default YourOutcome
