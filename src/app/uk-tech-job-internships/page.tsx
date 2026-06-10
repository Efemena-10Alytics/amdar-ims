"use client"

import React from 'react'
import Image from 'next/image'
import './animations.css'

// TODO: replace with the real webinar YouTube video ID
const YOUTUBE_VIDEO_ID = 'VIDEO_ID'

const TOASTS = [
    { id: 1, avatar: 'TK', title: 'Tunde K. just enrolled', sub: '2 minutes ago · Lagos' },
    { id: 2, avatar: 'AO', title: 'Amina O. got hired — 7 weeks in!', sub: 'Now a Data Analyst at a UK firm 🎉' },
    { id: 3, avatar: 'EF', title: 'Recruiter coffee chat confirmed', sub: 'Efe F. met a hiring manager this week' },
    { id: 4, avatar: 'BC', title: 'Blessing C. landed a role in 2 months', sub: 'Project Manager · Remote UK' },
    { id: 5, avatar: 'SN', title: 'Only 10 spots left in June cohort', sub: 'Scroll down to secure yours →' },
]

const TOAST_SCHEDULE = [
    { id: 1, delay: 4000, duration: 5000 },
    { id: 2, delay: 14000, duration: 5500 },
    { id: 3, delay: 25000, duration: 5000 },
    { id: 4, delay: 38000, duration: 5500 },
    { id: 5, delay: 55000, duration: 6000 },
]

const PROOF_ITEMS = [
    { icon: '☕', strong: 'Recruiter Coffee Chats', text: 'every cohort' },
    { icon: '🚀', strong: 'Blessing C.', text: 'hired in 2 months — Project Manager' },
    { icon: '💼', strong: 'Internship placements', text: 'with UK companies' },
    { icon: '🎯', strong: 'Efe F.', text: 'landed a Data role after 6 weeks' },
    { icon: '🔐', strong: 'Cybersecurity track', text: '— direct recruiter access' },
    { icon: '🌍', strong: 'Career switchers welcome', text: '— no experience needed' },
    { icon: '📅', strong: 'June cohort starting soon', text: '— 10 slots remaining' },
]

const STATS = [
    { num: '100+', label: 'Graduates Hired' },
    { num: '60', label: 'Avg. Days to Hired' },
    { num: '3', label: 'Career Tracks' },
    { num: 'UK', label: 'Recruiter Network' },
]

const FEATURES = [
    {
        icon: '🗺️',
        title: 'Your 60-Day Roadmap',
        description: 'A step-by-step career transition plan tailored for people starting from scratch in a new field.',
    },
    {
        icon: '☕',
        title: 'Recruiter Coffee Chats',
        description: 'Direct access to UK recruiters who are actively hiring. Our cohort members get warm introductions — not cold applications.',
    },
    {
        icon: '🏢',
        title: 'Internship Placements',
        description: 'We place graduates into real internships with UK employers to build their CV from day one.',
    },
    {
        icon: '🎓',
        title: 'Industry Certifications',
        description: 'Leave with credentials that employers actually look for — PM, Data, and Cybersecurity frameworks included.',
    },
    {
        icon: '🤝',
        title: '1:1 Career Coaching',
        description: 'Daily clarity sessions with a personal coach who tracks your progress and keeps you on target.',
    },
    {
        icon: '💼',
        title: 'Job Access Summit',
        description: 'A live event connecting you with UK hiring managers and recruiters — our signature cohort experience.',
    },
]

const TRACKS = [
    'Project Management',
    'Data Analytics',
    'Cybersecurity',
    'Business Analysis',
    'Product Management',
]

const SITUATIONS = [
    'Employed, looking to switch',
    'Unemployed, actively job hunting',
    'Student / Recent graduate',
    'Freelancer / Self-employed',
]

const TESTIMONIALS = [
    {
        avatar: 'BC',
        name: 'Blessing C.',
        role: 'Now: Project Manager · Remote UK',
        quote: '"I went from zero experience to an offer letter in under 8 weeks. The recruiter coffee chat was the turning point — I met my future manager there."',
    },
    {
        avatar: 'EF',
        name: 'Efe F.',
        role: 'Now: Junior Data Analyst',
        quote: '"I was switching from teaching. The coaching was exactly what I needed — someone to hold me accountable daily. I had my first interview in 3 weeks."',
    },
    {
        avatar: 'AO',
        name: 'Amina O.',
        role: 'Now: Business Analyst · London',
        quote: '"The internship placement was game-changing. I got hands-on experience, built real connections, and the company offered me a full-time role after 6 weeks."',
    },
]

const INITIAL_CHAT_MESSAGE = {
    from: 'bot' as const,
    text: '👋 Hi! Watched the webinar? We’d love to help you take the next step. What questions do you have?',
}

const CHAT_AUTO_REPLY =
    'Thanks for reaching out! A member of our team will respond shortly. In the meantime, feel free to fill in the form below to secure your spot.'

const inputClasses =
    'w-full rounded-lg border border-[#156374]/50 bg-[#0C3640] px-3.5 py-3 text-sm text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95]'

const UkTechJobInternshipsPage = () => {
    // ── Video ──
    const [videoLoaded, setVideoLoaded] = React.useState(false)

    // ── Toasts ──
    const [visibleToasts, setVisibleToasts] = React.useState<Record<number, boolean>>({})
    const [toastOverride, setToastOverride] = React.useState<{ title: string; sub: string } | null>(null)
    const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([])

    const showToast = React.useCallback((id: number, duration: number) => {
        setVisibleToasts((v) => ({ ...v, [id]: true }))
        timersRef.current.push(
            setTimeout(() => setVisibleToasts((v) => ({ ...v, [id]: false })), duration)
        )
    }, [])

    React.useEffect(() => {
        const timers = timersRef.current
        TOAST_SCHEDULE.forEach((t) => {
            timers.push(setTimeout(() => showToast(t.id, t.duration), t.delay))
        })
        const interval = setInterval(() => {
            const t = TOAST_SCHEDULE[Math.floor(Math.random() * TOAST_SCHEDULE.length)]
            showToast(t.id, t.duration)
        }, 90000)
        return () => {
            timers.forEach(clearTimeout)
            clearInterval(interval)
        }
    }, [showToast])

    // ── Chat ──
    const [chatOpen, setChatOpen] = React.useState(false)
    const chatOpenRef = React.useRef(false)
    const [chatMessages, setChatMessages] = React.useState<{ from: 'bot' | 'user'; text: string }[]>([INITIAL_CHAT_MESSAGE])
    const [chatInput, setChatInput] = React.useState('')
    const chatMessagesRef = React.useRef<HTMLDivElement>(null)

    const toggleChat = React.useCallback(() => {
        setChatOpen((open) => {
            chatOpenRef.current = !open
            return !open
        })
    }, [])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!chatOpenRef.current) {
                chatOpenRef.current = true
                setChatOpen(true)
            }
        }, 60000)
        return () => clearTimeout(timer)
    }, [])

    React.useEffect(() => {
        const el = chatMessagesRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [chatMessages])

    const sendChat = React.useCallback(() => {
        const msg = chatInput.trim()
        if (!msg) return
        setChatMessages((msgs) => [...msgs, { from: 'user' as const, text: msg }])
        setChatInput('')
        timersRef.current.push(
            setTimeout(() => {
                setChatMessages((msgs) => [...msgs, { from: 'bot' as const, text: CHAT_AUTO_REPLY }])
            }, 1200)
        )
    }, [chatInput])

    // ── Form ──
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [track, setTrack] = React.useState('')
    const [situation, setSituation] = React.useState('')
    const [formError, setFormError] = React.useState('')
    const [submitted, setSubmitted] = React.useState(false)

    const handleSubmit = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const trimmedFirstName = firstName.trim()
            const trimmedEmail = email.trim()
            if (!trimmedFirstName || !trimmedEmail) {
                setFormError('Please enter at least your name and email.')
                return
            }
            setFormError('')
            setSubmitted(true)

            timersRef.current.push(
                setTimeout(() => {
                    setToastOverride({
                        title: `${trimmedFirstName} just enrolled`,
                        sub: 'Just now · You secured a spot!',
                    })
                    showToast(1, 5000)
                }, 800)
            )
        },
        [email, firstName, showToast]
    )

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#092A31] leading-[1.6] text-[#F2F7F7]">
            {/* TOAST NOTIFICATIONS (social proof while watching) */}
            <div className="pointer-events-none fixed bottom-[90px] left-5 z-[200] flex flex-col gap-2.5 max-[600px]:hidden">
                {TOASTS.map((toast) => {
                    const isFirst = toast.id === 1
                    const title = isFirst && toastOverride ? toastOverride.title : toast.title
                    const sub = isFirst && toastOverride ? toastOverride.sub : toast.sub
                    return (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex max-w-[300px] items-center gap-3 rounded-[10px] border border-[#156374]/50 border-l-[3px] border-l-[#FFE082] bg-[#0F4652] px-4 py-3 text-[13px] text-[#F2F7F7] transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${visibleToasts[toast.id] ? 'translate-x-0 opacity-100' : '-translate-x-[360px] opacity-0'}`}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#156374] text-sm font-bold text-white">
                                {toast.avatar}
                            </div>
                            <div className="leading-[1.4]">
                                <strong className="block text-[13px] text-[#FFE082]">{title}</strong>
                                <span className="text-[11px] text-[#C7D5D6]">{sub}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* TOP BAR */}
            <div className="sticky top-0 z-[100] bg-[#FFE082] px-5 py-2.5 text-center text-[13px] font-bold tracking-[0.02em] text-[#0C2730]">
                <span className="animate-[pulse-text_2s_ease-in-out_infinite]">
                    🔥 Next Cohort Starts Soon — Only 10 Spots Left. Don&apos;t Miss Out.
                </span>
            </div>

            {/* NAV */}
            <nav className="sticky top-[37px] z-[99] flex items-center justify-between border-b border-[#156374]/25 bg-[#092A31]/95 px-[5%] py-[18px] backdrop-blur-[10px]">
                <Image src="/logo-white.svg" width={154} height={22} alt="Amdari" />
                <a
                    href="#enroll"
                    className="rounded-md bg-[#FFE082] px-6 py-2.5 text-[13px] font-bold text-[#0C2730] transition-colors hover:bg-[#FFD54F]"
                >
                    Reserve My Spot →
                </a>
            </nav>

            {/* HERO */}
            <div className="mx-auto max-w-[1100px] px-[5%] pb-10 pt-[60px] text-center">
                <div className="mb-6 inline-block rounded-full border border-[#FFE082]/30 bg-[#FFE082]/12 px-[18px] py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#FFE082]">
                    Free Live Webinar · 45 Minutes
                </div>
                <h1 className="mb-5 text-[clamp(28px,5vw,52px)] font-black leading-[1.1] tracking-[-0.03em] text-white">
                    Land a Tech Job in the UK
                    <br />
                    <em className="not-italic text-[#FFE082]">Within 60 Days</em>
                </h1>
                <p className="mx-auto mb-8 max-w-[600px] text-[clamp(15px,2vw,18px)] text-[#C7D5D6]">
                    Watch our free career webinar and discover exactly how career switchers are breaking
                    into Project Management, Data, and Cybersecurity — even with zero prior experience.
                </p>
                <div className="mb-9 flex flex-wrap justify-center gap-2.5">
                    {['100+ hired graduates', 'Real recruiters. Real jobs.', 'Free to watch now'].map(
                        (badge) => (
                            <div
                                key={badge}
                                className="flex items-center gap-1.5 rounded-full border border-[#156374]/50 bg-[#0C3640] px-4 py-[7px] text-xs font-medium text-[#C7D5D6]"
                            >
                                <div className="h-[7px] w-[7px] animate-[blink_1.5s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
                                {badge}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* VIDEO */}
            <div className="relative mx-auto mb-5 max-w-[900px] px-[5%]">
                <div className="overflow-hidden rounded-2xl border border-[#156374]/50 bg-[#0C3640] shadow-[0_0_60px_rgba(27,94,115,0.2)]">
                    {videoLoaded ? (
                        <iframe
                            className="block aspect-video w-full border-0"
                            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Amdari Career Webinar"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setVideoLoaded(true)}
                            className="group flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0d1e26] to-[#0a1920]"
                        >
                            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FFE082] transition-[transform,background-color] duration-200 group-hover:scale-[1.08] group-hover:bg-[#FFD54F]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0C2730" className="ml-[5px]">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            </div>
                            <p className="text-sm text-[#C7D5D6]">Click to watch · 45-minute free webinar</p>
                        </button>
                    )}
                </div>
            </div>

            {/* SOCIAL PROOF TICKER */}
            <div className="overflow-hidden whitespace-nowrap border-y border-[#156374]/25 bg-[#156374]/8 py-3">
                <div className="inline-flex animate-[ticker_30s_linear_infinite]">
                    {[...PROOF_ITEMS, ...PROOF_ITEMS].map((item, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center gap-2.5 border-r border-[#156374]/25 px-10 text-[13px] text-[#C7D5D6]"
                        >
                            <span className="text-[15px] text-[#FFE082]">{item.icon}</span>{' '}
                            <strong className="text-[#F2F7F7]">{item.strong}</strong> {item.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* URGENCY BAR */}
            <div className="mx-auto mb-12 mt-8 max-w-[900px] px-[5%]">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#FFE082]/40 bg-[#0C3640] px-6 py-4 max-[600px]:justify-center max-[600px]:text-center">
                    <div className="flex items-center gap-3.5">
                        <div className="text-4xl font-black leading-none text-[#FFE082]">10</div>
                        <div className="text-[13px] text-[#C7D5D6]">
                            <strong className="block text-[15px] text-[#F2F7F7]">Spots Remaining</strong>
                            June Cohort · Starting Soon
                        </div>
                    </div>
                    <div className="min-w-[160px] flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full w-[80%] animate-[progress-shine_2s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
                        </div>
                        <div className="mt-[5px] text-[11px] text-[#C7D5D6]">
                            40 of 50 seats claimed — filling fast
                        </div>
                    </div>
                    <a
                        href="#enroll"
                        className="inline-block whitespace-nowrap rounded-lg bg-[#FFE082] px-7 py-3 text-sm font-extrabold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
                    >
                        Secure My Spot →
                    </a>
                </div>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap justify-center gap-10 border-b border-[#156374]/25 px-[5%] py-12">
                {STATS.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-4xl font-black tracking-[-0.03em] text-[#FFE082]">{stat.num}</div>
                        <div className="mt-0.5 text-xs font-medium text-[#C7D5D6]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* WHAT'S INSIDE */}
            <div className="mx-auto max-w-[1100px] px-[5%] py-12">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2B7F95]">
                    What you&apos;ll discover
                </div>
                <h2 className="mb-9 text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-[-0.02em] text-white">
                    Everything you need to
                    <br />
                    <em className="not-italic text-[#FFE082]">make the switch</em>
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-[#156374]/25 bg-[#0C3640] p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#2B7F95]"
                        >
                            <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#156374]/20 text-xl">
                                {feature.icon}
                            </div>
                            <h3 className="mb-1.5 text-[15px] font-bold text-white">{feature.title}</h3>
                            <p className="text-[13px] leading-relaxed text-[#C7D5D6]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRACKS */}
            <div className="mx-auto max-w-[1100px] px-[5%] pb-12">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2B7F95]">
                    Career tracks
                </div>
                <h2 className="mb-9 text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-[-0.02em] text-white">
                    Choose your path
                    <br />
                    into <em className="not-italic text-[#FFE082]">tech</em>
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                    {TRACKS.map((trackName) => (
                        <div
                            key={trackName}
                            className="flex items-center gap-3 rounded-[10px] border border-[#156374]/25 bg-[#0C3640] px-5 py-[18px] transition-colors hover:border-[#2B7F95]"
                        >
                            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFE082]" />
                            <span className="text-sm font-semibold text-[#F2F7F7]">{trackName}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div className="mx-auto max-w-[1100px] px-[5%] pb-12">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2B7F95]">
                    Success stories
                </div>
                <h2 className="mb-9 text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-[-0.02em] text-white">
                    People who got hired
                    <br />
                    <em className="not-italic text-[#FFE082]">in 60 days or less</em>
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="rounded-2xl border border-[#156374]/25 bg-[#0C3640] p-6"
                        >
                            <div className="mb-3 text-sm tracking-[2px] text-[#FFE082]">★★★★★</div>
                            <blockquote className="mb-4 text-sm italic leading-[1.7] text-[#C7D5D6]">
                                {testimonial.quote}
                            </blockquote>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#156374] text-[13px] font-bold text-white">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-white">{testimonial.name}</div>
                                    <div className="text-[11px] text-[#4A6A7A]">{testimonial.role}</div>
                                </div>
                                <div className="ml-auto rounded-full border border-[#22c55e]/25 bg-[#22c55e]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-[#4ade80]">
                                    Hired ✓
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ENROLL FORM */}
            <div id="enroll" className="border-y border-[#156374]/25 bg-[#061A20] px-[5%] py-16">
                <div className="mx-auto max-w-[560px] text-center">
                    <div className="mb-4 inline-block rounded-full border border-[#FFE082]/30 bg-[#FFE082]/12 px-[18px] py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#FFE082]">
                        Only 10 spots left
                    </div>
                    <h2 className="mb-2 text-[clamp(22px,3.5vw,32px)] font-extrabold tracking-[-0.02em] text-white">
                        Secure Your Place in the June Cohort
                    </h2>
                    <p className="mb-8 text-sm text-[#C7D5D6]">
                        Fill in your details and our team will reach out to confirm your enrollment within
                        24 hours.
                    </p>

                    {submitted ? (
                        <div className="rounded-[10px] border border-[#22c55e]/25 bg-[#22c55e]/8 p-6 text-[15px] font-semibold text-[#4ade80]">
                            ✅ You&apos;re on the list! Our team will contact you within 24 hours to confirm
                            your spot. Check your inbox.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 grid grid-cols-2 gap-3 text-left max-[600px]:grid-cols-1">
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">First Name</span>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Your first name"
                                        required
                                        className={inputClasses}
                                    />
                                </label>
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">Last Name</span>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Your last name"
                                        required
                                        className={inputClasses}
                                    />
                                </label>
                            </div>
                            <div className="mb-3 grid grid-cols-1 gap-3 text-left">
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">Email Address</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@email.com"
                                        required
                                        className={inputClasses}
                                    />
                                </label>
                            </div>
                            <div className="mb-3 grid grid-cols-1 gap-3 text-left">
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">WhatsApp / Phone</span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+44 7700 900000"
                                        className={inputClasses}
                                    />
                                </label>
                            </div>
                            <div className="mb-3 grid grid-cols-1 gap-3 text-left">
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">
                                        Career Track You&apos;re Interested In
                                    </span>
                                    <select
                                        value={track}
                                        onChange={(e) => setTrack(e.target.value)}
                                        className={`${inputClasses} [&>option]:bg-[#0C3640]`}
                                    >
                                        <option value="">Select a track…</option>
                                        {TRACKS.map((trackName) => (
                                            <option key={trackName} value={trackName}>
                                                {trackName}
                                            </option>
                                        ))}
                                        <option>Not sure yet — help me choose</option>
                                    </select>
                                </label>
                            </div>
                            <div className="mb-3 grid grid-cols-1 gap-3 text-left">
                                <label className="flex flex-col gap-[5px]">
                                    <span className="text-xs font-semibold text-[#C7D5D6]">Current Situation</span>
                                    <select
                                        value={situation}
                                        onChange={(e) => setSituation(e.target.value)}
                                        className={`${inputClasses} [&>option]:bg-[#0C3640]`}
                                    >
                                        <option value="">Tell us where you are now…</option>
                                        {SITUATIONS.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            {formError ? (
                                <p className="mb-2 text-left text-sm text-[#fca5a5]">{formError}</p>
                            ) : null}
                            <button
                                type="submit"
                                className="mt-2 w-full cursor-pointer rounded-lg bg-[#FFE082] p-[15px] text-base font-extrabold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F]"
                            >
                                Reserve My Spot — It&apos;s Free →
                            </button>
                            <p className="mt-2.5 text-[11px] text-[#4A6A7A]">
                                🔒 We respect your privacy. No spam, ever. You&apos;ll only hear from our team.
                            </p>
                        </form>
                    )}
                </div>
            </div>

            {/* CONTACT */}
            <div className="mx-auto max-w-[1100px] px-[5%] py-12 text-center">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2B7F95]">
                    Get in touch
                </div>
                <h2 className="mb-4 text-[clamp(22px,3.5vw,36px)] font-extrabold tracking-[-0.02em] text-white">
                    Have questions? <em className="not-italic text-[#FFE082]">We&apos;re here.</em>
                </h2>
                <p className="mb-6 text-sm text-[#C7D5D6]">
                    Chat with us live using the button in the corner, or reach out directly.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="mailto:hello@amdari.io"
                        className="flex items-center gap-2 rounded-lg border border-[#156374]/50 bg-[#0C3640] px-6 py-3 text-sm font-semibold text-[#F2F7F7]"
                    >
                        ✉️ hello@amdari.io
                    </a>
                    <a
                        href="https://wa.me/447700900000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-[#25d366]/25 bg-[#25d366]/8 px-6 py-3 text-sm font-semibold text-[#4ade80]"
                    >
                        💬 WhatsApp Us
                    </a>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="border-t border-[#156374]/25 px-[5%] py-10 text-center text-xs text-[#4A6A7A]">
                <div className="mb-2 flex justify-center">
                    <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
                </div>
                <p className="mb-2">Helping career switchers land tech jobs in the UK.</p>
                <p>
                    <a href="#" className="text-[#C7D5D6]">
                        Privacy Policy
                    </a>{' '}
                    ·{' '}
                    <a href="#" className="text-[#C7D5D6]">
                        Terms
                    </a>{' '}
                    · © 2025 Amdari. All rights reserved.
                </p>
            </footer>

            {/* LIVE CHAT WIDGET */}
            <div className="fixed bottom-6 right-6 z-[300]">
                <button
                    type="button"
                    onClick={toggleChat}
                    title="Chat with us"
                    className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#2B7F95] bg-[#156374] shadow-[0_4px_20px_rgba(27,94,115,0.5)] transition-[transform,background-color] duration-200 hover:scale-[1.08] hover:bg-[#2B7F95]"
                >
                    <div className="absolute -right-[3px] -top-[3px] h-3.5 w-3.5 animate-[blink_1.5s_ease-in-out_infinite] rounded-full border-2 border-[#092A31] bg-[#FFE082]" />
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                </button>
                {chatOpen ? (
                    <div className="absolute bottom-[68px] right-0 flex w-[320px] flex-col overflow-hidden rounded-2xl border border-[#156374]/50 bg-[#0F4652] shadow-[0_8px_40px_rgba(0,0,0,0.5)] max-[600px]:w-[280px]">
                        <div className="flex items-center gap-2.5 bg-[#156374] px-4 py-3.5">
                            <div className="h-2 w-2 animate-[blink_1.5s_ease-in-out_infinite] rounded-full bg-[#4ade80]" />
                            <div>
                                <div className="text-[13px] font-bold text-white">Amdari Team</div>
                                <div className="text-[11px] text-white/70">
                                    We&apos;re online · Replies in minutes
                                </div>
                            </div>
                        </div>
                        <div
                            ref={chatMessagesRef}
                            className="flex max-h-[220px] flex-1 flex-col gap-2.5 overflow-y-auto p-3.5"
                        >
                            {chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.from === 'user'
                                            ? 'ml-auto max-w-[85%] rounded-[10px_10px_0_10px] bg-[#FFE082]/15 px-3 py-2.5 text-xs text-[#F2F7F7]'
                                            : 'max-w-[85%] rounded-[10px_10px_10px_0] bg-[#156374]/18 px-3 py-2.5 text-xs text-[#C7D5D6]'
                                    }
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 border-t border-[#156374]/25 bg-[#0C3640] px-3 py-2.5">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendChat()
                                }}
                                placeholder="Type a message…"
                                className="flex-1 rounded-md border border-[#156374]/50 bg-[#061A20] px-2.5 py-2 text-xs text-[#F2F7F7] outline-none focus:border-[#2B7F95]"
                            />
                            <button
                                type="button"
                                onClick={sendChat}
                                className="cursor-pointer rounded-md bg-[#FFE082] px-3 py-2 text-xs font-bold text-[#0C2730]"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default UkTechJobInternshipsPage
