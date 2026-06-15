import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Amdari | Free Career Webinar – Get Hired in Tech in 60 Days',
    },
    description:
        'Watch our free career webinar and discover exactly how career switchers are breaking into Project Management, Data, and Cybersecurity — even with zero prior experience.',
    keywords: 'career webinar, UK tech jobs, project management, data analytics, cybersecurity, career switch, UK internship',
    openGraph: {
        title: 'Amdari | Free Career Webinar – Get Hired in Tech in 60 Days',
        description:
            'Watch our free career webinar and discover exactly how career switchers are breaking into Project Management, Data, and Cybersecurity — even with zero prior experience.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Amdari | Free Career Webinar – Get Hired in Tech in 60 Days',
        description:
            'Watch our free career webinar and discover exactly how career switchers are breaking into Project Management, Data, and Cybersecurity — even with zero prior experience.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
