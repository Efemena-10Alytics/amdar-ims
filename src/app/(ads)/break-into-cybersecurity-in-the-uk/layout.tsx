import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Free Webinar: Land a Cybersecurity Job in the UK | Amdari',
    },
    description:
        'The UK has a critical cybersecurity skills shortage — and employers are actively hiring people who make the switch. This free session shows you which path fits your background, what certifications open doors, and how to land your first role fast.',
    keywords: 'cybersecurity UK, SOC analyst, GRC, cloud security, cybersecurity jobs UK, free webinar, career switch, CompTIA Security+',
    openGraph: {
        title: 'Free Webinar: Land a Cybersecurity Job in the UK | Amdari',
        description:
            'The UK has a critical cybersecurity skills shortage — and employers are actively hiring people who make the switch. This free session shows you which path fits your background, what certifications open doors, and how to land your first role fast.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Webinar: Land a Cybersecurity Job in the UK | Amdari',
        description:
            'The UK has a critical cybersecurity skills shortage — and employers are actively hiring people who make the switch. This free session shows you which path fits your background, what certifications open doors, and how to land your first role fast.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
