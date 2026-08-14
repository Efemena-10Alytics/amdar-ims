"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MapPin, Video, Timer, MessageCircle, Building2, Users, Lock, ChevronDown } from 'lucide-react'
import { useCountries } from '@/features/portfolio/use-countries'
import { submitToZoho, ZOHO_RETURN_PATH } from '@/lib/submit-to-zoho'
import { ClockFillSvg, GoogleMeetSvg } from '../real-uk-experience/content/svg'

const ZOHO_FORM_URL =
    'https://forms.zohopublic.com/amdariinc1/form/JobAccessSummit/formperma/Dx-wP20cO-PeZ_ABry6xWuO8JVZyQoYMBYgi1NT2b0Q/htmlRecords/submit'

const OTHER = 'Others'

const HEARD_ABOUT_US_OPTIONS = [
    'Facebook/Instagram Ads',
    'Faloh',
    'Tiktok Ads',
    'Youtube',
    'Google',
    'Family and friends',
    OTHER,
]

const VISA_STATUS_OPTIONS = [
    'Short-Term Study Visa',
    'Student visa',
    'Dependent visa',
    'Skilled worker visa',
    OTHER,
]

const TIMELINE_OPTIONS = ['1 month', '1-3 month', 'Just exploring for now']

const CAREER_PATH_OPTIONS = [
    'Data Analytics',
    'Project Management',
    'Business Analysis',
    'Data Science',
    'Cybersecurity',
    'GRC',
    OTHER,
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
    const router = useRouter()
    const { data: countries = [], isLoading: countriesLoading } = useCountries()
    const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = React.useState('')
    const [selectedField, setSelectedField] = React.useState('')
    const [selectedFieldOther, setSelectedFieldOther] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [country, setCountry] = React.useState('')
    const [visaStatus, setVisaStatus] = React.useState('')
    const [visaStatusOther, setVisaStatusOther] = React.useState('')
    const [timeline, setTimeline] = React.useState('')
    const [careerPath, setCareerPath] = React.useState('')
    const [careerPathOther, setCareerPathOther] = React.useState('')
    const [formError, setFormError] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

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

        const trimmedCountry = country.trim()
        const trimmedVisaOther = visaStatusOther.trim()

        if (
            !trimmedFirstName ||
            !trimmedLastName ||
            !trimmedEmail ||
            !trimmedPhone ||
            !location ||
            !trimmedCountry ||
            !visaStatus ||
            !timeline ||
            !careerPath ||
            !selectedField
        ) {
            setFormError('Please complete all required fields.')
            return
        }

        // "Others" reveals a free-text box; send what the user typed, not the
        // literal "Others" placeholder.
        const trimmedCareerOther = careerPathOther.trim()
        const trimmedFieldOther = selectedFieldOther.trim()
        if (visaStatus === OTHER && !trimmedVisaOther) {
            setFormError('Please enter your visa type.')
            return
        }
        if (careerPath === OTHER && !trimmedCareerOther) {
            setFormError('Please enter your career path.')
            return
        }
        if (selectedField === OTHER && !trimmedFieldOther) {
            setFormError('Please tell us where you heard about us.')
            return
        }
        const visaValue = visaStatus === OTHER ? trimmedVisaOther : visaStatus
        const careerValue = careerPath === OTHER ? trimmedCareerOther : careerPath
        const fieldValue = selectedField === OTHER ? trimmedFieldOther : selectedField

        // Zoho rejects the record (409) when the calling code is missing, so
        // don't let a blank selection through.
        const callingCode = selectedPhoneCountry?.callingCode ?? ''
        if (!callingCode) {
            setFormError('Please select your phone country code.')
            return
        }

        // Zoho also rejects (409) when the number repeats the calling code, which
        // happens whenever someone types their full international number.
        let nationalNumber = trimmedPhone.replace(/[\s()-]/g, '')
        if (nationalNumber.startsWith('+')) {
            nationalNumber = nationalNumber.startsWith(callingCode)
                ? nationalNumber.slice(callingCode.length)
                : nationalNumber.replace(/^\+\d{1,4}/, '')
        }

        setIsSubmitting(true)
        try {
            await submitToZoho(ZOHO_FORM_URL, {
                zf_referrer_name: '',
                zf_redirect_url: `${window.location.origin}${ZOHO_RETURN_PATH}`,
                zc_gad: '',
                SingleLine: trimmedFirstName,
                SingleLine1: trimmedLastName,
                Email1: trimmedEmail,
                PhoneNumber_countrycodeval: callingCode,
                PhoneNumber_countrycode: nationalNumber,
                SingleLine2: trimmedCountry,
                Dropdown1: visaValue,
                Dropdown: timeline,
                Dropdown3: careerValue,
                Dropdown2: fieldValue,
            })
        } catch {
            setFormError("We couldn't complete your registration. Please check your details and try again.")
            return
        } finally {
            setIsSubmitting(false)
        }

        setFirstName('')
        setLastName('')
        setEmail('')
        setPhone('')
        setCountry('')
        setVisaStatus('')
        setVisaStatusOther('')
        setTimeline('')
        setCareerPath('')
        setCareerPathOther('')
        setSelectedField('')
        setSelectedFieldOther('')
        setFormError('')
        router.push('/job-access/thank-you')
    }, [
        careerPath,
        careerPathOther,
        country,
        email,
        firstName,
        lastName,
        phone,
        router,
        selectedField,
        selectedFieldOther,
        timeline,
        visaStatus,
        visaStatusOther,
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
                                            {countries.map((phoneCountry) => (
                                                <option key={phoneCountry.code} value={phoneCountry.code}>
                                                    {phoneCountry.callingCode} ({phoneCountry.code})
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

                            <label className="block space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Country</span>
                                <input
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                    placeholder="Country of residence"
                                />
                            </label>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Visa status</span>
                                <div className="relative">
                                    <select
                                        value={visaStatus}
                                        onChange={(e) => setVisaStatus(e.target.value)}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 pr-10 text-sm text-white outline-none focus:border-[#2C9AB3]"
                                    >
                                        <option value="">-Select-</option>
                                        {VISA_STATUS_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                </div>
                                {visaStatus === OTHER ? (
                                    <input
                                        value={visaStatusOther}
                                        onChange={(e) => setVisaStatusOther(e.target.value)}
                                        className="mt-2 h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Please specify your visa type"
                                    />
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">
                                    How soon will you like to land a job in the UK?
                                </span>
                                <div className="relative">
                                    <select
                                        value={timeline}
                                        onChange={(e) => setTimeline(e.target.value)}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 pr-10 text-sm text-white outline-none focus:border-[#2C9AB3]"
                                    >
                                        <option value="">-Select-</option>
                                        {TIMELINE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">
                                    What career path are you interested in?
                                </span>
                                <div className="relative">
                                    <select
                                        value={careerPath}
                                        onChange={(e) => setCareerPath(e.target.value)}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 pr-10 text-sm text-white outline-none focus:border-[#2C9AB3]"
                                    >
                                        <option value="">-Select-</option>
                                        {CAREER_PATH_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                </div>
                                {careerPath === OTHER ? (
                                    <input
                                        value={careerPathOther}
                                        onChange={(e) => setCareerPathOther(e.target.value)}
                                        className="mt-2 h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Please specify your career path"
                                    />
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-sm font-medium text-[#C7D5D6]">Where did you hear about us?</span>
                                <div className="relative">
                                    <select
                                        value={selectedField}
                                        onChange={(e) => setSelectedField(e.target.value)}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 pr-10 text-sm text-white outline-none focus:border-[#2C9AB3]"
                                    >
                                        <option value="">-Select-</option>
                                        {HEARD_ABOUT_US_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                </div>
                                {selectedField === OTHER ? (
                                    <input
                                        value={selectedFieldOther}
                                        onChange={(e) => setSelectedFieldOther(e.target.value)}
                                        className="mt-2 h-11 w-full rounded-lg border border-[#1E4A5A] bg-[#0F4652] px-4 text-sm text-[#EAF1F7] placeholder:text-[#4A6A7A] outline-none focus:border-[#2C9AB3]"
                                        placeholder="Please specify where you heard about us"
                                    />
                                ) : null}
                            </div>
                            {formError ? (
                                <p className="text-sm text-[#FCA5A5]">{formError}</p>
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
        </div>
    )
}

export default JobAccessPage
