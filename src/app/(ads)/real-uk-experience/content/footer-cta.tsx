"use client"

import Aos from 'aos'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'

type FooterCtaContent = {
  title: string
  description: string
  buttonText: string
  metaText: string
}

const defaultFooterCtaContent: FooterCtaContent = {
  title: "Right now, you're close - but not quite there.",
  description:
    'This session shows you how to cross that gap and start showing up as someone who can actually be hired. One 60-minute session. Real, practical next steps. No fluff.',
  buttonText: 'Save My Spot Now',
  metaText: 'Limited seats | Free | Built for results',
}

type FooterCtaProps = {
  content?: FooterCtaContent
  onCtaClick?: () => void
}

const FooterCta = ({ content = defaultFooterCtaContent, onCtaClick }: FooterCtaProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <footer>
      <div className="p-5 bg-[#0C3640]" />
      <div className="relative overflow-hidden bg-[#092A31] px-4 py-14 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url("/images/pngs/ads/ads-noise.png")' }}
        />
        {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-[#07242C] to-transparent" /> */}

        <div
          className="relative mx-auto max-w-4xl rounded-3xl border border-[#3C6671] bg-[linear-gradient(180deg,#12313B_0%,#0F2730_100%)] px-6 py-9 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-24px_40px_rgba(0,0,0,0.28),0_10px_20px_rgba(0,0,0,0.16)] sm:px-10"
          data-aos="zoom-in"
        >
          <h2 className="mx-auto max-w-3xl text-balance text-2xl font-black leading-tight text-[#DDE6E8] sm:text-5xl" data-aos="fade-up">
            {content.title}
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-[#AFC0C6] sm:text-2xl" data-aos="fade-up" data-aos-delay="100">
            {content.description}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#F1D779] px-8 py-3 text-lg font-semibold text-[#17363F] transition hover:bg-[#F6E39A]"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            {content.buttonText}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1A6878] text-[#F6E39A]">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </button>

          <p className="mt-6 text-lg font-semibold text-[#A7B8BE] sm:text-2xl" data-aos="fade-up" data-aos-delay="240">
            {content.metaText}
          </p>
        </div>
      </div>
      <div className="p-5 bg-[#0C3640]" />
    </footer>
  )
}

export default FooterCta
