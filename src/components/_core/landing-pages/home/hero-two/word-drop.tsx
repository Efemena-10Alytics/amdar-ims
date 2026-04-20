import React from "react";
import gsap from "gsap";

const WordDrop = () => {
  const headlineRef = React.useRef<HTMLDivElement>(null);
  const HEADLINE_WORDS = ["Gain", "Real", "World", "Experience", "Through"];

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
        <React.Fragment key={word}>
          <h1 className="hero-word font-clash-display inline-block mr-[0.25em]">
            {word}
          </h1>
          {word === "World" ? <br /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WordDrop;
