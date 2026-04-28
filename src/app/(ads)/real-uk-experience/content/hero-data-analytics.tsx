"use client"

import { ArrowUpRight } from 'lucide-react'
import Aos from 'aos'
import Image from 'next/image'
import React from 'react'

const analyticsHighlights = [
  { label: 'TOTAL REVENUE', value: '£2.47M', change: '+12.4%', valueColor: 'text-[#F4F8F8]', changeColor: 'text-[#2BE798]' },
  { label: 'CONVERSION RATE', value: '18.3%', change: '+2.1pp', valueColor: 'text-[#F4F8F8]', changeColor: 'text-[#2BE798]' },
  { label: 'CHURN RISK ALERTS', value: '47', change: '18', valueColor: 'text-[#4A98FF]', changeColor: 'text-[#2BE798]' },
]

const analyticsKpis = [
  { label: 'Avg deal size', value: '£52.4k' },
  { label: 'CAC', value: '£1,240' },
  { label: 'LTV:CAC', value: '4.2x' },
  { label: 'Win rate', value: '61%' },
  { label: 'Data quality', value: '97.3%' },
]

const HeroDataAnalytics = () => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="relative overflow-hidden app-width py-12 lg:py-16">
      <Image
        height={676}
        width={676}
        alt="ellipse"
        src="/images/svgs/ads/ads-ellipse.svg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
      />
      <Image
        height={676}
        width={676}
        alt="ellipse"
        src="/images/svgs/ads/ads-ellipse.svg"
        className="pointer-events-none absolute -bottom-28 left-0 animate-bounce-6"
      />
      <div className="relative z-10 mx-auto grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div data-aos="fade-right">
          <div className="mb-6 inline-flex rounded-full border border-[#FFE0824A] bg-[#FFF1C8] px-4 py-2 text-sm font-bold text-[#564103]">
            Amdari - Free Data Analytics Job Readiness Workshop
          </div>

          <h1 className="max-w-[16ch] text-[2.6rem] font-black leading-[1.06] tracking-[-0.03em] text-[#EEF4F4] sm:text-[3.2rem] lg:text-[4.25rem]">
            Become a <span className="text-[#FFE082]">Data Analyst with real UK experience</span> not just course projects.
          </h1>

          <p className="mt-6 max-w-[57ch] text-lg leading-relaxed text-[#D0DEDE]">
            This session shows you how to build the kind of experience that makes UK employers take you seriously even if you've
            never worked as a Data Analyst before.
          </p>

          <button
            type="button"
            className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amdari-yellow px-6 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow"
          >
            Save My Spot
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-amdari-yellow transition-colors group-hover:bg-amdari-yellow group-hover:text-primary">
              <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </button>

          <p className="mt-4 text-[1.75rem] font-semibold tracking-[-0.01em] text-[#E9F0F0]">Free - 60 mins - No fluff</p>
        </div>

        <div
          className="rounded-[22px] border border-[#00D68F73] bg-[#02131A]/90 shadow-[0_0_0_1px_rgba(0,214,143,0.22),0_24px_48px_rgba(0,0,0,0.45)]"
          data-aos="fade-left"
          data-aos-delay="120"
        >
          <div className="flex items-center gap-3 border-b border-[#0E3D4D] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF4D6D]" />
              <span className="h-3 w-3 rounded-full bg-[#FFD166]" />
              <span className="h-3 w-3 rounded-full bg-[#40E0A0]" />
            </div>
            <p className="text-[0.84rem] font-bold tracking-[0.14em] text-[#5F7782]">SALES ANALYTICS - Q1 2025 - LIVE DASHBOARD</p>
          </div>

          <div className="space-y-6 p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {analyticsHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#0D3340] bg-[#051A22] p-4 shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <p className="text-[0.64rem] font-semibold tracking-[0.11em] text-[#5D7580]">{item.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className={`text-[2rem] font-black leading-none tracking-[-0.02em] ${item.valueColor}`}>{item.value}</p>
                    <p className={`pb-1 text-xs font-semibold ${item.changeColor}`}>{item.change}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-[0.08em] text-[#D8E4E6]">KPI TRACKER</h2>
              <div className="mt-4 space-y-3">
                {analyticsKpis.map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-[#0B2D3A] pb-2">
                    <p className="text-xl font-medium text-[#4F6974]">{item.label}</p>
                    <p className="text-xl font-semibold text-[#2BE798]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroDataAnalytics
