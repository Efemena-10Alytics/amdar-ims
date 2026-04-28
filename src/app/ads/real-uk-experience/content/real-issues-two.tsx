"use client"

import Aos from 'aos'
import React from 'react'

type RealIssuesTwoProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
  leftLabel?: string
  rightLabel?: string
  leftPoints?: string[]
  rightPoints?: string[]
}

const defaultLeftPoints = [
  "You've learned Python, ML, built a few projects",
  "You understand concepts but struggle to position yourself",
  "You're applying but not standing out",
]

const defaultRightPoints = [
  'You have real data science work to talk about',
  'You explain models in business terms - not just code',
  'You show up as someone who can solve problems',
]

const RealIssuesTwo = ({
  eyebrow = '- The Real Issue',
  title = 'Right now vs. after this session',
  subtitle = 'One session. A fundamentally different way the market sees you.',
  leftLabel = 'Right Now',
  rightLabel = 'After This',
  leftPoints = defaultLeftPoints,
  rightPoints = defaultRightPoints,
}: RealIssuesTwoProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width overflow-hidden pb-14 pt-6 lg:pb-20">
      <div data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{eyebrow}</p>
        <h2 className="mt-2 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">{title}</h2>
        <p className="mt-2 text-xl text-[#C6D3D8]">{subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div
          className="rounded-2xl border border-[#00FD931A] border-l-4 border-l-[#EF4444] bg-[#031118D9] p-5 shadow-[0_0_24px_rgba(2,221,188,0.12)] sm:p-6"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <span className="inline-flex rounded-md border border-[#A13E3E] bg-[#3F1E1E] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FF8B8B]">
            {leftLabel}
          </span>

          <ul className="mt-4 space-y-3">
            {leftPoints.map((point, index) => (
              <li key={point} className="flex items-start gap-3 text-xl leading-snug text-[#DDE8EA]" data-aos="fade-right" data-aos-delay={160 + index * 90}>
                <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#F94444]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl border border-[#00FD931A] border-l-4 border-l-[#22C55E] bg-[#031118D9] p-5 shadow-[0_0_24px_rgba(2,221,188,0.12)] sm:p-6"
          data-aos="fade-left"
          data-aos-delay="120"
        >
          <span className="inline-flex rounded-md border border-[#2E7A54] bg-[#103025] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6BDE9A]">
            {rightLabel}
          </span>

          <ul className="mt-4 space-y-3">
            {rightPoints.map((point, index) => (
              <li key={point} className="flex items-start gap-3 text-xl leading-snug text-[#DDE8EA]" data-aos="fade-left" data-aos-delay={180 + index * 90}>
                <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#2ED573]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default RealIssuesTwo
