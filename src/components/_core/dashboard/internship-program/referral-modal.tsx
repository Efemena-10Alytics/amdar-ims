"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ReferralModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem("referralModalClosed");

    if (isClosed !== "true") {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    localStorage.setItem("referralModalClosed", "true");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex h-screen w-full items-center justify-center bg-[#0B0D0F]/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-ads-modal"
      onClick={handleClose}
    >
      <div
        className="flex aspect-943/581 w-11/12 max-w-[943px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={'/ref-flyer.webp'} alt="Referral Flyer" width={943} height={581} className="w-full h-full object-cover cursor-pointer" onClick={(e: React.MouseEvent) => { window.open('https://wa.me/2348160395002', '_blank'); handleClose(e); }} />
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex items-center justify-center size-11 bg-white rounded-full border border-green-950 text-green-950 cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
