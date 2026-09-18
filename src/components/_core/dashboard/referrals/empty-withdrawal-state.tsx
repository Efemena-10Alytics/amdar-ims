import { ReferralEmptyIllustration } from "./icons";

export function EmptyWithdrawalState() {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="w-full max-w-140 overflow-hidden">
        <ReferralEmptyIllustration />
      </div>
      <h3 className="font-sora text-xl font-semibold text-[#092A31]">
        No withdrawal has been yet.
      </h3>
      <p className="max-w-100 font-sora text-base leading-[1.4] text-[#64748B]">
        Tell your friends and families about Amdari today!
      </p>
    </div>
  );
}
