import { EmptyScheduleIllustration } from "./icons";

export function EmptyScheduleState() {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="w-full max-w-140 overflow-hidden">
        <EmptyScheduleIllustration />
      </div>
      <h3 className="font-sora text-xl font-semibold text-[#092A31]">
        No Active Payment Plan
      </h3>
      <p className="max-w-90 font-sora text-base leading-[1.4] text-[#64748B]">
        You made a one time payment.
      </p>
    </div>
  );
}
