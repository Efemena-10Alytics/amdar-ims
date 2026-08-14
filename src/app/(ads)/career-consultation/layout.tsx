import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Book a Free UK Career Consultation | Amdari',
    },
    description:
        'Talk to a UK hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the UK market, gaining real work experience, and landing a role.',
    keywords: 'UK career consultation, career coaching UK, 1:1 career advice, UK job search, visa status jobs, career switch UK, hiring expert',
    openGraph: {
        title: 'Book a Free UK Career Consultation | Amdari',
        description:
            'Talk to a UK hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the UK market, gaining real work experience, and landing a role.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Book a Free UK Career Consultation | Amdari',
        description:
            'Talk to a UK hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the UK market, gaining real work experience, and landing a role.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
