/** Placeholder for the sidebar sections that have no design yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="px-4 py-8 lg:px-8">
      <h1 className="font-clash-display text-4xl font-semibold text-[#092A31]">{title}</h1>
      <p className="mt-2 text-base text-[#64748B]">
        This section has not been designed yet. The dashboard and the create-a-job flow are live.
      </p>
    </div>
  );
}
