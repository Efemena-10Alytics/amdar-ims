import PaymentMain from "@/components/_core/payment";

const STEPS = [
  { id: "checkout", label: "Checkout", active: true },
  { id: "personal", label: "Personal Details", active: false },
  { id: "payment", label: "Payment", active: false },
];

export default function PaymentPage() {
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
        <PaymentMain />
      </div>
    </div>
  );
}
