/**
 * Highlighted Black Friday perks shown on the OffersCard and in rotating pills.
 */
export const BLACK_FRIDAY_OFFERS = [
  "The 10-Application Sprint",
  "Skilled Worker Sponsorship Pack",
  "Global Talent Visa Evidence Map",
  "CV to Job Matching",
] as const;

export type BlackFridayOffer = (typeof BLACK_FRIDAY_OFFERS)[number];

/**
 * Career-support perks bundled with the internship.
 *
 * Single source for the payment page offers strip and sidebar card, and the
 * offer dialog — keep the order, it is the order they are shown in.
 */
export const INTERNSHIP_OFFERS = [
  ...BLACK_FRIDAY_OFFERS,
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
