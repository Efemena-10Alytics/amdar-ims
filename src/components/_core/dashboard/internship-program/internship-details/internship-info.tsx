"use client";

import { cn } from "@/lib/utils";

export type InternshipInfoData = {
    program?: string;
    skillLevel?: string;
    location?: string;
    gender?: string;
    howDidYouHear?: string;
    reasonForDecision?: string;
    sessionOfDecision?: string;
    weeklyCommitment?: string;
};

const DEFAULT_INTERNSHIP_INFO: Required<InternshipInfoData> = {
    program: "Project Management",
    skillLevel: "Expert",
    location: "UK",
    gender: "Female",
    howDidYouHear: "Friend",
    reasonForDecision: "Select for decision",
    sessionOfDecision: "LinkedIn session",
    weeklyCommitment: "4 hours",
};

type InternshipInfoFieldProps = {
    label: string;
    value?: string;
    placeholder?: string;
};

function InternshipInfoField({
    label,
    value,
    placeholder = "—",
}: InternshipInfoFieldProps) {
    const displayValue = value?.trim() || placeholder;
    const isPlaceholder = !value?.trim();

    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-sm font-medium text-[#64748B]">{label}</p>
            <div
                className={cn(
                    "flex min-h-10 items-center rounded-lg bg-white px-3 py-2.5 text-sm",
                    isPlaceholder ? "text-[#94A3B8]" : "text-[#092A31]",
                )}
            >
                {displayValue}
            </div>
        </div>
    );
}

export type InternshipInfoProps = {
    info?: InternshipInfoData;
};

const InternshipInfo = ({ info }: InternshipInfoProps) => {
    const data = { ...DEFAULT_INTERNSHIP_INFO, ...info };

    return (
        <section className="bg-white p-4 rounded-2xl border border-[#E2E8F0]">
            <div className="rounded-2xl  bg-[#E8EFF1] p-4 sm:p-5">
                <h2 className="text-base font-semibold text-[#092A31] sm:text-lg">
                    Internship details
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
                    <InternshipInfoField label="Your Program" value={data.program} />
                    <InternshipInfoField label="Your skill level" value={data.skillLevel} />
                    <InternshipInfoField label="Internship location" value={data.location} />
                    <InternshipInfoField label="Your gender" value={data.gender} />
                    <InternshipInfoField
                        label="How did you hear about Amdari?"
                        value={data.howDidYouHear}
                    />
                    <InternshipInfoField
                        label="Reason for decision"
                        value={data.reasonForDecision}
                        placeholder="Select for decision"
                    />
                    <InternshipInfoField
                        label="Session of decision"
                        value={data.sessionOfDecision}
                    />
                    <InternshipInfoField
                        label="How much time can you commit weekly?"
                        value={data.weeklyCommitment}
                    />
                </div>
            </div>
        </section>
    );
};

export default InternshipInfo;
