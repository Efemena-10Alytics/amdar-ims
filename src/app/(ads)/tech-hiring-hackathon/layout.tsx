import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Tech Hiring Hackathon 2026 – Interview Bootcamp | Amdari',
    },
    description:
        'Stop preparing blindly. Get real interview experience with a real job description, immediate feedback, and actionable insights on exactly what to fix. Free live interview bootcamp — 28th July 2026.',
    keywords: 'tech hiring hackathon, interview bootcamp, mock interview, UK tech jobs, interview practice, career switch UK, hiring event',
    openGraph: {
        title: 'Tech Hiring Hackathon 2026 – Interview Bootcamp | Amdari',
        description:
            'Stop preparing blindly. Get real interview experience with a real job description, immediate feedback, and actionable insights on exactly what to fix. Free live interview bootcamp — 28th July 2026.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tech Hiring Hackathon 2026 – Interview Bootcamp | Amdari',
        description:
            'Stop preparing blindly. Get real interview experience with a real job description, immediate feedback, and actionable insights on exactly what to fix. Free live interview bootcamp — 28th July 2026.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
