import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <p className="font-sora text-sm text-[#64748B]">Amdari</p>
        <h1 className="font-clash-display text-3xl font-semibold text-[#092A31]">
          Page not found
        </h1>
        <p className="font-sora text-sm text-[#64748B]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/home"
          className="mt-2 rounded-xl bg-[#0F4652] px-5 py-3 font-sora text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
