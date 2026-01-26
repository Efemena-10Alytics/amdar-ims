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
    <div className="w-full overflow-hidden">
      <div className="relative">
        {/* Continuous scrolling animation */}
        <div 
          className="flex gap-4"
          style={{
            animation: 'scroll 12s linear infinite',
            width: 'fit-content',
          }}
        >
          {duplicatedTools.map((tool, index) => (
            <div
              key={`${tool.name}-${index}`}
              className="shrink-0 w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              <Image
                src={tool.icon}
                alt={tool.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          ))}
        </div>
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
