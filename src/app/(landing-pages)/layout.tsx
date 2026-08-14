"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Faq from "@/components/_core/landing-pages/home/faq";
import Footer from "@/components/_core/landing-pages/shared/footer";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import ScrollToTopOnRoute from "@/components/_core/landing-pages/shared/scroll-to-top-on-route";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const hideFaq = pathname === "/job-board";

  return (
    <div className="overflow-x-hidden">
      <ScrollToTopOnRoute />
      <Navbar />
      <div>{children}</div>
      {!hideFaq && <Faq />}
      <Footer />
    </div>
  );
};

export default LandingPageLayout;