"use client"

import React from 'react'
import Image from 'next/image'
import { MapPin, Video, Timer, MessageCircle, Building2, Users, Lock, ChevronDown } from 'lucide-react'
import { useCountries } from '@/features/portfolio/use-countries'
import { useCreateAdsData } from '@/features/ads/use-create-ads-data'
import SuccessDialog from '../real-uk-experience/content/success-dialog'
import { ClockFillSvg, GoogleMeetSvg } from '../real-uk-experience/content/svg'

const FIELDS = [
    'Data science',
    'Data analytics',
    'Data Engineering',
    'Project Management',
    'Business analysis',
    'SOC Analysis',
    'Governance Risk & Compliance',
    'App/cloud Security'
]

const gainItems = [
    {
        icon: MessageCircle,
        title: 'Ask UK Recruiters Anything Live',
        description:
            'This is a panel session, not a lecture. You get to put your real questions directly to UK recruiters who are actively hiring — visa sponsorship, what kills your application, how to get past the first screen. Honest answers in real time.',
    },
    {
        icon: Building2,
        title: 'Sponsorship & Career Strategy',
        description:
            'Which companies can actually sponsor you. Which SOC codes apply to your role. How to stop the conversation dying the moment sponsorship is mentioned. How to position career switching as a strength. Practical. Specific. Actionable.',
    },
    {
        icon: Users,
        title: 'Real Open Opportunities',
        description:
            'The recruiters on this panel come with open roles in Data, PM, and BA. Many are licensed to sponsor. This is structured access to people who have open positions — and who came specifically to meet candidates like you.',
    },
]

const JobAccessPage = () => {
    const { data: countries = [], isLoading: countriesLoading } = useCountries()
    const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData()
    const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = React.useState('')
    const [selectedField, setSelectedField] = React.useState('')
    const [isSuccessOpen, setIsSuccessOpen] = React.useState(false)
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [formError, setFormError] = React.useState('')

    React.useEffect(() => {
        if (!countries.length) return
        const defaultCountry = countries.find((c) => c.name === 'Nigeria') ?? countries[0]
        setSelectedPhoneCountryCode((prev) => prev || defaultCountry.code)
    }, [countries])

    const selectedPhoneCountry = React.useMemo(
        () => countries.find((c) => c.code === selectedPhoneCountryCode),
        [countries, selectedPhoneCountryCode]
    )

    const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError('')

        const trimmedFirstName = firstName.trim()
        const trimmedLastName = lastName.trim()
        const trimmedEmail = email.trim()
        const trimmedPhone = phone.trim()
        const location = selectedPhoneCountry?.name ?? ''

        if (!trimmedFirstName || !trimmedEmail || !trimmedPhone || !location) {
            setFormError('Please complete all required fields.')
            return
        }

        const phoneWithCode = trimmedPhone.startsWith('+')
            ? trimmedPhone
            : `${selectedPhoneCountry?.callingCode ?? ''}${trimmedPhone}`

        const response = await createNaRole({
            source: 'JobAccess',
            firstName: trimmedFirstName,
            lastName: trimmedLastName || null,
            email: trimmedEmail,
            location,
            phone: phoneWithCode,
            visaType: selectedField || null,
        })

        if (!response) return

        setIsSuccessOpen(true)
        setFirstName('')
        setLastName('')
        setEmail('')
        setPhone('')
        setSelectedField('')
        setFormError('')
    }, [
        createNaRole,
        email,
        firstName,
        lastName,
        phone,
        selectedField,
        selectedPhoneCountry?.callingCode,
        selectedPhoneCountry?.name,
    ])

    return (
        <div className="relative bg-[#092A31] min-h-screen text-[#F2F7F7]">
            {/* Ellipse Overlay */}
            <div
                className="absolute inset-0 z-1 top-0"
                style={{
                    backgroundImage: "url(/images/svgs/hero-ellipse.svg)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            />
            {/* Top Banner */}
            <div className="p-3 text-center text-[#FFE082] bg-[#FFE0821A] font-semibold text-sm">
                🔴 This Summit Holds Once A Month. Don&apos;t Miss This Month
            </div>

            {/* Hero */}
            <section className="overflow-hidden app-width py-14 lg:py-16">

                <div className="relative z-10 flex w-full flex-col gap-12 lg:flex-row lg:items-start">
                    {/* Left: Content */}
                    <div className="flex-1">
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FFE08266] bg-[#FFF1C6] px-4 py-2 text-sm font-semibold text-[#564103]">
                            <MapPin className="h-3.5 w-3.5" />
                            Live Panel with UK Recruiters
                        </div>

                        <h1 className="text-balance text-[2.8rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F2F7F7] sm:text-[3.5rem] lg:text-[4.2rem]">
                            UK Job Access<br />Summit &amp; Panel
                        </h1>

                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF1C6]">
                                    <GoogleMeetSvg />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[#FFE082] font-semibold text-lg leading-tight">Live on Google Meet</p>
                                    <p className="text-[#FFE082] text-base">(link sent on confirmation)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF1C6]">
                                    <ClockFillSvg />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[#FFE082] font-semibold text-lg leading-tight">60 minutes</p>
                                    <p className="text-[#FFE082] text-base">(Live Q&amp;A)</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 max-w-xl">
                            <p className="text-lg leading-relaxed text-[#C7D5D6]">
                                Stop applying into the void. Get in the room. A live panel session with UK recruiters who are actively hiring where you get to ask your burning questions, understand what they really look for, and hear directly about open opportunities.
                            </p>
                            <p className="text-lg leading-relaxed text-[#C7D5D6]">
                                Spots are filling fast, register now to guarantee your place. Free to attend no catch, no cost.
                            </p>
                        </div>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="w-full max-w-150 shrink-0 rounded-lg bg-[#0C3640] p-6 md:p-8 border border-[#092A31]">
                        <h2 className="text-2xl font-bold text-[#F2F7F7]">Register Now, It&apos;s Free</h2>
                        <p className="mt-1 text-sm text-[#94A8BC]">
                            Secure your spot at the panel. You&apos;ll be directed to the community after registering.
                        </p>

                        <form
                            className="mt-6 space-y-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#C7D5D6]">First name</span>
                                    <input
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Enter your first name"
                                    />
                                </label>
                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#C7D5D6]">Last name</span>
                                    <input
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Enter your last name"
                                    />
                                </label>
                            </div>

                            <label className="block space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Email</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                    placeholder="Enter your email address"
                                />
                            </label>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Phone number</span>
                                <div className="grid grid-cols-[120px_1fr] gap-2">
                                    <div className="relative">
                                        <select
                                            value={selectedPhoneCountryCode}
                                            onChange={(e) => setSelectedPhoneCountryCode(e.target.value)}
                                            className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] pl-3 pr-7 text-sm text-[#EAF1F7] outline-none focus:border-[#2C9AB3]"
                                        >
                                            <option value="">{countriesLoading ? '...' : 'Code'}</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.callingCode} ({country.code})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4A6A7A]" />
                                    </div>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                {selectedPhoneCountry?.callingCode ? (
                                    <p className="text-xs text-[#94A8BC]">Selected code: {selectedPhoneCountry.callingCode}</p>
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Your Field</span>
                                <div className="relative">
                                    <select
                                        value={selectedField}
                                        onChange={(e) => setSelectedField(e.target.value)}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 pr-10 text-sm text-white outline-none focus:border-[#2C9AB3]"
                                    >
                                        <option value="">Select your visa type</option>
                                        {FIELDS.map((field) => (
                                            <option key={field} value={field}>
                                                {field}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                </div>
                            </div>
                            {formError ? (
                                <p className="text-sm text-[#FCA5A5]">{formError}</p>
                            ) : null}
                            {errorMessage ? (
                                <p className="text-sm text-[#FCA5A5]">{errorMessage}</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 h-13 w-full rounded-xl bg-[#FFE082] text-base font-semibold text-[#0C2730] transition hover:bg-[#FFD54F] cursor-pointer"
                            >
                                {isSubmitting ? 'Submitting...' : 'Reserve My Free Spot'}
                            </button>

                            <p className="flex items-center justify-center gap-1.5 text-sm text-[#6A8A9A]">
                                <Lock className="h-3.5 w-3.5" />
                                Free · No credit card · Limited spots
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* What You Stand to Gain */}
            <section className="app-width pb-16 pt-4 lg:pb-24">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#B9A56B]">— WHAT THIS UNLOCKS</p>
                    <h2 className="mt-2 text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-[#F2F7F7] md:text-6xl">
                        What You Stand to Gain
                    </h2>
                    <p className="mt-3 max-w-lg text-lg leading-snug text-[#94A8BC]">
                        One session. Real UK recruiters. Real opportunities and the strategy to actually land them.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {gainItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border border-[#5D7D8A80] bg-[#0C3640] p-5"
                            >
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-[#FFE0821A] text-[#F4D56F]">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <h3 className="mt-4 text-xl font-semibold leading-tight text-[#F2D46F]">{item.title}</h3>
                                <p className="mt-2 text-base leading-snug text-[#CDD8DE]">{item.description}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            <SuccessDialog isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} source="JobAccess" />
        </div>
    )
}

export default JobAccessPage
