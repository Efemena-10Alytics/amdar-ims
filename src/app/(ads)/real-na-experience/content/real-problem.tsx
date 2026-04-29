"use client"

import Aos from 'aos'
import React from 'react'

type RealProblemProps = {
  eyebrow?: string
  title?: string
  firstPoint?: string
  secondPointPrefix?: string
  secondPointHighlight?: string
  calloutText?: string
}

const RealProblem = ({
  eyebrow = '- The Real Problem',
  title = "Why you're being filtered out",
  firstPoint = 'You did the certifications. You learned the frameworks. You applied.',
  secondPointPrefix = 'But hiring managers are filtering for one thing:',
  secondPointHighlight = 'proof of real project delivery in a North American context.',
  calloutText = 'No local experience = no interviews. This workshop fixes that.',
}: RealProblemProps) => {
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
        <h2 className="mt-2 text-balance text-4xl font-bold leading-tight text-[#F2F7F7] sm:text-6xl">{title}</h2>
      </div>

      <div
        className="mt-8 rounded-2xl border border-[#00FD931A] border-l-4 border-l-[#EF4444] bg-[#031118D9] p-5 shadow-[0_0_24px_rgba(2,221,188,0.12)] sm:p-6"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-3xl leading-snug text-[#DDE8EA]" data-aos="fade-right" data-aos-delay="170">
            <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#F94444]" />
            <span>{firstPoint}</span>
          </li>
          <li className="flex items-start gap-3 text-3xl leading-snug text-[#DDE8EA]" data-aos="fade-right" data-aos-delay="260">
            <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#F94444]" />
            <span>
              {secondPointPrefix}
              <br />
              <strong className="font-bold text-[#F2F7F7]">{secondPointHighlight}</strong>
            </span>
          </li>
        </ul>

        <p
          className="mt-4 inline-block rounded-md border border-[#A33D3D] bg-[#3F1E1EE0] px-3 py-2 text-3xl font-semibold text-[#FF5555]"
          data-aos="fade-up"
          data-aos-delay="340"
        >
          {calloutText}
        </p>
      </div>
    </section>
  )
}

export default RealProblem
