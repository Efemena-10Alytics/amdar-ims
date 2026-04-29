import type { Metadata } from "next";
import CVReviewForm from "@/components/_core/cv-review/CVReviewForm";
import Navbar from "@/components/_core/landing-pages/shared/new-navbar";
import Footer from "@/components/_core/landing-pages/shared/footer";

export const metadata: Metadata = {
  title: "CV Review & Revamp",
  description:
    "Submit your CV for an expert AI-powered review tailored to your target role and industry.",
};

export default function CVReviewPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <CVReviewForm />
      <Footer />
    </main>
  );
}
