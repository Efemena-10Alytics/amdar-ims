"use client";

import Image from "next/image";

const ToolsSlider = () => {
  const tools = [
    { name: "Figma", icon: "/images/svgs/tools/figma.svg" },
    { name: "Google Analytics", icon: "/images/svgs/tools/google-analytics.svg" },
    { name: "Jira", icon: "/images/svgs/tools/jira.svg" },
    { name: "Microsoft", icon: "/images/svgs/tools/microsoft.svg" },
    { name: "Salesforce", icon: "/images/svgs/tools/sales-force.svg" },
    { name: "Ubuntu", icon: "/images/svgs/tools/ubuntu.svg" },
  ];

  // Duplicate tools for seamless infinite scroll
  const duplicatedTools = [...tools, ...tools];

  return (
    <div className="w-full overflow-hidden relative">
      <div className="relative">
        {/* Continuous scrolling animation */}
        <div
          className="flex gap-4"
          style={{
            animation: "scroll 12s linear infinite",
            width: "fit-content",
          }}
        >
          {duplicatedTools.map((tool, index) => (
            <div
              key={`${tool.name}-${index}`}
              className="shrink-0 w-12 h-12 cursor-pointer rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              <Image
                src={tool.icon}
                alt={tool.name}
                width={32}
                height={32}
                className="object-contain grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
        {/* Left edge blur/fade - matches section bg #092A31 */}
        <div
          className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none bg-gradient-to-r from-[#092A31] via-[#092A31]/60 to-transparent backdrop-blur-sm"
          aria-hidden
        />
        {/* Right edge blur/fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none bg-gradient-to-l from-[#092A31] via-[#092A31]/60 to-transparent backdrop-blur-sm"
          aria-hidden
        />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `
      }} />
    </div>
  );
};

export default ToolsSlider;
