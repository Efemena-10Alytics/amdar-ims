import Faq from "@/components/_core/landing-pages/home/faq";
import Footer from "@/components/_core/landing-pages/shared/footer";
import Navbr from "@/components/_core/landing-pages/shared/navbar";
import React from "react";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbr />
      <div className="pt-20">{children}</div>
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
