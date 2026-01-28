import Navbr from "@/components/_core/landing-pages/shared/navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbr />
      <div className="pt-20">{children}</div>
    </div>
  );
};

export default LandingPageLayout;
