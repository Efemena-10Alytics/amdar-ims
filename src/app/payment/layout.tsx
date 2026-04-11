import IWDBanner from "@/components/_core/landing-pages/shared/iwd-banner";
import Navbr from "@/components/_core/landing-pages/shared/navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbr />
      {/* <IWDBanner
        registeredCount={24}
        viewingNow={87}
        slotsLeft={6}
        offersHref="/internship"
      /> */}
      <div className="pt-10">{children}</div>
    </div>
  );
};

export default LandingPageLayout;
