import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Book a Free US/Canada Career Consultation | Amdari',
    },
    description:
        'Talk to a US/Canada hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the North American market, gaining real work experience, and landing a role.',
    keywords: 'US career consultation, Canada career consultation, career coaching North America, 1:1 career advice, US job search, work authorization, career switch, hiring expert',
    openGraph: {
        title: 'Book a Free US/Canada Career Consultation | Amdari',
        description:
            'Talk to a US/Canada hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the North American market, gaining real work experience, and landing a role.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Book a Free US/Canada Career Consultation | Amdari',
        description:
            'Talk to a US/Canada hiring expert and leave with a plan to get hired in 4 months. A private 1:1 session on navigating the North American market, gaining real work experience, and landing a role.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
