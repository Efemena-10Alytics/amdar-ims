import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const feedItems = [
  { time: '09:14:02', level: 'ALERT', text: 'Brute force - 192.168.1.44', color: 'text-[#FF4D6D]' },
  { time: '09:14:05', level: 'INFO', text: 'Correlating with SIEM rules', color: 'text-[#4DA3FF]' },
  { time: '09:14:08', level: 'WARN', text: 'Repeated auth failure - 6x', color: 'text-[#FFD166]' },
  { time: '09:14:11', level: 'BLOCK', text: 'IP blocked via firewall rule', color: 'text-[#40E0A0]' },
  { time: '09:14:14', level: 'TRIAGE', text: 'Incident ticket #4821 created', color: 'text-[#53C9FF]' },
  { time: '09:14:19', level: 'CLOSE', text: 'Threat contained - low severity', color: 'text-[#4DD08B]' },
]

const statCards = [
  { label: 'Events / hr', value: '2,847', valueColor: 'text-[#4DA3FF]' },
  { label: 'MTTR', value: '4m 12s', valueColor: 'text-[#36D68D]' },
  { label: 'Threats blocked', value: '14', valueColor: 'text-[#FFE082]' },
  { label: 'Status', value: 'Monitoring', valueColor: 'text-[#32D987]' },
]

const Hero = () => {
  return (
    <section className="relative overflow-hidden app-width py-14  lg:py-16">
      <Image
        height={676}
        width={676}
        alt="ellipse"
        src="/images/svgs/ads/ads-ellipse.svg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <Image
        height={676}
        width={676}
        alt="ellipse"
        src="/images/svgs/ads/ads-ellipse.svg"
        className="pointer-events-none absolute -bottom-28 left-0"
      />
      <div className="relative z-10 mx-auto flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-7 inline-flex rounded-full border border-[#FFE08266] bg-[#FFF1C6] px-4 py-2 text-sm font-semibold text-[#564103]">
            Free Workshop - Limited Seats
          </div>

          <h1 className="text-balance text-[2.5rem] font-black leading-[1.05] tracking-[-0.02em] text-[#F2F7F7] sm:text-[3.2rem] lg:text-[4rem]">
            Become a SOC Analyst with
            <br />
            real <span className="text-[#FFE082]">UK experience</span>
            <br />
            not just certifications.
          </h1>

          <p className="mt-7 max-w-140 text-lg leading-relaxed text-[#C7D5D6]">
            This free session shows you how to build the kind of evidence that makes UK employers take you seriously
            even if you&apos;ve never worked in cybersecurity before.
          </p>

          <button
            type="button"
            className="mt-8 cursor-pointer group inline-flex items-center gap-2 rounded-xl bg-amdari-yellow px-7 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow"
          >
            Save My Spot
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary group-hover:bg-amdari-yellow group-hover:text-primary text-xs text-amdari-yellow">
              <ArrowUpRight className="size-3" />
            </span>
          </button>
        </div>

        <div className="relative w-full flex-1 rounded-2xl border border-[#00D68F66] shadow-[0_0_0_1px_rgba(0,214,143,0.15),0_18px_44px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3 border-b border-[#0E3A4A] p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF4D6D]" />
              <span className="h-3 w-3 rounded-full bg-[#FFD166]" />
              <span className="h-3 w-3 rounded-full bg-[#40E0A0]" />
            </div>
            <p className="text-sm font-bold tracking-[0.12em] text-[#6E8590]">SOC ANALYST - LIVE FEED</p>
          </div>

          <div className="pt-4 px-4">
            <div className="space-y-2 pb-4 border-b border-[#0E3A4A]">
              {feedItems.map((item) => (
                <div key={`${item.time}-${item.level}`} className="grid grid-cols-[72px_64px_1fr] items-center gap-2 text-sm">
                  <span className="font-semibold text-[#5B7684]">{item.time}</span>
                  <span className={`font-bold ${item.color}`}>[{item.level}]</span>
                  <span className="truncate text-[#AFC1C7]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 p-4">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-[#0E3A4A] bg-[#06151D] p-4">
                <p className="text-sm font-medium text-[#88A2AF]">{card.label}</p>
                <p className={`mt-2 text-2xl lg:text-4xl font-black leading-none tracking-tight ${card.valueColor}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
