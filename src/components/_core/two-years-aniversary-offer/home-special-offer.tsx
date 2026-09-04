"use client";

import { useEffect, useState } from "react";
import { SpecialOfferModal } from "@/components/_core/two-years-aniversary-offer/modal";

const SPECIAL_OFFER_STORAGE_KEY = "amdari-special-offer-dismissed";

export default function HomeSpecialOffer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPECIAL_OFFER_STORAGE_KEY) === "true") return;
    } catch {
      // ignore (e.g. private mode)
    }

    const timer = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      try {
        sessionStorage.setItem(SPECIAL_OFFER_STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }
  };

  return <SpecialOfferModal open={open} onOpenChange={handleOpenChange} />;
}
