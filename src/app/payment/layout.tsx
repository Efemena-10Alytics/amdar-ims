// import OffersStrip from "@/components/_core/landing-pages/shared/iwd-banner/offers-strip";
import Navbr from "@/components/_core/landing-pages/shared/navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbr />
      {/* <OffersStrip /> */}
      <div className="pt-10">{children}</div>
    </div>
  );
};

export default LandingPageLayout;
