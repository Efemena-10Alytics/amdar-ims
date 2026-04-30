"use client"

import Aos from 'aos'
import { ArrowUpRight, CalendarClock, Globe, UsersRound } from 'lucide-react'
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Flag from './flag'
import { GoogleMeetSvg, LimitedSvg } from '../../real-uk-experience/content/svg'

type FaqItem = {
    id: string
    question: string
    answer: string
}

const defaultFaqs: FaqItem[] = [
    { id: 'free', question: 'Is it free?', answer: 'Yes, completely free. No hidden upsell during the session.' },
    { id: 'cert', question: "I've completed labs - why am I not getting jobs?", answer: 'Because employers filter for real-world security delivery, not just lab completion.' },
    { id: 'caus', question: "I'm new to Canada or the US - can this actually help me?", answer: 'Yes. This workshop is built specifically for people without "local experience." That is the exact barrier it addresses.' },
    {
        id: 'miss',
        question: 'What if I miss the live session?',
        answer: "You'll get the recording. But live attendance lets you ask questions specific to your current profile and receive direct guidance.",
    },
]

type FaqProps = {
    onCtaClick?: () => void
    items?: FaqItem[]
    ctaTitle?: string
    ctaDescription?: string
    ctaButtonText?: string
    ctaMeta?: [string, string, string]
}

const Faq = ({
    onCtaClick,
    items = defaultFaqs,
    ctaTitle = 'Your free seat is waiting',
    ctaDescription = 'For aspiring AppSec and Cloud Security professionals in Canada and the US who are done being overlooked.',
    ctaButtonText = 'Save My Spot Now',
    ctaMeta = ['Live on Google Meet Attend from anywhere', '60 minutes (Live Q&A)', 'Free! Limited to 100 spots'],
}: FaqProps) => {
    React.useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
        })
    }, [])

    return (
        <section className="app-width overflow-hidden py-12 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
                <div data-aos="fade-right">
                    <h2 className="text-5xl font-black leading-tight text-[#F2F7F7] sm:text-6xl">
                        Frequently
                        <br />
                        Asked <span className="text-[#F1D477]">Questions</span>
                    </h2>
                    <div className="mt-3">
                        <Flag />
                    </div>
                </div>

                <div data-aos="fade-left" data-aos-delay="100">
                    <Accordion type="single" collapsible defaultValue={items[0]?.id} className="space-y-3">
                        {items.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="rounded-lg px-4 border-0 data-[state=closed]:bg-[#156374E8] data-[state=open]:bg-[#08232D]"
                            >
                                <AccordionTrigger className="group py-4 text-left text-[1.15rem] font-semibold text-[#EAF4F6] hover:no-underline [&>svg]:hidden">
                                    <span>{faq.question}</span>
                                    <span className="text-xl font-semibold text-[#E9CF6D] group-data-[state=open]:hidden">+</span>
                                    <span className="hidden text-xl font-semibold text-[#E9CF6D] group-data-[state=open]:inline">−</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 text-base leading-snug text-[#B8CAD1]">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            <div
                className="mt-10 rounded-3xl border-l-4 border border-[#00D68F66] bg-[#02141A] p-6 shadow-[0_0_0_1px_rgba(0,214,143,0.2),0_20px_44px_rgba(0,0,0,0.35)] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8 lg:p-8"
                data-aos="zoom-in"
            >
                <div>
                    <h3 className="text-4xl font-black leading-tight text-[#F1D477]">{ctaTitle}</h3>
                    <p className="mt-2 max-w-[28ch] text-2xl font-semibold leading-snug text-[#E9F0F0]">
                        {ctaDescription}
                    </p>
                    <button
                        type="button"
                        onClick={onCtaClick}
                        className="group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amdari-yellow px-6 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-primary hover:text-amdari-yellow"
                    >
                        {ctaButtonText}
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-amdari-yellow transition-colors group-hover:bg-amdari-yellow group-hover:text-primary">
                            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                    </button>
                    {/* <button
            type="button"
            className="mt-6 inline-flex items-center rounded-xl bg-amdari-yellow px-5 py-3 text-base font-semibold text-[#0C2730] transition hover:bg-[#F6E39A]"
          >
            Save My Spot Now
          </button> */}
                </div>

                <div className="mt-6 space-y-4 lg:mt-0">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0A3040] text-[#67E2A6]">
                            <GoogleMeetSvg/>
                        </span>
                        <p className="text-xl font-medium text-[#D8E6EA]">{ctaMeta[0]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0A3040] text-[#F1D477]">
                            <CalendarClock className="h-5 w-5" />
                        </span>
                        <p className="text-xl font-medium text-[#D8E6EA]">{ctaMeta[1]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0A3040] text-[#67E2A6]">
                            <LimitedSvg />
                        </span>
                        <p className="text-xl font-medium text-[#D8E6EA]">{ctaMeta[2]}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Faq
