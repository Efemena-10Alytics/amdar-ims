import { ReferralEmptyIllustration } from "./icons";

export function EmptyReferralState() {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="w-full max-w-140 overflow-hidden">
        <ReferralEmptyIllustration />
      </div>
      <h3 className="font-sora text-xl font-semibold text-[#092A31]">No referees yet</h3>
      <p className="max-w-120 font-sora text-base leading-[1.4] text-[#64748B]">
        Every friend or family member who joins through your link earns you reward. Your
        first referral is one share away.
      </p>
    </div>
  );
}
