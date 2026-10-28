"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PaymentMain from "@/components/_core/payment";
import { useGetInternshipProgram } from "@/features/internship/use-get-internship-program";
import { useGetCheckoutData } from "@/features/payment/use-get-checkout-data";
import { resolvePromoCode } from "@/features/payment/default-promo";
import { cn } from "@/lib/utils";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string | undefined;
  const promoCode = resolvePromoCode(searchParams.get("promo_code"));
  const [isPastViewport, setIsPastViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const update = () => {
      setIsPastViewport(window.scrollY >= window.innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const { data: program, isLoading, error } = useGetInternshipProgram(id);
  const {
    data: checkoutData,
    isLoading: isCheckoutLoading,
    error: checkoutError,
  } = useGetCheckoutData(program?.slug, promoCode);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white mt-20 flex items-center justify-center">
        <p className="text-[#64748B]">Loading program...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white mt-20 flex items-center justify-center">
        <p className="text-destructive">Failed to load program. Please try again.</p>
      </div>
    );
  }

  if (isCheckoutLoading) {
    return (
      <div className="min-h-screen bg-white mt-20 flex items-center justify-center">
        <p className="text-[#64748B]">Loading checkout...</p>
      </div>
    );
  }

  if (checkoutError) {
    return (
      <div className="min-h-screen bg-white mt-20 flex items-center justify-center">
        <p className="text-destructive">Failed to load checkout. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="app-width">
        <header
          className={cn(
            "sticky z-20 mb-10 bg-white py-4 transition-[top] duration-200",
            isPastViewport ? "top-20" : "top-0",
          )}
        >
          <h1 className="font-clash-display text-3xl font-bold text-[#092A31] sm:text-4xl">
            Your Internship Enrollment
          </h1>
          <p className="mt-1 text-base text-[#4a5568]">
            Please review and fill appropriate details.
          </p>
        </header>
        <PaymentMain
          program={program ?? undefined}
          checkoutData={checkoutData ?? undefined}
          paymentPageId={id}
          navStuck={isPastViewport}
        />
      </div>
      
    </div>
  );
}
