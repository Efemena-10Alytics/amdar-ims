"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollToTopOnRoute = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Preserve default behavior for hash navigation within the same page.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRoute;
