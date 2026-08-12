/**
 * Outcome guarantees rotated through the band at the bottom of the checkout
 * enrollment card.
 *
 * Order matters — the first entry is what a visitor sees on load.
 */
export const INTERNSHIP_GUARANTEES = [
  "Guaranteed to get job interview in 4 – 6 weeks of program",
  "You will get UK / US / CAD Reference Letter",
  "Life time support for job applications and access to our platform",
  "6 out of 10 interns land a job within 4 months",
  "9 out of 10 interns land a job within 7 months",
  "85% of our interns get at least 2 interviews within 4 weeks",
  "Lifetime access to Projects, videos, e.t.c",
  "3 Guaranteed interviews after 4 months and you don't get a job",
] as const;

export type InternshipGuarantee = (typeof INTERNSHIP_GUARANTEES)[number];
