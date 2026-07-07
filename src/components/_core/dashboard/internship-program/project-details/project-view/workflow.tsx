const PHASES = [
  {
    title: "Phase 1",
    description:
      "HomeVibe Properties, a distinguished presence in the residential real estate sector, boasts an extensive portfolio of apartment complexes and single-family rental properties across multiple cities. Renowned for their commitment to providing exceptional housing solutions, HomeVibe Properties has consistently delivered quality living experiences, fostering vibrant communities. In a rapidly evolving real estate landscape, the company's adaptability, meticulous attention to detail, and unwavering pursuit of excellence have established it as a leader in the industry.",
  },
  {
    title: "Phase 2",
    description:
      "HomeVibe Properties, a distinguished presence in the residential real estate sector, boasts an extensive portfolio of apartment complexes and single-family rental properties across multiple cities. Renowned for their commitment to providing exceptional housing solutions, HomeVibe Properties has consistently delivered quality living experiences, fostering vibrant communities. In a rapidly evolving real estate landscape, the company's adaptability, meticulous attention to detail, and unwavering pursuit of excellence have established it as a leader in the industry.",
  },
  {
    title: "Phase 3",
    description:
      "HomeVibe Properties, a distinguished presence in the residential real estate sector, boasts an extensive portfolio of apartment complexes and single-family rental properties across multiple cities. Renowned for their commitment to providing exceptional housing solutions, HomeVibe Properties has consistently delivered quality living experiences, fostering vibrant communities. In a rapidly evolving real estate landscape, the company's adaptability, meticulous attention to detail, and unwavering pursuit of excellence have established it as a leader in the industry.",
  },
];

export default function Workflow() {
  return (
    <section className="space-y-5 pt-1">
      {PHASES.map((phase) => (
        <article key={phase.title} className="space-y-2">
          <h3 className="text-3xl font-semibold text-[#173740]">{phase.title}</h3>
          <p className="text-xl leading-relaxed text-[#173740]">{phase.description}</p>
        </article>
      ))}
    </section>
  );
}
