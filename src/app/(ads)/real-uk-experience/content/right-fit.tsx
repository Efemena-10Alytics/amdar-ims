"use client"

import Aos from 'aos'
import Image from 'next/image'
import React from 'react'

type FitCard = {
  image: string
  text: string
}

type StatementBlock = {
  lines: Array<{
    text: string
    color?: string
  }>
  chipText: string
}

type RightFitContent = {
  eyebrow: string
  title: string
  subtitle: string
  cards: FitCard[]
  highlightText: string
  firstStatement: StatementBlock
  secondStatement: StatementBlock
  mirrorImageSrc: string
  mirrorImageAlt: string
}

const defaultFitCards: FitCard[] = [
  {
    image: '/images/pngs/ads/right-fit-1.png',
    text: "You've done cybersecurity training but don't feel \"hireable\" yet",
  },
  {
    image: '/images/pngs/ads/right-fit-2.png',
    text: "You're applying to roles but not getting callbacks or interviews",
  },
  {
    image: '/images/pngs/ads/right-fit-3.png',
    text: "You're ready to step into the role - not just keep preparing for it",
  },
]

const defaultRightFitContent: RightFitContent = {
  eyebrow: '- Right Fit',
  title: 'Who this is for',
  subtitle: 'This session is built for one specific moment in your journey.',
  cards: defaultFitCards,
  highlightText: 'This is for people ready to step into the role - not just prepare for it.',
  firstStatement: {
    lines: [
      { text: "You didn't come this far to stay in " },
      { text: 'preparation mode.', color: 'text-[#32D987]' },
      { text: 'At some point, you have to become the person ' },
      { text: 'companies are looking for.', color: 'text-[#32D987]' },
    ],
    chipText: 'This is that shift.',
  },
  secondStatement: {
    lines: [
      { text: "You don't need more courses.", color: 'text-[#FF4A4A]' },
      { text: 'You need:', color: 'text-[#32D987]' },
      { text: 'Real experience + the ability to prove it.' },
    ],
    chipText: "That's what changes how the market sees you.",
  },
  mirrorImageSrc: '/images/pngs/ads/man-in-the-mirror.png',
  mirrorImageAlt: 'Man in suit looking at mirror reflection',
}

type RightFitProps = {
  content?: RightFitContent
}

const RightFit = ({ content = defaultRightFitContent }: RightFitProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width overflow-hidden pb-16 pt-6 lg:pb-24">
      <div data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">{content.eyebrow}</p>
        <h2 className="mt-2 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">{content.title}</h2>
        <p className="mt-3 text-xl text-[#C6D3D8]">{content.subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {content.cards.map((card, index) => (
          <div
            key={card.text}
            className="rounded-xl bg-[#151B24] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.3)]"
            data-aos="fade-up"
            data-aos-delay={120 + index * 100}
          >
            <div className="overflow-hidden rounded-lg">
              <Image src={card.image} alt={card.text} width={560} height={340} className="h-35 w-full object-cover" />
            </div>
            <p className="mt-2 rounded-lg bg-[#1A788E] px-3 py-2 text-sm font-semibold leading-snug text-[#DDF3F8] sm:text-base">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-xl border border-[#09C284] bg-[#00372D] px-4 py-4 text-center text-xl font-semibold text-[#32D987]"
        data-aos="zoom-in"
        data-aos-delay="140"
      >
        {content.highlightText}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end overflow-hidden">
        <div className="space-y-6">
          <div
            className="rounded-xl border border-[#4D6370] bg-white/10 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
            data-aos="fade-right"
            data-aos-delay="160"
          >
            <p className="text-2xl font-semibold leading-snug text-[#EAF2F3]">
              {content.firstStatement.lines[0]?.text}
              {content.firstStatement.lines[1] ? <span className={content.firstStatement.lines[1].color ?? ''}>{content.firstStatement.lines[1].text}</span> : null}
            </p>
            <p className="mt-4 text-2xl font-semibold leading-snug text-[#EAF2F3]">
              {content.firstStatement.lines[2]?.text}
              {content.firstStatement.lines[3] ? <span className={content.firstStatement.lines[3].color ?? ''}>{content.firstStatement.lines[3].text}</span> : null}
            </p>
            <p className="mt-4 rounded-md bg-[#75858D] px-3 py-2 text-2xl font-medium text-[#EAF2F3]">{content.firstStatement.chipText}</p>
          </div>

          <div
            className="rounded-xl border border-[#4D6370] bg-[#1B2A33] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
            data-aos="fade-right"
            data-aos-delay="240"
          >
            <p className={`text-2xl font-semibold leading-snug ${content.secondStatement.lines[0]?.color ?? 'text-[#EAF2F3]'}`}>
              {content.secondStatement.lines[0]?.text}
            </p>
            <p className={`mt-3 text-2xl font-semibold leading-snug ${content.secondStatement.lines[1]?.color ?? 'text-[#EAF2F3]'}`}>
              {content.secondStatement.lines[1]?.text}
            </p>
            <p className={`mt-1 text-2xl font-semibold leading-snug ${content.secondStatement.lines[2]?.color ?? 'text-[#EAF2F3]'}`}>
              {content.secondStatement.lines[2]?.text}
            </p>
            <p className="mt-4 rounded-md bg-[#75858D] px-3 py-2 text-2xl font-medium text-[#EAF2F3]">
              {content.secondStatement.chipText}
            </p>
          </div>
        </div>

        <div className="ml-auto w-full max-w-120 lg:max-w-136 lg:-mb-24" data-aos="fade-left" data-aos-delay="180">
          <Image
            src={content.mirrorImageSrc}
            alt={content.mirrorImageAlt}
            width={800}
            height={1100}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default RightFit
