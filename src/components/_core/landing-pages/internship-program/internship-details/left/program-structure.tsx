const overviewContent = {
  "Who Is This For?": `Entry-level DevOps engineers with foundational cloud or system knowledge,Recent graduates of DevOps, Cloud Engineering, or SRE programs Software engineers transitioning into DevOps or Cloud roles IT professionals seeking hands-on experience in cloud infrastructure and automation`,

  "High Demand": `The demand for DevOps professionals continues to surge as organizations prioritize faster deployment cycles, improved system reliability, and scalable infrastructure. According to industry reports, DevOps and Site Reliability Engineering (SRE) roles are among the fastest-growing positions in tech, with job postings increasing year over year.`,
  "Competitive Salaries": `DevOps engineers command some of the highest salaries in the tech industry due to their cross-functional expertise. They bridge the gap between development and operations, making them invaluable to organizations seeking to optimize their software delivery pipelines and infrastructure management.`,
  "Diverse Opportunities": `DevOps skills are applicable across virtually every industry—from fintech and SaaS to e-commerce, healthtech, enterprise IT, telecoms, logistics, and government digital infrastructure. This versatility means you can work in sectors that align with your interests and values.`,
  "Impactful Work": `DevOps engineers play a critical role in enabling faster product delivery, system stability, and scalability. Your work directly impacts uptime, performance, security, and reliability—factors that can make or break a company's success in today's competitive market.`,
};

const ProgramStructure = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#092A31] mb-6">
        Program Structure
      </h2>

      {/* Who Is This For? */}

      <div className="space-y-8 text-[#64748B]">
        <div>
          <h3 className="text-xl font-medium  mb-1">Who Is This For?</h3>
          <p className=" leading-relaxed">
            {overviewContent["Who Is This For?"]}
          </p>
        </div>

        {/* High Demand */}
        <div>
          <h3 className="text-xl font-medium mb-1">High Demand</h3>
          <p className="leading-relaxed">{overviewContent["High Demand"]}</p>
        </div>

        {/* Competitive Salaries */}
        <div>
          <h3 className="text-xl font-medium mb-1">Competitive Salaries</h3>
          <p className="leading-relaxed">
            {overviewContent["Competitive Salaries"]}
          </p>
        </div>

        {/* Diverse Opportunities */}
        <div>
          <h3 className="text-xl font-medium mb-1">Diverse Opportunities</h3>
          <p className="leading-relaxed">
            {overviewContent["Diverse Opportunities"]}
          </p>
        </div>

        {/* Impactful Work */}
        <div>
          <h3 className="text-xl font-medium mb-1">Impactful Work</h3>
          <p className="leading-relaxed">{overviewContent["Impactful Work"]}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramStructure;
