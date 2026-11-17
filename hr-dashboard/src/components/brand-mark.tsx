/** The Amdari wordmark used in the sidebar header. */
export function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="14" fill="#092A31" />
        <path
          d="M8.5 19.5 14 8.5l5.5 11"
          stroke="#2EC4B6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-clash-display text-xl font-semibold tracking-[0.18em] text-[#092A31]">
        AMDARI
      </span>
    </span>
  );
}
