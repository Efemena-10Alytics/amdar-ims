"use client"

import Aos from 'aos'
import { Clock3 } from 'lucide-react'
import React from 'react'

const timelineItems = [
  {
    range: '00-10 min',
    title: "Why you're being overlooked - and why it's fixable",
    description: 'The specific gap between your profile and what employers are screening for.',
  },
  {
    range: '10-25 min',
    title: 'What UK Data Engineering hiring managers actually trust',
    description: 'The signals they look for and how most candidates accidentally fail them.',
  },
  {
    range: '25-40 min',
    title: 'How to build real experience - starting immediately',
    description: 'The framework for converting your current skills into credible, verifiable work.',
  },
  {
    range: '40-55 min',
    title: 'Turning that experience into interviews',
    description: "How to present what you've built so it lands - on your CV and in any conversation.",
  },
  {
    range: '55-60 min',
    title: 'Live Q&A - your situation, answered directly',
    description: 'No generic advice. Real answers for where you specifically are.',
  },
]

const SessionBreakdownDataEngineer = () => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width overflow-hidden pb-14 pt-6 lg:pb-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-10">
        <div data-aos="fade-right">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">- Session Breakdown</p>
          <h2 className="mt-3 text-balance text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F2F7F7] sm:text-6xl">
            60 Minutes
            <br />
            That Changes
            <br />
            Your Position
            <br />
            in the Market
          </h2>
        </div>

        <div className="relative" data-aos="fade-left" data-aos-delay="120">
          <div className="space-y-5">
            {timelineItems.map((item, index) => (
              <div key={item.range} className="grid gap-3 lg:grid-cols-[6.5rem_1.95rem_1fr] lg:items-start" data-aos="fade-up" data-aos-delay={160 + index * 80}>
                <p className="pt-2 text-sm font-bold text-[#D2BF72]">{item.range}</p>

                <div className="relative flex items-start justify-center">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#557181] bg-[#445F6F] text-[#D2BF72]">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  {index < timelineItems.length - 1 ? (
                    <span className="pointer-events-none absolute left-1/2 top-10 hidden h-[4.1rem] w-px -translate-x-1/2 bg-linear-to-b from-[#3B5966] via-[#2A4853] to-transparent lg:block" />
                  ) : null}
                </div>

                <div className="rounded-xl border border-[#2B444E] bg-[#1E2D34B3] px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                  <h3 className="text-xl font-bold leading-tight text-[#EFF4F5]">{item.title}</h3>
                  <p className="mt-2 text-lg leading-snug text-[#B9C8CD]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SessionBreakdownDataEngineer
