"use client";

import { useParams, useSearchParams } from "next/navigation";
import PaymentMain from "@/components/_core/payment";
import { PaymentSuccessModal } from "@/components/_core/payment/payment-success-modal";
import { useGetInternshipProgram } from "@/features/internship/use-get-internship-program";
import { useGetCheckoutData } from "@/features/payment/use-get-checkout-data";
import { DEFAULT_PROMO_CODE } from "@/components/_core/payment/coupon";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string | undefined;
  const promoCode = searchParams.get("promo_code") ?? DEFAULT_PROMO_CODE;
  const statusSuccess = searchParams.get("status") === "success";
  const sessionId = searchParams.get("session_id") ?? null;

  const { data: program, isLoading, error } = useGetInternshipProgram(id);
  const {
    data: checkoutData,
    isLoading: isCheckoutLoading,
    error: checkoutError,
  } = useGetCheckoutData(program?.slug, promoCode);

  const showSuccessModal = statusSuccess && !!sessionId?.trim();

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
    <div className="min-h-screen bg-white mt-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
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
        />
      </div>
      <PaymentSuccessModal
        open={showSuccessModal}
        programSlug={program?.slug}
        sessionId={sessionId}
      />
    </div>
  );
}
