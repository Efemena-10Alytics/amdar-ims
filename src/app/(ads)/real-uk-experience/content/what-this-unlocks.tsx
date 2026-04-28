"use client"

import Aos from 'aos'
import { Lightbulb, UserRoundCheck, UserRoundSearch } from 'lucide-react'
import React from 'react'

type UnlockItem = {
  number: string
  title: string
  description: string
}

type WhatThisUnlocksContent = {
  eyebrow: string
  title: string
  items: UnlockItem[]
}

const defaultUnlockItems: UnlockItem[] = [
  {
    number: '01',
    title: 'Turn training into real experience',
    description: 'Your existing learning becomes usable, credible work history on your CV.',
  },
  {
    number: '02',
    title: 'Sound like a practitioner',
    description: 'Stop using learner language. Start describing your work with practitioner precision.',
  },
  {
    number: '03',
    title: 'Position yourself as ready',
    description: "Show up as someone who can do the job - not someone still preparing for it.",
  },
]

const iconList = [Lightbulb, UserRoundSearch, UserRoundCheck]

const defaultWhatThisUnlocksContent: WhatThisUnlocksContent = {
  eyebrow: '- What This Changes',
  title: 'What this unlocks',
  items: defaultUnlockItems,
}

type WhatThisUnlocksProps = {
  content?: WhatThisUnlocksContent
}

const WhatThisUnlocks = ({ content = defaultWhatThisUnlocksContent }: WhatThisUnlocksProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width pb-14 pt-4 lg:pb-20">
      <div className="mb-10" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{content.eyebrow}</p>
        <h2 className="mt-2 max-w-300 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-5xl">{content.title}</h2>
      </div>

      <div className="relative pt-12">
        <div className="pointer-events-none absolute inset-x-0 -top-10 z-0 hidden md:grid md:grid-cols-3" data-aos="fade-down">
          {content.items.map((item) => (
            <span key={`bg-${item.number}`} className="text-right text-8xl font-black leading-none text-[#96B4B31C] lg:text-[9rem]">
              {item.number}
            </span>
          ))}
        </div>

        <div className="relative z-10 grid gap-4 md:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = iconList[index % iconList.length]

            return (
              <div
                key={item.number}
                className="rounded-xl border border-[#5D7D8A80] bg-[#111A2A] p-4"
                data-aos="fade-up"
                data-aos-delay={140 + index * 120}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#253141] text-[#F4D56F]">
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <h3 className="mt-3 text-[1.75rem] font-semibold leading-tight text-[#F2D46F]">{item.title}</h3>
                <p className="mt-2 text-lg leading-snug text-[#CDD8DE]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhatThisUnlocks
