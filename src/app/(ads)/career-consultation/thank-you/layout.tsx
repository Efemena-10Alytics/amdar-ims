import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: "You're Booked | Amdari",
    },
    description: 'Thank you for booking your free UK career consultation.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
