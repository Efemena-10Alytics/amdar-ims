"use client"

import Aos from 'aos'
import Image from 'next/image'
import React from 'react'

type SocialProofCard = {
  imageSrc: string
  title: string
  subtitle: string
}

type SocialProofProps = {
  heading?: string
  cards?: SocialProofCard[]
}

const defaultCards: SocialProofCard[] = [
  {
    imageSrc: '/images/pngs/ads/proof-1.png',
    title: 'Immigrants',
    subtitle: 'You can break in too',
  },
  {
    imageSrc: '/images/pngs/ads/proof-2.png',
    title: 'Career switchers',
    subtitle: "From no local experience to first offer",
  },
  {
    imageSrc: '/images/pngs/ads/proof-3.png',
    title: 'Job seekers',
    subtitle: 'Applying smarter, getting interviews',
  },
  {
    imageSrc: '/images/pngs/ads/proof-4.png',
    title: 'Professionals',
    subtitle: 'Turn your background into confidence',
  },
]

const SocialProof = ({
  heading = "If you're struggling to land AppSec or Cloud Security roles in Canada or the US",
  cards = defaultCards,
}: SocialProofProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="app-width py-10 lg:py-14 space-y-8">
      <h2 className="max-w-[27ch] md:pb-10 text-4xl font-bold leading-tight text-[#F2F7F7] lg:text-5xl" data-aos="fade-up">
        {heading}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className={`group relative overflow-hidden rounded-xl border border-[#6A869433] ${
              index === 1 ? 'md:-translate-y-6' : index === 2 ? 'md:translate-y-6' : ''
            }`}
            data-aos="fade-up"
            data-aos-delay={120 + index * 90}
          >
            <Image src={card.imageSrc} alt={card.title} width={560} height={760} className="h-100 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#020A0CF2] via-[#020A0CCC] to-transparent" />

            <div className="absolute bottom-3 left-2 right-2 bg-[#092A3180] p-4 rounded-md">
              <p className="text-sm font-semibold text-[#F3F8FA]">{card.title}</p>
              <p className="mt-1 text-xs font-medium text-[#B6C7CD]">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SocialProof
