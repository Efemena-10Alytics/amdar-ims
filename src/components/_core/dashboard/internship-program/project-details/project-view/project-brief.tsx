const businessContextItems = [
  {
    title: "High Tenant Churn Rate",
    description:
      "The company faces elevated tenant turnover rates, resulting in increased operational costs and lost revenue.",
  },
  {
    title: "Current Tenant Insights",
    description:
      "Home/Herbs Properties lacks actionable insights into tenant demographics, maintenance requests, and leasing behavior.",
  },
  {
    title: "Inefficient Lease Renewal",
    description:
      "The lease renewal process is plagued by inefficiencies, contributing to tenant dissatisfaction and attrition.",
  },
  {
    title: "Lack of Trend Identification",
    description:
      "Identifying trends and patterns affecting tenant retention is difficult, hindering the development of effective retention strategies.",
  },
];

const projectPurposeItems = [
  {
    title: "High Tenant Churn Rate",
    description:
      "The company faces elevated tenant turnover rates, resulting in increased operational costs and lost revenue.",
  },
  {
    title: "Current Tenant Insights",
    description:
      "Home/Herbs Properties lacks actionable insights into tenant demographics, maintenance requests, and leasing behavior.",
  },
  {
    title: "Inefficient Lease Renewal",
    description:
      "The lease renewal process is plagued by inefficiencies, contributing to tenant dissatisfaction and attrition.",
  },
  {
    title: "Lack of Trend Identification",
    description:
      "Identifying trends and patterns affecting tenant retention is difficult, hindering the development of effective retention strategies.",
  },
];

const expectedOutcomesItems = [
  {
    title: "High Tenant Churn Rate",
    description:
      "The company faces elevated tenant turnover rates, resulting in increased operational costs and lost revenue.",
  },
  {
    title: "Current Tenant Insights",
    description:
      "Home/Herbs Properties lacks actionable insights into tenant demographics, maintenance requests, and leasing behavior.",
  },
  {
    title: "Inefficient Lease Renewal",
    description:
      "The lease renewal process is plagued by inefficiencies, contributing to tenant dissatisfaction and attrition.",
  },
  {
    title: "Lack of Trend Identification",
    description:
      "Identifying trends and patterns affecting tenant retention is difficult, hindering the development of effective retention strategies.",
  },
];


function TitledBulletList({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <ul className="space-y-1  leading-relaxed text-[#173740]">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="flex gap-1.5 lis">
          <div className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
          <span>
            <span className="font-semibold">{item.title}:</span> {item.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectBrief() {
  return (

    <section className="space-y-5 pt-1 text-[#173740]">
      <div className="space-y-2">
        <h3 className="font-semibold text-[#173740] text-xl">Project summary</h3>
        <h4 className="font-semibold text-[#092A31] text-base">Business Introduction</h4>
        <p className="leading-relaxed text-[#092A31]">
          Home/Herbs Properties, a distinguished presence in the real estate market
          and a trusted source for an extensive portfolio of apartments,
          condominiums and single-family rentals properties around the city,
          has pioneered for over two decades in creating exceptional
          living experiences for residents and valued guests. Renowned for
          fostering vibrant communities, it rapidly evolving real estate
          landscape, the company&apos;s adaptability, meticulous attention to
          detail and unwavering pursuit of excellence have distinguished it as
          a leader in local housing.
        </p>
        <p className="leading-relaxed text-[#173740]">
          However, within the ever-changing real estate market, Home/Herbs
          Properties faces a distinct challenge - tenant attrition. To address
          this critical concern comprehensively and unlock opportunities for
          sustainable growth, Home/Herbs Properties embarked on a journey to
          leverage Power BI, a powerful business intelligence tool, to develop
          an end-to-end solution. This case study delves into Home/Herbs
          Properties&apos; endeavor to create a dashboard that identifies tenant
          churn patterns and equips them with data-driven insights to
          optimize tenant retention and solidify its position as a beacon of
          excellence in the residential real estate industry.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className=" font-semibold text-[#173740]">Business context</h4>
        <TitledBulletList items={businessContextItems} />
      </div>

      <div className="space-y-2">
        <h4 className=" font-semibold text-[#173740]">Project purpose</h4>
        <p className=" leading-relaxed text-[#173740]">
          Home/Herbs Properties has identified several pressing challenges
          related to tenant retention, presented in bullet points for clarity:
        </p>
        <TitledBulletList items={projectPurposeItems} />
      </div>

      <div className="space-y-2">
        <h4 className=" font-semibold text-[#173740]">Expected outcomes</h4>
        <p className=" leading-relaxed text-[#173740]">
          Home/Herbs Properties has identified several pressing challenges
          related to tenant retention, presented in bullet points for clarity:
        </p>
        <TitledBulletList items={expectedOutcomesItems} />
      </div>
    </section>
  );
}
