import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: "You're In | Amdari",
    },
    description: 'Thank you for claiming your free one-week UK internship.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
