"use-client";

const AIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_8762_19751)">
      <g clipPath="url(#clip0_8762_19751)">
        <rect
          x="3.60156"
          y="1.19922"
          width="48"
          height="48"
          rx="24"
          fill="#146374"
          fillOpacity="0.4"
        />
        <g filter="url(#filter1_f_8762_19751)">
          <circle cx="17.6016" cy="16.3984" r="8" fill="#6D33BA" />
        </g>
        <g filter="url(#filter2_f_8762_19751)">
          <circle cx="39.2031" cy="32.3984" r="8" fill="#E8CC76" />
        </g>
        <path
          d="M18 34.3111L28.0254 15L37.8 34.8"
          stroke="#005E6C"
          strokeWidth="3.96"
          strokeMiterlimit="2.61313"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_8762_19751"
        x="0.00156236"
        y="-0.000781298"
        width="55.2"
        height="55.2"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1.2"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_8762_19751"
        />
        <feOffset dy="2.4" />
        <feGaussianBlur stdDeviation="1.2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0823529 0 0 0 0 0.388235 0 0 0 0 0.454902 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_8762_19751"
        />
        <feBlend
          mode="normal"
          in="BackgroundImageFix"
          in2="effect1_dropShadow_8762_19751"
          result="BackgroundImageFix"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_f_8762_19751"
        x="-10.3984"
        y="-11.6016"
        width="56"
        height="56"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="10"
          result="effect1_foregroundBlur_8762_19751"
        />
      </filter>
      <filter
        id="filter2_f_8762_19751"
        x="11.2031"
        y="4.39844"
        width="56"
        height="56"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="10"
          result="effect1_foregroundBlur_8762_19751"
        />
      </filter>
      <clipPath id="clip0_8762_19751">
        <rect
          x="3.60156"
          y="1.19922"
          width="48"
          height="48"
          rx="24"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);

export interface Job {
  id: string;
  company: string;
  flag: string; // emoji or image path
  location: string;
  title: string;
  type: string; // "Remote · Full-time · $150k - $250k"
  openFrom: string;
  openTo: string;
}

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div className="flex h-[297px] flex-col justify-between rounded-xl bg-[#F8FAFC] p-6">
      <div>
        <div className="flex items-center gap-2">
          <AIcon />
          <div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="font-sora text-sm font-semibold uppercase text-[#0C3640]">
                {job.company}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-sora text-sm text-[#64748B]">
              <img
                src={"/uk-flag.png"}
                alt="flag"
                className="h-4 w-4 object-contain"
              />
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        <h3 className="mt-4 font-sora text-xl font-semibold text-[#0C3640]">
          {job.title}
        </h3>
        <p className="mt-1 font-sora text-sm text-[#64748B]">{job.type}</p>
      </div>

      <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
        <p className="font-sora text-xs text-[#64748B]">
          Open from {job.openFrom}
          <br />
          to {job.openTo}
        </p>
        <button
          type="button"
          className="rounded-xl bg-[#156374] px-5 py-3 font-sora text-sm text-white transition-opacity hover:opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;
