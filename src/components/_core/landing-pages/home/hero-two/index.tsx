"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, PlayIcon } from "lucide-react";
import Aos from "aos";
import LearnMoreVideo from "../learn-more-video";
import WordDrop from "./word-drop";
import Slider from "./slider";
import Flag from "../hero/flag";
import ServiceCard from "../hero/service-card";
import IconOrbit from "./icon-orbit";
import { SpeakToExpertPopover } from "./speak-to-our-expert";
import { useGetTreasures } from "@/features/treasure-hunt/use-get-treasures";
import { TreasureHuntCongratulationsModal } from "@/components/_core/treasure-hunt/congratulations";

const InternshipHeroTwo = () => {
  const [showPopUpVid, setShowPopUpVid] = React.useState(false);
  const [treasureModal, setTreasureModal] = React.useState<"decoy" | "win" | null>(
    null,
  );
  const { data, error: treasuresError, isLoading: treasuresLoading } =
    useGetTreasures();
  const treasures = data?.treasures;
  const treasureId = treasures?.at(-1)?.id;
  const showOften = data?.hunter?.treasure_id === null;

  React.useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  return (
    <div
      id="home-hero-section"
      className="relative w-full -translate-y-36 overflow-x-hidden overflow-y-hidden text-white sm:-translate-y-38 md:-translate-y-40 lg:-translate-y-45"
    >
      {/* Primary Color Background */}
      <div className="absolute inset-0 bg-primary z-0" />
      <IconOrbit />

      <div className="relative z-10 mx-auto mt-36 max-w-325 px-4 py-10 sm:mt-38 sm:px-6 sm:py-20 md:mt-40 lg:mt-45 lg:px-8 lg:py-24">
        <div className="text-center max-w-202.5 mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-semibold mb-6 leading-12 md:leading-16">
            <WordDrop />
            <br />
            <span className="inline-block overflow-hidden h-[1.2em] relative align-middle">
              <Slider />
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10"
          >
            Join the Work Experience Platform Trusted by Aspiring Tech
            Professionals Worldwide to Build Real-World Experience and Land Your
            Dream Job{" "}
            <button
              type="button"
              className="cursor-pointer text-amdari-yellow"
              onClick={() => setTreasureModal("decoy")}
            >
              here
            </button>
            !
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <SpeakToExpertPopover side="bottom" align="end" sideOffset={12}>
              <Button
                className={cn(
                  "group bg-[#0F4652] text-white hover:bg-amdari-yellow hover:text-primary rounded-full py-6 h-12 text-base",
                  "flex items-center gap-8 px-5",
                  "transition-colors duration-300",
                )}
              >
                Speak to an Expert
                <div className="flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow group-hover:bg-primary text-primary group-hover:text-white">
                  <ArrowUpRight className="w-3! h-3! text-current" />
                </div>
              </Button>
            </SpeakToExpertPopover>
            <Button
              onClick={() => setShowPopUpVid(true)}
              className={cn(
                "group bg-[#448290] hover:bg-[#0F4652] text-white rounded-full h-12 py-6 text-base",
                "flex items-center gap-8 px-5",
                "transition-colors duration-300",
              )}
            >
              Learn more
              <div className="group-hover:bg-amdari-yellow flex h-5 w-5 rounded-full justify-center items-center bg-white border-2 border-gray-300 text-primary">
                <PlayIcon
                  className="w-3! h-3!"
                  color="#156374"
                  fill="#156374"
                />
              </div>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Flag />
            <span className="text-white/80">
              + 10K interns Across the world Got hired
              {showOften ? (
                <>
                  {" "}
                  <button
                    type="button"
                    className="cursor-pointer"
                    data-treasure-id={treasureId}
                    data-treasure-icon="true"
                    onClick={() => {
                      console.log("treasure id:", treasureId, {
                        hunter: data?.hunter,
                        treasures,
                        treasuresLoading,
                        treasuresError,
                      });
                      setTreasureModal("win");
                    }}
                  >
                    often
                  </button>
                </>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      {/* Service Cards Section */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ServiceCard
            title="Real-world Projects"
            description="Industry-relevant projects that replicate real-world challenges, helping you build practical skills."
            buttonText="Get me started"
          // dataAos="fade-down"
          // dataAosDuration="00"
          />
          <ServiceCard
            title="Work Experience Internship"
            description="Work experience internship with businesses that will connect you with global work opportunities and mentorship"
            buttonText="Apply now"
            // dataAos="fade-down"
            dataAosDuration="1000"
          />
          <ServiceCard
            title="Interview Prep"
            description="We help you prepare for interviews by revamping your CV and coaching you on acing technical questions."
            buttonText="I need this"
            // dataAos="fade-down"
            dataAosDuration="1200"
          />
        </div>
      </div>

      <LearnMoreVideo setShowPopUpVid={setShowPopUpVid} showPopUpVid={showPopUpVid} />
      <TreasureHuntCongratulationsModal
        open={treasureModal != null}
        variant={treasureModal ?? "decoy"}
        onOpenChange={(open) => {
          if (!open) setTreasureModal(null);
        }}
      />
    </div>
  );
};

export default InternshipHeroTwo;
