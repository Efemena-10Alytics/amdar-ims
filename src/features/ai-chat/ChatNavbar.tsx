'use client';

import React from 'react';

interface ChatNavbarProps {
  onOpenHistory?: () => void;
  showMessages?: boolean;
  onToggleMessages?: () => void;
}

export const ChatNavbar: React.FC<ChatNavbarProps> = ({ onOpenHistory, showMessages, onToggleMessages }) => {
  return (
    <nav className="w-full z-20" style={{ backgroundColor: '#156374' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 h-20">
          <div className="flex items-center gap-5">
            <div className="shrink-0">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_2491_69877)">
                <g clipPath="url(#clip0_2491_69877)">
                  <rect x="4.80078" y="1.60156" width="64" height="64" rx="32" fill="#146374" fillOpacity="0.1" shapeRendering="crispEdges"/>
                  <g filter="url(#filter1_f_2491_69877)">
                    <circle cx="23.4674" cy="21.8698" r="10.6667" fill="#6D33BA"/>
                  </g>
                  <g filter="url(#filter2_f_2491_69877)">
                    <circle cx="52.2682" cy="43.2018" r="10.6667" fill="#E8CC76"/>
                  </g>
                  <path d="M24 45.7482L37.3672 20L50.4 46.4" stroke="white" strokeWidth="5.28" strokeMiterlimit="2.61313" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </g>
              <defs>
                <filter id="filter0_d_2491_69877" x="0.000781178" y="0.00156248" width="73.6" height="73.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="1.6" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_2491_69877"/>
                  <feOffset dy="3.2"/>
                  <feGaussianBlur stdDeviation="1.6"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.0823529 0 0 0 0 0.388235 0 0 0 0 0.454902 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2491_69877"/>
                  <feBlend mode="normal" in="BackgroundImageFix" in2="effect1_dropShadow_2491_69877" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                </filter>
                <filter id="filter1_f_2491_69877" x="-13.8659" y="-15.4635" width="74.6654" height="74.6654" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="13.3333" result="effect1_foregroundBlur_2491_69877"/>
                </filter>
                <filter id="filter2_f_2491_69877" x="14.9349" y="5.86849" width="74.6654" height="74.6654" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="13.3333" result="effect1_foregroundBlur_2491_69877"/>
                </filter>
                <clipPath id="clip0_2491_69877">
                  <rect x="4.80078" y="1.60156" width="64" height="64" rx="32" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-6 py-3 rounded-3xl transition-colors"
            style={{ backgroundColor: '#FFFFFF', color: '#156374' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 9.99809C17.5 11.463 17.0711 12.8958 16.2661 14.1197C15.4611 15.3436 14.3153 16.305 12.9701 16.8851C11.625 17.4652 10.1394 17.6387 8.69683 17.3842C7.25421 17.1297 5.91772 16.4582 4.85234 15.4528C4.79263 15.3964 4.74462 15.3287 4.71105 15.2537C4.67748 15.1788 4.65901 15.0979 4.65668 15.0158C4.65436 14.9336 4.66824 14.8519 4.69752 14.7751C4.7268 14.6984 4.77092 14.6281 4.82734 14.5684C4.9413 14.4478 5.0985 14.3774 5.26435 14.3727C5.34648 14.3704 5.42825 14.3843 5.50501 14.4136C5.58177 14.4429 5.65201 14.487 5.71172 14.5434C6.60527 15.3864 7.72742 15.9474 8.93796 16.1562C10.1485 16.3651 11.3938 16.2126 12.5181 15.7178C13.6425 15.223 14.5961 14.4078 15.2598 13.3741C15.9236 12.3404 16.2679 11.134 16.25 9.90574C16.232 8.67744 15.8524 7.48167 15.1587 6.46785C14.465 5.45403 13.488 4.66712 12.3496 4.20543C11.2112 3.74375 9.96203 3.62777 8.75812 3.87198C7.5542 4.1162 6.44895 4.70978 5.58047 5.57856C5.30469 5.85747 5.04531 6.13169 4.79297 6.40434L6.06719 7.68091C6.1547 7.76832 6.2143 7.87972 6.23846 8.00103C6.26261 8.12233 6.25023 8.24807 6.20289 8.36234C6.15554 8.4766 6.07536 8.57425 5.97249 8.64292C5.86962 8.71159 5.74869 8.74819 5.625 8.74809H2.5C2.33424 8.74809 2.17527 8.68225 2.05806 8.56504C1.94085 8.44782 1.875 8.28885 1.875 8.12309V4.99809C1.8749 4.87441 1.91151 4.75348 1.98017 4.6506C2.04884 4.54773 2.14649 4.46755 2.26076 4.4202C2.37502 4.37286 2.50076 4.36048 2.62207 4.38464C2.74337 4.40879 2.85478 4.4684 2.94219 4.55591L3.90625 5.52153C4.15781 5.24887 4.41719 4.97466 4.69219 4.69731C5.74069 3.64702 7.07723 2.93141 8.53262 2.64105C9.98801 2.35068 11.4968 2.49863 12.8681 3.06616C14.2394 3.63369 15.4114 4.59529 16.236 5.82924C17.0605 7.06319 17.5004 8.51402 17.5 9.99809ZM10 5.62309C9.83424 5.62309 9.67527 5.68894 9.55806 5.80615C9.44085 5.92336 9.375 6.08233 9.375 6.24809V9.99809C9.37497 10.106 9.40287 10.2121 9.45599 10.306C9.50911 10.3999 9.58563 10.4785 9.67812 10.534L12.8031 12.409C12.8735 12.4513 12.9515 12.4793 13.0327 12.4914C13.1139 12.5035 13.1967 12.4995 13.2764 12.4797C13.356 12.4598 13.431 12.4244 13.497 12.3756C13.563 12.3267 13.6187 12.2653 13.6609 12.195C13.7032 12.1246 13.7312 12.0466 13.7433 11.9654C13.7554 11.8842 13.7514 11.8014 13.7316 11.7217C13.7117 11.6421 13.6763 11.5671 13.6275 11.5011C13.5786 11.4351 13.5173 11.3794 13.4469 11.3372L10.625 9.64419V6.24809C10.625 6.08233 10.5592 5.92336 10.4419 5.80615C10.3247 5.68894 10.1658 5.62309 10 5.62309Z" fill="#156374"/>
            </svg>
            <span className="font-medium">See chat history</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="#B6CFD4"/>
              <path d="M15.3538 12.3541L10.3538 17.3541C10.2838 17.4242 10.1947 17.4718 10.0977 17.4912C10.0006 17.5105 9.90002 17.5006 9.8086 17.4627C9.71719 17.4248 9.63908 17.3607 9.58414 17.2784C9.5292 17.1961 9.49992 17.0993 9.5 17.0004V7.00039C9.49992 6.90145 9.5292 6.8047 9.58414 6.7224C9.63908 6.64011 9.71719 6.57596 9.8086 6.53808C9.90002 6.50021 10.0006 6.4903 10.0977 6.50963C10.1947 6.52895 10.2838 6.57664 10.3538 6.64664L15.3538 11.6466C15.4002 11.6931 15.4371 11.7482 15.4623 11.8089C15.4874 11.8696 15.5004 11.9347 15.5004 12.0004C15.5004 12.0661 15.4874 12.1312 15.4623 12.1919C15.4371 12.2526 15.4002 12.3077 15.3538 12.3541Z" fill="#092A31"/>
            </svg>
          </button>

              {/* Temporary Toggle Switch */}
            {onToggleMessages && (
              <button
                onClick={onToggleMessages}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: showMessages ? '#FFE082' : '#B6CFD4',
                  color: '#092A31'
                }}
              >
                {showMessages ? 'Show Empty State' : 'Show Messages'}
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};
