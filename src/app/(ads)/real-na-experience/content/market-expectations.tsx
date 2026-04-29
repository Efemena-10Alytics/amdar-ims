"use client"

import Aos from 'aos'
import { FileText, Globe, LaptopMinimal, ShieldCheck } from 'lucide-react'
import React from 'react'
import { FilesSvg, GlobeSvg, MarketSvg, SecuritySvg, TelescopeSvg } from '../../real-uk-experience/content/svg'

type TopItem = {
  text: string
  icon: React.ReactNode
}

type BottomItem = {
  text: string
}

type MarketExpectationsProps = {
  topTitle?: string
  topItems?: TopItem[]
  bottomTitle?: string
  bottomItems?: BottomItem[]
}

const defaultTopItems: TopItem[] = [
  { text: 'Real project experience (not simulations)', icon: <SecuritySvg /> },
  { text: 'CVs rewritten around actual deliverables', icon: <FilesSvg /> },
  { text: 'Mentorship from working PMs in global markets', icon: <GlobeSvg /> },
  { text: 'Built for immigrants trying to break into Canada/US job markets', icon: <MarketSvg /> },
]

const defaultBottomItems: BottomItem[] = [
  { text: 'Project planning & scheduling' },
  { text: 'Risk & issue management (RAID logs)' },
  { text: 'Stakeholder communication' },
  { text: 'Agile (Scrum, standups, sprint planning)' },
  { text: 'Tools: Jira, MS Project, Excel, Confluence' },
]

const MarketExpectations = ({
  topTitle = 'This is where people stop being filtered out',
  topItems = defaultTopItems,
  bottomTitle = 'What employers in Canada & the US expect',
  bottomItems = defaultBottomItems,
}: MarketExpectationsProps) => {
  React.useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <section className="overflow-hidden">
      {/* Top Section */}
      <div className="overflow-hidden app-width   rounded-t-md bg-[#195D6E] px-6 py-8 sm:px-10 sm:py-20">
        <h2 className="mx-auto max-w-[18ch] text-center text-4xl font-black leading-tight text-[#F1D477] sm:text-5xl" data-aos="fade-up">
          {topTitle}
        </h2>

        <div className="mt-16 grid gap-y-7 sm:grid-cols-2 sm:gap-x-20">
          {topItems.map((item, index) => (
            <div
              key={item.text}
              className={index % 2 === 0 ? 'pb-5' : 'flex flex-col gap-2'}
              data-aos="fade-up"
              data-aos-delay={130 + index * 90}
            >
              {index % 2 === 0 ? (
                <div className="grid gap-3">
                  <p className="max-w-140 text-2xl lg:text-3xl font-semibold leading-snug text-[#EAF3F4]">{item.text}</p>
                  <div className="border-b border-[#CADCE0]" />
                  <div className="flex justify-end">
                    <div className="flex h-14 w-14 items-center justify-center">{item.icon}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center ml-6">{item.icon}</div>
                  <p className="max-w-140 text-2xl lg:text-3xl font-semibold leading-snug text-[#EAF3F4] sm:border-l sm:border-[#CADCE0] sm:pl-6">{item.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative app-width  overflow-hidden rounded-b-md bg-[#F1D477] px-6 py-8 sm:px-10 sm:py-20">
        <span className="absolute right-6 top-0 h-18 w-18 bg-[#495141CC]" />
        <span className="absolute right-0 top-0 h-18 w-12 bg-[#E0CC75]" />

        <h3 className="max-w-[20ch] text-4xl font-black leading-tight text-[#092A31]" data-aos="fade-up">
          {bottomTitle}
        </h3>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {bottomItems.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className={`relative min-h-30 border-[#D9C15D] p-4 shadow-xs ${
                index % 2 === 0 ? 'border-b sm:border-r' : 'border-b sm:border-l'
              }`}
              data-aos="fade-up"
              data-aos-delay={150 + index * 80}
            >
              <p className="max-w-[17ch] text-xl font-semibold leading-snug text-[#1D323B]">{item.text}</p>
              <span className="pointer-events-none absolute bottom-2 right-3 text-6xl font-black leading-none text-[#CCB55180]"><TelescopeSvg /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketExpectations
