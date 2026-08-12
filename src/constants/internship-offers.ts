/**
 * Career-support perks bundled with the internship.
 *
 * Single source for the payment page offers strip and sidebar card, and the
 * offer dialog — keep the order, it is the order they are shown in.
 */
export const INTERNSHIP_OFFERS = [
  "CV Review & Revamp",
  "LinkedIn Optimization",
  "Navigating the Job Market",
  "Interview Prep session",
  "Mentorship & Career Coaching",
  "UK / US / CAD Reference Letter",
  "On-the-job Support",
  "Lifetime Career Support",
] as const;

export type InternshipOffer = (typeof INTERNSHIP_OFFERS)[number];
