import type { Metadata } from "next";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import Footer from "@/components/_core/landing-pages/shared/footer";
import TreasureHuntRegisterForm from "@/components/_core/treasure-hunt/register-form";

export const metadata: Metadata = {
  title: "Treasure Hunt Registration",
  description:
    "Register for the Amdari treasure hunt and claim your assigned treasure.",
};

export default function TreasureHuntRegisterPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* <Navbar /> */}
      <TreasureHuntRegisterForm />
      {/* <Footer /> */}
    </main>
  );
}
