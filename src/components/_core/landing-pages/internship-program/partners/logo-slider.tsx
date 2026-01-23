"use client";

import Image from "next/image";

const LogoSlider = () => {
  const partners = [
    {
      name: "AssetGuard",
      logo: "/images/svgs/partners-logo/asset-guard.svg",
    },
    {
      name: "Credify",
      logo: "/images/svgs/partners-logo/credify.svg",
    },
    {
      name: "CryptoNest",
      logo: "/images/svgs/partners-logo/cryptonest.svg",
    },
    {
      name: "EcoNest",
      logo: "/images/svgs/partners-logo/eco-nest.svg",
    },
  ];

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="max-w-225 mx-auto overflow-hidden">
      <div className="relative">
        {/* Continuous scrolling animation */}
        <div 
          className="flex"
          style={{
            animation: 'scroll 12s linear infinite',
            width: 'fit-content',
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-1/2 md:w-1/4 px-2 md:px-4"
            >
              <div className="relative w-full h-20 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
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

export default LogoSlider;
