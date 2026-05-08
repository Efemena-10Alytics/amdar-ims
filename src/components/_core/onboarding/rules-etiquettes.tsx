"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ETIQUETTE_BLOCKS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const RulesEtiquettes = () => {
  const router = useRouter();
  const [confirmRules, setConfirmRules] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);

  const canContinue = useMemo(
    () => confirmRules && confirmTerms,
    [confirmRules, confirmTerms],
  );

  return (
    <section className="w-full max-w-190 overflow-y-auto! py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">Your Program Etiquettes &amp; Rules</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          Read through your ground rules, compliance and etiquettes
        </h2>

        <div className="mt-4 rounded-xl bg-[#E9EEF2] max-h-[50vh] overflow-y-auto p-3">
          {ETIQUETTE_BLOCKS.map((text, index) => (
            <div key={index} className={index > 0 ? "mt-3" : ""}>
              <h3 className="text-sm font-semibold text-[#2D6A78]">
                Read through your ground rules, compliance and etiquettes
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[#506572]">{text}</p>
            </div>
          ))}
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmRules}
            onChange={(event) => setConfirmRules(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I confirm and agree with the rules and Etiquettes
          </span>
        </label>

        <label className="mt-2 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmTerms}
            onChange={(event) => setConfirmTerms(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">
            I have read the <span className="text-[#2D6A78]">Amdari Terms &amp; Policies</span>{" "}
            attached above and I agree.
          </span>
        </label>
      </article>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => router.push("/onboarding?step=installation-videos")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default RulesEtiquettes;
