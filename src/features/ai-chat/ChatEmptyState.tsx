import React from 'react';

export const ChatEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center mb-8">
      <div className="mb-6">
        <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_2491_69726)">
            <g clipPath="url(#clip0_2491_69726)">
              <rect x="6" y="2" width="80" height="80" rx="40" fill="#146374" fillOpacity="0.4" shapeRendering="crispEdges"/>
              <g filter="url(#filter1_f_2491_69726)">
                <circle cx="29.3333" cy="27.3333" r="13.3333" fill="#6D33BA"/>
              </g>
              <g filter="url(#filter2_f_2491_69726)">
                <circle cx="65.3333" cy="54.0013" r="13.3333" fill="#E8CC76"/>
              </g>
              <path d="M30 57.1852L46.709 25L63 58" stroke="#005E6C" strokeWidth="6.6" strokeMiterlimit="2.61313" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </g>
          <defs>
            <filter id="filter0_d_2491_69726" x="0" y="0" width="92" height="92" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_2491_69726"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.0823529 0 0 0 0 0.388235 0 0 0 0 0.454902 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2491_69726"/>
              <feBlend mode="normal" in="BackgroundImageFix" in2="effect1_dropShadow_2491_69726" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            </filter>
            <filter id="filter1_f_2491_69726" x="-17.3333" y="-19.3333" width="93.3346" height="93.3346" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="16.6667" result="effect1_foregroundBlur_2491_69726"/>
            </filter>
            <filter id="filter2_f_2491_69726" x="18.6667" y="7.33463" width="93.3346" height="93.3346" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="16.6667" result="effect1_foregroundBlur_2491_69726"/>
            </filter>
            <clipPath id="clip0_2491_69726">
              <rect x="6" y="2" width="80" height="80" rx="40" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: '#0C3640' }}>
        How can I assist you today?
      </h1>

      <p className="text-base md:text-lg leading-relaxed" style={{ color: '#64748B' }}>
        Hi there, I'm Zee I am available to chat with you 24/7<br />
        & assist you on any internship related questions
      </p>
    </div>
  );
};
