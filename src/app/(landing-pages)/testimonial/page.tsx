import type { Metadata } from "next";
import TestimonialsSection from "@/components/_core/landing-pages/testimonial/testimonials-section";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from Amdari interns who have gone on to secure roles across the UK, US, Canada, and Africa.",
};

const TestimonialPage = () => {
  return <TestimonialsSection />;
};

export default TestimonialPage;
