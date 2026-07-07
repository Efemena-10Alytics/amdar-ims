const TAKEAWAYS = [
  "How did the company's business context shape your design decisions? What would you change if this were a startup vs. an enterprise?",
  "Brand identity is a communication system, not just a visual style. How did every element you designed serve a strategic purpose?",
  "Enterprise clients evaluate design through the lens of risk - how did you build trust signals into your work?",
];

export default function Lessons() {
  return (
    <section className="space-y-6 pt-1">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">
          Key takeaways and reflection prompts
        </h3>

        <ul className="space-y-1 text-lg leading-relaxed text-[#173740]">
          {TAKEAWAYS.map((item, index) => (
            <li key={`${item.slice(0, 30)}-${index}`} className="flex gap-2">
              <span className="mt-[8px] text-[#173740]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Summary</h3>
        <p className="text-xl leading-relaxed text-[#173740]">
          This project gave interns hands-on experience producing enterprise-grade
          brand identity work under realistic constraints - a defined business
          brief, a tight timeline, and stakeholder presentation requirements. The
          skills and portfolio artefacts developed here directly map to
          day-one expectations in brand and product design roles.
        </p>
      </div>
    </section>
  );
}
