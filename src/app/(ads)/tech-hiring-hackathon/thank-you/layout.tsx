import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: "You're Registered | Amdari",
    },
    description: 'Thank you for registering for the Tech Hiring Hackathon 2026.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
