// import OffersStrip from "@/components/_core/landing-pages/shared/iwd-banner/offers-strip";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbar />
      {/* <OffersStrip /> */}
      <div className="pt-10">{children}</div>
    </div>
  );
};

export default LandingPageLayout;
