import React from "react";
import gsap from "gsap";

const WordDrop = () => {
  const headlineRef = React.useRef<HTMLDivElement>(null);
  const HEADLINE_WORDS = ["Gain", "Work", "Experience", "Through"];

  React.useEffect(() => {
    const words = headlineRef.current?.querySelectorAll(".hero-word");
    if (!words?.length) return;

    gsap.fromTo(
      words,
      {
        y: -40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
  }, []);
  return (
    <div ref={headlineRef} className="inline-block">
      {HEADLINE_WORDS.map((word) => (
        <h1 key={word} className="hero-word font-clash-display inline-block mr-[0.25em]">
          {word}
        </h1>
      ))}
    </div>
  );
};

export default WordDrop;
