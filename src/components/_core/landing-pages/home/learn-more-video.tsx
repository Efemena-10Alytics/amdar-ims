"use client";

import React from "react";
import { VideoPlayerModal } from "../shared/video-player-modal";

interface LearnMoreVideoProps {
  showPopUpVid: boolean;
  setShowPopUpVid: React.Dispatch<React.SetStateAction<boolean>>;
}

const VID_URL = "https://vimeo.com/1165333664?fl=ml&fe=ec";

const LearnMoreVideo = ({
  setShowPopUpVid,
  showPopUpVid,
}: LearnMoreVideoProps) => {
  return (
    <VideoPlayerModal
      open={showPopUpVid}
      onOpenChange={setShowPopUpVid}
      videoUrl={VID_URL}
      title="Learn more"
      transparent
    />
  );
};

export default LearnMoreVideo;
