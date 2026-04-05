import React from "react";
import Faq from "@/components/_core/landing-pages/home/faq";
import Footer from "@/components/_core/landing-pages/shared/footer";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
