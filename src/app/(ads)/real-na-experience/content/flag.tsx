"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const flagsArray = [
  "/images/svgs/ads/cad.svg",
  "/images/svgs/ads/usa.svg",
];

const Flag = ({ width = 32 }: { width?: number }) => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % flagsArray.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const leftFlag = flagsArray[startIndex];
  const rightFlag = flagsArray[(startIndex + 1) % flagsArray.length];

  return (
    <div className="flex">
      <Image
        src={leftFlag}
        height={width}
        width={width}
        alt={startIndex === 0 ? "Canada" : "UK"}
      />
      <Image
        src={rightFlag}
        height={width}
        width={width}
        alt={startIndex === 0 ? "UK" : "Canada"}
        className="-translate-x-2"
      />
    </div>
  );
};

export default Flag;
