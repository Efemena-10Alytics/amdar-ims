import Image from 'next/image'
import React from 'react'

const fitCards = [
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

const RightFit = () => {
  return (
    <section className="app-width pb-16 pt-6 lg:pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">- Right Fit</p>
        <h2 className="mt-2 text-balance text-4xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">Who this is for</h2>
        <p className="mt-3 text-xl text-[#C6D3D8]">This session is built for one specific moment in your journey.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {fitCards.map((card) => (
          <div key={card.text} className="rounded-xl bg-[#151B24] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.3)]">
            <div className="overflow-hidden rounded-lg">
              <Image src={card.image} alt={card.text} width={560} height={340} className="h-35 w-full object-cover" />
            </div>
            <p className="mt-2 rounded-lg bg-[#1A788E] px-3 py-2 text-sm font-semibold leading-snug text-[#DDF3F8] sm:text-base">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#09C284] bg-[#00372D] px-4 py-4 text-center text-xl font-semibold text-[#32D987]">
        This is for people ready to step into the role - not just prepare for it.
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <div className="rounded-xl border border-[#4D6370] bg-[#1B2A33] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            <p className="text-4xl font-semibold leading-snug text-[#EAF2F3]">
              You didn&apos;t come this far to stay in <span className="text-[#32D987]">preparation mode.</span>
            </p>
            <p className="mt-4 text-4xl font-semibold leading-snug text-[#EAF2F3]">
              At some point, you have to become the person <span className="text-[#32D987]">companies are looking for.</span>
            </p>
            <p className="mt-4 rounded-md bg-[#75858D] px-3 py-2 text-2xl font-medium text-[#EAF2F3]">This is that shift.</p>
          </div>

          <div className="rounded-xl border border-[#4D6370] bg-[#1B2A33] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            <p className="text-4xl font-semibold leading-snug text-[#FF4A4A]">You don&apos;t need more courses.</p>
            <p className="mt-3 text-2xl font-semibold leading-snug text-[#32D987]">You need:</p>
            <p className="mt-1 text-4xl font-semibold leading-snug text-[#EAF2F3]">Real experience + the ability to prove it.</p>
            <p className="mt-4 rounded-md bg-[#75858D] px-3 py-2 text-2xl font-medium text-[#EAF2F3]">
              That&apos;s what changes how the market sees you.
            </p>
          </div>
        </div>

        <div className="ml-auto w-full max-w-110">
          <Image
            src="/images/pngs/ads/man-in-the-mirror.png"
            alt="Man in suit looking at mirror reflection"
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
