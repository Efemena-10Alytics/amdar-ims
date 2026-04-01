import React from "react";
import Faq from "@/components/_core/landing-pages/home/faq";
import Footer from "@/components/_core/landing-pages/shared/footer";
import Navbr from "@/components/_core/landing-pages/shared/navbar";
import HeroTwoNavbar from "@/components/_core/landing-pages/shared/navbar/hero-two-navbar";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <HeroTwoNavbar />
      <div className="">{children}</div>
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
