"use client"

import Aos from 'aos'
import { Check } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type SessionBreakdownContent = {
  eyebrow: string
  title: string
  subtitle: string
  points: string[]
  imageSrc: string
  imageAlt: string
}

const defaultBreakdownPoints = [
  "What UK SOC employers actually respect - and why certifications alone keep falling short",
  'What your CV needs to show in order to get shortlisted at the first screening stage',
  'How to get hands-on experience without needing a job offer first',
  'How to speak about your work in interviews with real confidence - not rehearsed answers',
  'Your exact next step from exactly where you are right now',
]

const defaultSessionBreakdownContent: SessionBreakdownContent = {
  eyebrow: '- Session Breakdown',
  title: "What you'll walk away with",
  subtitle: "Five concrete things you'll know by the end of this session.",
  points: defaultBreakdownPoints,
  imageSrc: '/images/pngs/ads/season-breakdown.png',
  imageAlt: 'Professional woman walking confidently outdoors',
}

type SessionBreakdownProps = {
  content?: SessionBreakdownContent
}

const SessionBreakdown = ({ content = defaultSessionBreakdownContent }: SessionBreakdownProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width overflow-hidden pb-14 pt-6 lg:pb-20">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div data-aos="fade-right">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{content.eyebrow}</p>
          <h2 className="mt-2 max-w-160 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">{content.title}</h2>
          <p className="mt-3 text-xl text-[#C6D3D8]">{content.subtitle}</p>

          <div className="mt-6 space-y-3">
            {content.points.map((point, index) => (
              <div
                key={point}
                className="flex min-h-16 items-center gap-3 rounded-xl border border-[#4E6B7470] bg-[#182731AB] px-4 py-3 shadow-[inset_0_0_24px_rgba(41,68,77,0.35)]"
                data-aos="fade-up"
                data-aos-delay={140 + index * 90}
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#395A63] text-[#36D68D]">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium leading-snug text-[#E5ECED] sm:text-base">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[#88A7B029]" data-aos="fade-left" data-aos-delay="120">
          <Image
            src={content.imageSrc}
            alt={content.imageAlt}
            width={680}
            height={860}
            className="h-160 w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default SessionBreakdown
