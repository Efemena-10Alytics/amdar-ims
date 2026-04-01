import { cn } from '@/lib/utils';
import Image from 'next/image';


const HERO_FLOATING_ICONS = [
    { src: "/images/svgs/tools/figma.svg", alt: "Figma", sizeClass: "size-12" },
    { src: "/images/svgs/tools/canva.svg", alt: "Canva", sizeClass: "size-16" },
    { src: "/images/svgs/tools/jira.svg", alt: "Jira", sizeClass: "size-12" },
    { src: "/images/svgs/tools/trello.svg", alt: "Trello", sizeClass: "size-13" },
    { src: "/images/svgs/tools/notion.svg", alt: "Notion", sizeClass: "size-12" },
    { src: "/images/svgs/tools/sketch.svg", alt: "Sketch", sizeClass: "size-16" },
    { src: "/images/svgs/tools/photoshop.svg", alt: "Photoshop", sizeClass: "size-16" },
    { src: "/images/svgs/tools/adobe-illustrator.svg", alt: "Adobe Illustrator", sizeClass: "size-12" },
    { src: "/images/svgs/tools/figma.svg", alt: "Figma 2", sizeClass: "size-13" },
    { src: "/images/svgs/tools/canva.svg", alt: "Canva 2", sizeClass: "size-12" },
    { src: "/images/svgs/tools/jira.svg", alt: "Jira 2", sizeClass: "size-16" },
    { src: "/images/svgs/tools/trello.svg", alt: "Trello 2", sizeClass: "size-12" },
    { src: "/images/svgs/tools/notion.svg", alt: "Notion 2", sizeClass: "size-13" },
    { src: "/images/svgs/tools/sketch.svg", alt: "Sketch 2", sizeClass: "size-12" },
    { src: "/images/svgs/tools/photoshop.svg", alt: "Photoshop 2", sizeClass: "size-13" },
    { src: "/images/svgs/tools/adobe-illustrator.svg", alt: "Adobe Illustrator 2", sizeClass: "size-12" },
    { src: "/images/svgs/tools/figma.svg", alt: "Figma 3", sizeClass: "size-16" },
    { src: "/images/svgs/tools/trello.svg", alt: "Trello 3", sizeClass: "size-12" },
    { src: "/images/svgs/tools/canva.svg", alt: "Canva 3", sizeClass: "size-13" },
    { src: "/images/svgs/tools/jira.svg", alt: "Jira 3", sizeClass: "size-12" },
    { src: "/images/svgs/tools/notion.svg", alt: "Notion 3", sizeClass: "size-12" },
    { src: "/images/svgs/tools/sketch.svg", alt: "Sketch 3", sizeClass: "size-16" },
    { src: "/images/svgs/tools/photoshop.svg", alt: "Photoshop 3", sizeClass: "size-16" },
    { src: "/images/svgs/tools/adobe-illustrator.svg", alt: "Adobe Illustrator 3", sizeClass: "size-12" },
    { src: "/images/svgs/tools/figma.svg", alt: "Figma 4", sizeClass: "size-16" },
    { src: "/images/svgs/tools/canva.svg", alt: "Canva 4", sizeClass: "size-13" },
    { src: "/images/svgs/tools/jira.svg", alt: "Jira 4", sizeClass: "size-12" },
    { src: "/images/svgs/tools/trello.svg", alt: "Trello 4", sizeClass: "size-12" },
] as const;

const HERO_ORBIT_LAYERS = [
    { name: "outer", radius: 720, duration: 72, angleOffset: 0, direction: "reverse", sizeClass: "size-16" },
    { name: "inner", radius: 590, duration: 56, angleOffset: 9, direction: "normal", sizeClass: "size-14" },
] as const;

const IconOrbit = () => {
    return (
        <>
            <div className="pointer-events-none absolute inset-0 z-2 hidden lg:flex items-center justify-center">
                <div className="hero-two-orbit-stage relative h-360 w-[min(calc(100vw-24px),1580px)] max-w-none">
                    {HERO_ORBIT_LAYERS.map((layer) => (
                        <div
                            key={layer.name}
                            className="absolute inset-0"
                        >
                            {HERO_FLOATING_ICONS.map((icon, index) => {
                                const angle =
                                    (index / HERO_FLOATING_ICONS.length) * 360 + layer.angleOffset;

                                return (
                                    <div
                                        key={`${layer.name}-${icon.alt}`}
                                        className="hero-two-orbit-item absolute left-1/2 top-1/2"
                                        style={{
                                            ["--hero-orbit-angle" as string]: `${angle}deg`,
                                            ["--hero-orbit-radius" as string]: `${layer.radius}px`,
                                            animationDuration: `${layer.duration}s`,
                                            animationDirection: layer.direction,
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "hero-two-icon-spin rounded-full border border-white/8 bg-white/6 opacity-45 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                                                layer.sizeClass,
                                            )}
                                        >
                                            <div className="flex size-[62%] items-center justify-center rounded-full ">
                                                <Image
                                                    src={icon.src}
                                                    alt={icon.alt}
                                                    width={28}
                                                    height={28}
                                                    className="h-auto w-[58%] object-contain blur-[0.4px] grayscale"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .hero-two-orbit-stage {
                    transform: translateY(10px);
                }

                .hero-two-orbit-item {
                    margin-left: -28px;
                    margin-top: -28px;
                    animation: hero-two-item-orbit linear infinite;
                }

                .hero-two-icon-spin {
                    animation: hero-two-icon-spin 9s linear infinite;
                }

                @keyframes hero-two-item-orbit {
                    from {
                        transform: rotate(var(--hero-orbit-angle))
                            translateY(calc(-1 * var(--hero-orbit-radius)));
                    }
                    to {
                        transform: rotate(calc(var(--hero-orbit-angle) + 360deg))
                            translateY(calc(-1 * var(--hero-orbit-radius)));
                    }
                }

                @keyframes hero-two-icon-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    )
}

export default IconOrbit
