import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Career Clarity Session | Amdari',
    },
    description:
        'Book a one-to-one conversation with an Amdari career coach. Know what to work on next in your job search and explore your options.',
    keywords: 'career clarity, Amdari, career coaching, job search, tech internship, work experience UK, interview preparation',
    openGraph: {
        title: 'Career Clarity Session | Amdari',
        description:
            'Book a one-to-one conversation with an Amdari career coach. Know what to work on next in your job search and explore your options.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Career Clarity Session | Amdari',
        description:
            'Book a one-to-one conversation with an Amdari career coach. Know what to work on next in your job search.',
    },
};

export default function ClarityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
