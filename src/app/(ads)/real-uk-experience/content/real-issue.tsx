"use client"

import Aos from 'aos'
import React from 'react'

const issuePoints = [
  'Most people stay stuck because they keep trying to improve their knowledge.',
  "But in the UK market, knowledge doesn't get you hired. Evidence does.",
  "You can have every certification on the list and still get no callbacks - because what employers are screening for isn't what you know, it's what you've done.",
]

const RealIssue = () => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width overflow-hidden pb-14 pt-6 lg:pb-20">
      <div className="mb-5" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">- The Real Issue</p>
        <h2 className="mt-2 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-5xl">
          Why You Can&apos;t Get a Job
        </h2>
      </div>

      <div
        className="rounded-2xl border-l-4 border-l-[#EF4444] border border-[#00FD931A] bg-[#031118D9] p-5 shadow-[0_0_24px_rgba(2,221,188,0.12)] sm:p-6"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <ul className="space-y-3">
          {issuePoints.map((point, index) => (
            <li
              key={point}
              className="flex items-start gap-3 text-xl leading-snug text-[#DDE8EA]"
              data-aos="fade-right"
              data-aos-delay={180 + index * 100}
            >
              <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#F94444]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xl leading-snug text-[#DDE8EA]" data-aos="fade-up" data-aos-delay="480">
          This session shows you how to build that evidence - properly.
        </p>
      </div>
    </section>
  )
}

export default RealIssue
