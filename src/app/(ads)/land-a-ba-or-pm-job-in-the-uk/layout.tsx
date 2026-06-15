import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Free Webinar: Land a BA or PM Job in the UK | Amdari',
    },
    description:
        'Whether you\'re targeting Business Analysis or Project Management — this free session maps the exact path UK employers expect, how to get certified fast, and where the real opportunities are hiding.',
    keywords: 'business analyst UK, project manager UK, BA PM jobs, free webinar, career switch UK, NHS jobs, civil service careers',
    openGraph: {
        title: 'Free Webinar: Land a BA or PM Job in the UK | Amdari',
        description:
            'Whether you\'re targeting Business Analysis or Project Management — this free session maps the exact path UK employers expect, how to get certified fast, and where the real opportunities are hiding.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Webinar: Land a BA or PM Job in the UK | Amdari',
        description:
            'Whether you\'re targeting Business Analysis or Project Management — this free session maps the exact path UK employers expect, how to get certified fast, and where the real opportunities are hiding.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
