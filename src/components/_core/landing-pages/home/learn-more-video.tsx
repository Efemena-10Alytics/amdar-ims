"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player";

interface LearnMoreVideoProps {
  showPopUpVid: boolean;
  setShowPopUpVid: React.Dispatch<React.SetStateAction<boolean>>;
}

const VID_URL = "https://www.youtube.com/watch?v=kifEHRJmOKw";

const LearnMoreVideo = ({ setShowPopUpVid, showPopUpVid }: LearnMoreVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showPopUpVid) setIsLoading(true);
  }, [showPopUpVid]);

  const handleVideoReady = () => setIsLoading(false);

  return (
    <Dialog open={showPopUpVid} onOpenChange={setShowPopUpVid}>
      <DialogContent
        className="max-w-[90vw] w-[90vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-none"
        showCloseButton={true}
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="hidden lg:block w-full aspect-video max-h-[80vh] rounded-lg overflow-hidden relative">
            {isLoading && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-lg"
                aria-hidden
              >
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            )}
            <ReactPlayer
              src={VID_URL}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              onReady={handleVideoReady}
              onStart={handleVideoReady}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
              }}
            />
          </div>
          <div className="lg:hidden w-full aspect-video max-h-[70vh] rounded-lg overflow-hidden relative">
            {isLoading && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-lg"
                aria-hidden
              >
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            )}
            <ReactPlayer
              src={VID_URL}
              playing={showPopUpVid}
              controls={true}
              width="100%"
              height="100%"
              onReady={handleVideoReady}
              onStart={handleVideoReady}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreVideo;
