"use client"

import React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Globe2, ShieldCheck, Target } from 'lucide-react'
import { ClockFillSvg, GoogleMeetSvg, LimitedSvg, PinFillSvg } from '../../real-uk-experience/content/svg'

const CybersecurityPage = () => {
    const calendlyLink = 'https://calendly.com/efemena-amdari/land-a-cybersecurity-role-via-work-experience'

    const [visibleMonth, setVisibleMonth] = React.useState(() => {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), 1)
    })
    const [selectedDate, setSelectedDate] = React.useState(() => new Date())

    const monthLabel = React.useMemo(
        () => visibleMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        [visibleMonth]
    )

    const calendarDays = React.useMemo(() => {
        const year = visibleMonth.getFullYear()
        const month = visibleMonth.getMonth()
        const firstDayOfMonth = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Convert JS weekday (Sun=0) to Monday-first index (Mon=0)
        const mondayFirstStart = (firstDayOfMonth.getDay() + 6) % 7

        const leadingEmptyCells = Array.from({ length: mondayFirstStart }, () => null)
        const monthCells = Array.from({ length: daysInMonth }, (_, idx) => new Date(year, month, idx + 1))

        return [...leadingEmptyCells, ...monthCells]
    }, [visibleMonth])

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

    const today = new Date()

    return (
        <section className="bg-[#052A31]">
            <div className="relative min-h-screen text-[#F2F7F7] overflow-hidden">
                {/* Ellipse Overlay */}
                <div
                    className="absolute inset-0 z-1 top-0"
                    style={{
                        backgroundImage: "url(/images/svgs/ads/clarity-pattern-1.svg)",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />

                <div className="relative z-10 app-width flex min-h-screen items-center justify-center py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#3AB66A] bg-[#1E8B4E33] px-4 py-2 sm:text-lg font-medium text-[#50D07D]">
                            <span aria-hidden="true">💡</span>
                            Free - Cybersecurity Careers
                        </div>

                        <h1 className="mt-8 text-balance text-4xl md:text-5xl font-semibold leading-[1.2] tracking-[-0.02em] text-[#F6FAFB] lg:text-6xl">
                            You have the certs.{` `}
                            <Image
                                src="/images/svgs/country/UK.svg"
                                alt="United Kingdom flag"
                                width={48}
                                height={48}
                                className="inline-block align-baseline h-7 w-7"
                            />
                            <br />
                            Now get the <span className="text-[#F04A4A]">UK experience</span>
                            <br />
                            <Image
                                src="/images/svgs/country/UK.svg"
                                alt="United Kingdom flag"
                                width={48}
                                height={48}
                                className="inline-block align-baseline h-7 w-7"
                            />{' '}
                            that gets you hired.
                        </h1>

                        <p className="mx-auto mt-8 max-w-4xl text-xl sm:text-2xl leading-relaxed text-[#EBCF74]">
                            SOC Analyst. GRC. App &amp; Cloud Security. If you have the knowledge but no UK work
                            experience on your CV, this is the free session that changes what happens next.
                        </p>
                    </div>
                </div>
            </div>


            <div className="relative min-h-screen text-[#F2F7F7] overflow-hidden">
                {/* Ellipse Overlay */}
                <div
                    className="absolute inset-0 z-1 top-0"
                    style={{
                        backgroundImage: "url(/images/svgs/ads/clarity-pattern-2.svg)",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />
                <div className="relative z-10 app-width flex min-h-screen items-center py-16">
                    <div className="w-full max-w-6xl mx-auto rounded-[28px]  bg-[#04191E]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-10">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
                            <div>
                                <Image
                                    src="/images/svgs/ads/amdari.svg"
                                    alt="Amdari"
                                    width={172}
                                    height={40}
                                    className="h-10 w-auto"
                                />

                                <div className="mt-10 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B4553] text-[#5EE7A0] [&>svg]:h-6 [&>svg]:w-6">
                                            <GoogleMeetSvg />
                                        </span>
                                        <p className="text-xl leading-snug text-[#DFECEF]">Link would be sent on booking</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B4553] text-[#5EE7A0] [&>svg]:h-6 [&>svg]:w-6">
                                            <ClockFillSvg/>
                                        </span>
                                        <p className="text-xl leading-snug text-[#DFECEF]">Monday to Friday. Every day</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B4553] text-[#C5A8FF] [&>svg]:h-6 [&>svg]:w-6">
                                            <LimitedSvg />
                                        </span>
                                        <p className="text-xl leading-snug text-[#DFECEF]">Speak to a career coach One - on - one</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="flex items-center gap-4 text-2xl font-semibold text-[#ECF5F6]">
                                    <PinFillSvg />
                                    Select a Date &amp; Time
                                </h2>

                                <div className="mt-6 rounded-xl bg-[#08313C] p-5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-semibold text-[#EDF6F7]">{monthLabel}</p>
                                        <div className="flex items-center gap-2 text-[#D8E9EC]">
                                            <button
                                                type="button"
                                                aria-label="Previous month"
                                                onClick={() =>
                                                    setVisibleMonth(
                                                        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                                                    )
                                                }
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[#0F4250]"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Next month"
                                                onClick={() =>
                                                    setVisibleMonth(
                                                        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                                                    )
                                                }
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[#0F4250]"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-7 gap-y-4 text-center text-xl text-[#D6E4E8]">
                                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                            <span key={day} className="font-semibold">{day}</span>
                                        ))}
                                        {calendarDays.map((date, idx) =>
                                            date ? (
                                                <button
                                                    key={date.toISOString()}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDate(date)
                                                        window.location.assign(calendlyLink)
                                                    }}
                                                    className={
                                                        isSameDay(selectedDate, date)
                                                            ? 'mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2D675] font-semibold text-[#0A2730]'
                                                            : isSameDay(today, date)
                                                              ? 'mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F2D675] text-[#F2D675]'
                                                              : 'mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#0F4250]'
                                                    }
                                                    aria-label={`Select ${date.toDateString()}`}
                                                >
                                                    {date.getDate()}
                                                </button>
                                            ) : (
                                                <span key={`empty-${idx}`} className="mx-auto inline-flex h-10 w-10" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#F1D477] py-18">
                <div className="app-width">
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <h2 className="max-w-[16ch] text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#042E3A] lg:text-5xl">
                            Why Join This <span className="text-[#EF4343]">FREE</span>
                            <br />
                            Mentorship Session?
                        </h2>
                        <p className="max-w-[40ch] text-xl text-[#254852]">
                            Get clarity on exactly what is standing between you and a sponsored cybersecurity role in
                            the UK, and what to do about it.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        <div className="rounded-2xl bg-[#DFC777] p-6 text-center">
                            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0A5F6A] text-[#5EE7A0]">
                                <Target className="h-7 w-7" />
                            </span>
                            <h3 className="mt-4 text-xl md:text-2xl font-semibold leading-tight text-[#092A31]">
                                Know Which Roles Can
                                <br />
                                Get You Sponsored
                            </h3>
                            <p className="mt-3 text-sm leading-snug text-[#264650]">
                                SOC Analyst, GRC Analyst, Cloud Security Engineer, find out exactly which roles sit on
                                the UK Skilled Worker visa list and which occupation codes apply to you.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#DFC777] p-6 text-center">
                            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0A5F6A] text-[#5EE7A0]">
                                <ShieldCheck className="h-7 w-7" />
                            </span>
                            <h3 className="mt-4 text-xl md:text-2xl font-semibold leading-tight text-[#092A31]">
                                Understand the UK
                                <br />
                                Experience Gap
                            </h3>
                            <p className="mt-3 text-sm leading-snug text-[#264650]">
                                CompTIA, CEH, CISSP are not enough on their own. Learn why UK employers keep
                                filtering you out and exactly what a UK cybersecurity project on your CV changes.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#DFC777] p-6 text-center">
                            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0A5F6A] text-[#5EE7A0]">
                                <Globe2 className="h-7 w-7" />
                            </span>
                            <h3 className="mt-4 text-xl md:text-2xl font-semibold leading-tight text-[#092A31]">
                                Your Personal
                                <br />
                                Sponsorship Roadmap
                            </h3>
                            <p className="mt-3 text-sm leading-snug text-[#264650]">
                                Walk away knowing which UK companies are licensed to sponsor cyber roles, how to
                                position yourself, and what your next 12 weeks need to look like.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CybersecurityPage
