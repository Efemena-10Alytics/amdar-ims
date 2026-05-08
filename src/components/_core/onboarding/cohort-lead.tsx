"use client";
import Image from "next/image";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LEADS = [
  {
    name: "Agada Queen (Specialist)",
    phone: "+234 821342134",
    image: "/images/pngs/about/efe.png",
  },
  {
    name: "Agada Queen (Lead)",
    phone: "+234 821342134",
    image: "/images/pngs/about/adeiza.png",
  },
  {
    name: "Agada Queen (Support)",
    phone: "+234 821342134",
    image: "/images/pngs/about/omowunmi.png",
  },
];

const CohortLead = () => {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <section className="w-full max-w-190 py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">Your Program Leads &amp; Support</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Save your leads contact</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEADS.map((lead) => (
            <article key={lead.name} className="relative overflow-hidden rounded-2xl">
              <div className="relative h-80">
                <Image src={lead.image} alt={lead.name} fill className="object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 left-0 bg-black/55 px-3 py-2.5 backdrop-blur-[1px]">
                <p className="text-xs font-semibold text-[#DFEEF2]">{lead.name}</p>
                <div className="mt-0.5 flex items-center justify-between gap-3">
                  <p className="text-xs text-[#BCD2D8]">{lead.phone}</p>
                  <button
                    type="button"
                    className="text-[#D6E8ED] transition hover:text-white"
                    aria-label={`Copy ${lead.name} number`}
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(event) => setIsConfirmed(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">I confirm that I know who to reach out to</span>
        </label>
      </article>

      <button
        type="button"
        disabled={!isConfirmed}
        onClick={() => router.push("/onboarding?step=internship-rules")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default CohortLead;
