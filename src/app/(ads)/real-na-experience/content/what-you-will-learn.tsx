"use client"

import Aos from 'aos'
import { Check } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type WhatYouWillLearnProps = {
  eyebrow?: string
  title?: string
  imageSrc?: string
  imageAlt?: string
  points?: string[]
}

const defaultPoints = [
  "Why certifications alone don't get you hired in Canada/US",
  'What "real PM experience" looks like on a North American CV',
  'How to gain project experience without a job first',
  'How to talk about your work in interviews (not just your certifications)',
  'Your exact next step to start getting interviews within weeks',
]

const WhatYouWillLearn = ({
  eyebrow = '- What You Will Learn',
  title = 'Five things that change your position in the market',
  imageSrc = '/images/pngs/ads/woman2.png',
  imageAlt = 'Professional woman reviewing project data in a server corridor',
  points = defaultPoints,
}: WhatYouWillLearnProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="overflow-hidden pb-14 pt-6 lg:pb-20">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="-ml-4 overflow-hidden rounded-[2px] sm:-ml-6 lg:-ml-8" data-aos="fade-right">
          <Image src={"/images/pngs/ads/what-you-will-learn.png"} alt={imageAlt} width={760} height={980} className="h-150 w-full object-cover" />
        </div>

        <div className="app-width w-full" data-aos="fade-left" data-aos-delay="100">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{eyebrow}</p>
            <h2 className="mt-2 max-w-[20ch] text-balance text-3xl md:text-5xl font-semibold leading-tight text-[#F2F7F7] ">{title}</h2>

            <div className="mt-6 space-y-3 rounded-xl bg-[#182731AB] p-4 shadow-[inset_0_0_24px_rgba(41,68,77,0.35)]">
              {points.map((point, index) => (
                <div key={point} className="flex items-start gap-3" data-aos="fade-up" data-aos-delay={160 + index * 80}>
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#395A63] text-[#36D68D]">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium leading-snug text-[#E5ECED] sm:text-base">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatYouWillLearn
