import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Free Webinar: Land a Data Job in the UK | Amdari',
    },
    description:
        'Whether you\'re targeting Data Analytics, Data Science, or Data Engineering — this free session maps the exact path UK employers expect, and how you can get there faster than you think.',
    keywords: 'data analyst UK, data scientist UK, data engineering, UK data jobs, free webinar, career switch UK, NHS data, civil service data, SQL Python Power BI',
    openGraph: {
        title: 'Free Webinar: Land a Data Job in the UK | Amdari',
        description:
            'Whether you\'re targeting Data Analytics, Data Science, or Data Engineering — this free session maps the exact path UK employers expect, and how you can get there faster than you think.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Webinar: Land a Data Job in the UK | Amdari',
        description:
            'Whether you\'re targeting Data Analytics, Data Science, or Data Engineering — this free session maps the exact path UK employers expect, and how you can get there faster than you think.',
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
