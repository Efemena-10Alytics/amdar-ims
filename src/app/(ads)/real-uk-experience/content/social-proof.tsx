"use client"

import Aos from 'aos'
import { ArrowUpRight, MoreVertical, Play } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { YoutubeSvg } from './svg'

const videoCards = [
  {
    image: '/images/pngs/ads/right-fit-1.png',
    caption: "If I can say I'm confident in my data engineering skills, then I am...",
  },
  {
    image: '/images/pngs/ads/right-fit-2.png',
    caption: 'How to get a job as a Data Engineer in the UK with no UK experience...',
  },
  {
    image: '/images/pngs/ads/right-fit-3.png',
    caption: 'How to get a job as a Data Engineer in the UK with no UK experience...',
  },
]

const SocialProof = () => {
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
        <p className="text-sm font-semibold tracking-wide text-[#B9A56B]">- Social proof</p>
        <h2 className="mt-2 max-w-300 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">
          People Who Were Exactly Where You Are
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {videoCards.map((card, index) => (
          <div
            key={card.caption}
            className="group relative overflow-hidden rounded-xl border border-[#BFCFD533] bg-[#111A1F]"
            data-aos="fade-up"
            data-aos-delay={120 + index * 100}
          >
            <Image src={card.image} alt={card.caption} width={600} height={820} className="h-120 w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#020A0CCC] via-[#020A0C99] to-transparent" />

            <span className="absolute left-3 top-3 text-xl font-black text-[#FF2A2A]">
                <Image src="/images/svgs/ads/youtube.svg" alt="Youtube Logo" width={26} height={28} />
            </span>
            <button
              type="button"
              className="absolute left-1/2 top-1/2 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2B7F95]/85 text-white transition group-hover:scale-105"
            >
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </button>

            <p className="absolute bottom-10 left-3 right-10 text-base font-medium leading-snug text-[#E9F0F0]">{card.caption}</p>
            <span className="absolute bottom-6 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00000077] text-[#C8D3D8]">
              <MoreVertical className="h-4 w-4" />
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-16 rounded-3xl border-l-4 border-l-[#4ADE80] border-[#00D68F80] bg-[#031118E0] p-6 shadow-[0_0_0_1px_rgba(0,214,143,0.18),0_20px_44px_rgba(0,0,0,0.38)] lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8"
        data-aos="zoom-in"
        data-aos-delay="120"
      >
        <div>
          <h3 className="text-balance text-3xl font-black leading-tight text-[#F1D477]">Your Seat Into the Market Starts Here</h3>
          <p className="mt-2 max-w-150 text-2xl font-semibold leading-snug text-[#E9F0F0]">
            For aspiring Data Engineers in the UK who are done being overlooked and ready to become undeniable.
          </p>

          <ul className="mt-5 space-y-2">
            <li className="flex items-start gap-3 text-xl leading-snug text-[#DCE7EA]">
              <span className="mt-2 inline-block h-3 w-3 shrink-0 rounded-full border border-[#2ED573]" />
              <span>Live on Google Meet - 60 minutes + Q&amp;A</span>
            </li>
            <li className="flex items-start gap-3 text-xl leading-snug text-[#DCE7EA]">
              <span className="mt-2 inline-block h-3 w-3 shrink-0 rounded-full border border-[#2ED573]" />
              <span>Completely free to attend</span>
            </li>
            <li className="flex items-start gap-3 text-xl leading-snug text-[#DCE7EA]">
              <span className="mt-2 inline-block h-3 w-3 shrink-0 rounded-full border border-[#2ED573]" />
              <span>Limited to 100 attendees - spots are going fast</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amdari-yellow px-7 py-3 text-2xl font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow lg:mt-0"
        >
          Save My Spot Now
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-amdari-yellow transition-colors group-hover:bg-amdari-yellow group-hover:text-primary">
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>
    </section>
  )
}

export default SocialProof
