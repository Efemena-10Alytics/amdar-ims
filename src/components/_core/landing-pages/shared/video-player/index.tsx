import { LoaderPinwheelIcon, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

type VideoPlayerProps = {
  vidUrl: string;
  heighT: number | string;
  widtH: number | string;
  thumbNail?: string | boolean;
  alt?: boolean;
  hidePlayBtn?: boolean;
  vidPlaying: boolean;
  setVidPlaying: (playing: boolean) => void;
  clrVar?: boolean;
  loading?: boolean;
  onStart?: () => void;
  onEnded?: () => void;
  dashVidPlayer?: boolean;
  startcompAlt?: unknown;
};

const VideoPlayer = ({ vidUrl, heighT, widtH, thumbNail, alt, hidePlayBtn, vidPlaying, setVidPlaying, clrVar, loading, onStart, onEnded, dashVidPlayer, startcompAlt }: VideoPlayerProps) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const videoHeight = windowWidth > 1422 ? 650 : 450;

  return (
    <div>
      <ReactPlayer
        src={vidUrl}
        controls={true}
        width={"600px"}
        height={"600px"}
        playing={vidPlaying}
        light={thumbNail}
        onStart={onStart}
        onEnded={onEnded}
        // style={style}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          boxShadow:
            "0px 4px 4px 0px hsla(0, 0%, 0%, 0.55)",
        }}
        playIcon={
          alt ? (
            <div style={{ border: "" }} className={`${hidePlayBtn ? "hidden" : "flex"} items-center justify-center w-[77.16px] h-[77.16px] bg-[#757a7d] rounded-full z-10`} onClick={() => setVidPlaying(true)}>
              <Play size="18" color={"#101828"} />
            </div>
          ) : (
            <>
              {loading ? (
                <LoaderPinwheelIcon size='large' />
              ) : (
                <div style={{ border: clrVar ? "2px solid #fff" : "2px solid #B1FD55" }} className={`${hidePlayBtn ? "hidden" : "flex"} items-center justify-center w-[43.33px] h-[43.33px] bg-transparent rounded-full z-10`} onClick={() => setVidPlaying(true)}>
                  <Play size="20" color={clrVar ? "#fff" : "#B1FD55"} />
                </div>
              )}
            </>
          )
        }
      />
    </div>
  )
}

export default VideoPlayer
