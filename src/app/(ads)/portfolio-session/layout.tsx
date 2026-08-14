import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Free Tech Portfolio Building Practical Session | Amdari',
    },
    description:
        'For career switchers targeting visa-sponsorship roles in the UK across Data Analytics, Data Science, Business Analysis, Project Management and Cybersecurity. Build a real, sponsor-ready portfolio project — live, with feedback.',
    keywords: 'UK portfolio project, visa sponsorship jobs, tech portfolio session, data analytics portfolio, career switch UK, sponsorship ready CV',
    openGraph: {
        title: 'Free Tech Portfolio Building Practical Session | Amdari',
        description:
            'For career switchers targeting visa-sponsorship roles in the UK across Data Analytics, Data Science, Business Analysis, Project Management and Cybersecurity. Build a real, sponsor-ready portfolio project — live, with feedback.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Tech Portfolio Building Practical Session | Amdari',
        description:
            'For career switchers targeting visa-sponsorship roles in the UK across Data Analytics, Data Science, Business Analysis, Project Management and Cybersecurity. Build a real, sponsor-ready portfolio project — live, with feedback.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
