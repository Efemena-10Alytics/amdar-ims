"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const flagsArray = [
  "/images/svgs/country/CAD.svg",
  "/images/svgs/country/NG.svg",
  "/images/svgs/country/GER.svg",
];

const Flag = ({ width = 32 }: { width?: number }) => {
  const [middleIndex, setMiddleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMiddleIndex((prev) => (prev + 1) % flagsArray.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <Image
        src={"/images/svgs/country/USA.svg"}
        height={width}
        width={width}
        alt="USA"
      />
      <Image
        src={flagsArray[middleIndex]}
        height={width}
        width={width}
        alt="Country flag"
        className="-translate-x-1.5"
      />
      <Image
        src={"/images/svgs/country/UK.svg"}
        height={width}
        width={width}
        alt="UK"
        className="-translate-x-3"
      />
    </div>
  );
};

export default Flag;
