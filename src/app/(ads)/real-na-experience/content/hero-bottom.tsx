import React from 'react'

interface HeroBottomProps {
    heroStats: {
        value: string;
        label: string;
    }[]
}
const HeroBottom = ({ heroStats }: HeroBottomProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [isInView, setIsInView] = React.useState(false)

    const parsedStats = React.useMemo(
        () =>
            heroStats.map((stat) => {
                const match = stat.value.match(/^(\d+)(.*)$/)
                return {
                    ...stat,
                    target: match ? Number(match[1]) : 0,
                    suffix: match ? match[2] : '',
                }
            }),
        [heroStats]
    )

    const [countValues, setCountValues] = React.useState<number[]>(() => parsedStats.map(() => 0))

    React.useEffect(() => {
        const node = containerRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
            },
            { threshold: 0.35 }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    React.useEffect(() => {
        if (!isInView) return

        setCountValues(parsedStats.map(() => 0))
        const durationMs = 1400
        const startTime = performance.now()
        let frameId = 0

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / durationMs, 1)
            setCountValues(parsedStats.map((stat) => Math.round(stat.target * progress)))
            if (progress < 1) frameId = window.requestAnimationFrame(tick)
        }

        frameId = window.requestAnimationFrame(tick)
        return () => window.cancelAnimationFrame(frameId)
    }, [isInView, parsedStats])

    return (
        <div ref={containerRef} className="relative z-10 mt-10 grid gap-0 overflow-hidden rounded-md md:grid-cols-4" data-aos="fade-up" data-aos-delay="220">
            {parsedStats.map((stat, index) => (
                <div key={stat.value} className={`px-4 py-4 text-center`}>
                    <p className="text-4xl md:text-6xl font-black leading-none tracking-[-0.02em] text-[#FFD86E]">
                        {countValues[index]}
                        {stat.suffix}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-tight tracking-[0.07em] text-[#9FB2BC]">{stat.label}</p>
                </div>
            ))}
        </div>
    )
}

export default HeroBottom
