"use client";

import { useEffect, useState } from "react";
import { SpecialOfferModal } from "@/components/_core/two-years-aniversary-offer/modal";
import {
  dismissSpecialOffer,
  getSpecialOfferDismissed,
  setSpecialOfferModalOpen,
} from "@/components/_core/two-years-aniversary-offer/special-offer-visibility";

export default function HomeSpecialOffer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getSpecialOfferDismissed()) return;

    const timer = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSpecialOfferModalOpen(open);
    return () => setSpecialOfferModalOpen(false);
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      dismissSpecialOffer();
    }
  };

  return <SpecialOfferModal open={open} onOpenChange={handleOpenChange} />;
}
