import IWDBanner from "@/components/_core/landing-pages/shared/iwd-banner";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbar />
      <IWDBanner />
      <div className="pt-10">{children}</div>
    </div>
  );
};

export default LandingPageLayout;
