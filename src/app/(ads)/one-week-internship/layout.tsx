import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Free 1-Week UK Internship | Amdari',
    },
    description:
        'Intern with a UK company for free, for one week. Real tasks, a real UK team, and one deliverable for your CV — in 5 days, at zero cost.',
    keywords: 'free UK internship, 1 week internship, UK work experience, career switch UK, data analytics internship, cybersecurity internship',
    openGraph: {
        title: 'Free 1-Week UK Internship | Amdari',
        description:
            'Intern with a UK company for free, for one week. Real tasks, a real UK team, and one deliverable for your CV — in 5 days, at zero cost.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free 1-Week UK Internship | Amdari',
        description:
            'Intern with a UK company for free, for one week. Real tasks, a real UK team, and one deliverable for your CV — in 5 days, at zero cost.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
