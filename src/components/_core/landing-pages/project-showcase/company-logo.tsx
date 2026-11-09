export type CompanyMark = "google" | "apex" | "spectrum";

export function CompanyLogo({ mark }: { mark: CompanyMark }) {
  if (mark === "google") {
    return (
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.48h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.17 3.56-8.75Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.94H1.28v3.1A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.3A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.3V6.6H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.14 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4 3.1C6.23 6.87 8.88 4.77 12 4.77Z"
        />
      </svg>
    );
  }

  if (mark === "apex") {
    return (
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E7EEF2]"
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="size-3.5">
          <path d="M8 2.2 13.2 13H2.8L8 2.2Z" fill="#5B6C86" />
        </svg>
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
      <path d="M12 2a10 10 0 0 1 10 10H12V2Z" fill="#FBBC05" />
      <path d="M22 12a10 10 0 0 1-10 10V12h10Z" fill="#34A853" />
      <path d="M12 22A10 10 0 0 1 2 12h10v10Z" fill="#4285F4" />
      <path d="M2 12A10 10 0 0 1 12 2v10H2Z" fill="#EA4335" />
    </svg>
  );
}
