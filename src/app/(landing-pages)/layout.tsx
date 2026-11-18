"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Aos from "aos";
import Faq from "@/components/_core/landing-pages/home/faq";
import Footer from "@/components/_core/landing-pages/shared/footer";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import ScrollToTopOnRoute from "@/components/_core/landing-pages/shared/scroll-to-top-on-route";

const LandingPageLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const hideFaq =
    pathname === "/job-board" || pathname === "/faqs" || pathname === "/hr-job-listing";

  // Soft navigations remount page content while shared chrome stays mounted.
  // AOS leaves [data-aos] at opacity:0 until refresh re-binds observers.
  useEffect(() => {
    Aos.init({ once: true, duration: 600 });
    const timer = window.setTimeout(() => Aos.refresh(), 100);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="overflow-x-clip">
      <ScrollToTopOnRoute />
      <Navbar />
      <div>{children}</div>
      {!hideFaq && <Faq />}
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
