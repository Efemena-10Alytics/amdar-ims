interface GainProps {
  gain?: string | null;
}

const Gain = ({ gain }: GainProps) => {
  const hasGainHtml = gain && gain.trim().length > 0;
  if (hasGainHtml) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#092A31] mb-6">
          What you’ll gain
        </h2>
        <div
          className="space-y-4 text-[#64748B] [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-1 [&_h3]:text-[#092A31] [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
          dangerouslySetInnerHTML={{ __html: gain }}
        />
      </div>
    );
  }

  return null;
};

export default Gain;
