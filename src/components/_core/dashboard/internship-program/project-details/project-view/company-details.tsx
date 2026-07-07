const businessChallengeItems = [
  "High Tenant Churn Rates: The company faces elevated tenant turnover rates, resulting in increased operational costs and lost revenue.",
  "Limited Tenant Insights: HomeVibe Properties lacks actionable insights into tenant satisfaction and their concerns, making it challenging to proactively address issues.",
  "Inefficient Lease Renewals: The lease renewal process is plagued by inefficiencies, contributing to tenant dissatisfaction and administrative overhead.",
  "Lack of Trend Identification: Identifying trends and patterns affecting tenant retention is difficult, hindering the development of effective retention strategies.",
];

const rationaleItems = [
  "High Tenant Churn Rates: The company faces elevated tenant turnover rates, resulting in increased operational costs and lost revenue.",
  "Limited Tenant Insights: HomeVibe Properties lacks actionable insights into tenant satisfaction and their concerns, making it challenging to proactively address issues.",
  "Inefficient Lease Renewals: The lease renewal process is plagued by inefficiencies, contributing to tenant dissatisfaction and administrative overhead.",
  "Lack of Trend Identification: Identifying trends and patterns affecting tenant retention is difficult, hindering the development of effective retention strategies.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 leading-relaxed text-[#173740]">
      {items.map((item, index) => (
        <li key={`${item.slice(0, 24)}-${index}`} className="flex gap-1.5">
          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[#173740]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CompanyDetails() {
  return (
    <section className="space-y-6 pt-1">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Company overview</h3>
        <h4 className="text-base font-semibold text-[#173740]">
          Business Introduction
        </h4>
        <p className="leading-relaxed text-[#173740]">
          HomeVibe Properties, a distinguished presence in the residential real
          estate sector, boasts an extensive portfolio of apartment complexes and
          single-family rental properties across multiple cities. Renowned for
          their commitment to providing exceptional housing solutions, HomeVibe
          Properties has consistently delivered quality living experiences,
          fostering vibrant communities. In a rapidly evolving real estate
          landscape, the company&apos;s adaptability, meticulous attention to detail,
          and unwavering pursuit of excellence have established it as a leader in
          the industry.
        </p>
        <p className="leading-relaxed text-[#173740]">
          However, within the ever-changing real estate market, HomeVibe
          Properties faces a distinct challenge - tenant retention. To address
          this critical concern comprehensively and unlock opportunities for
          sustainable growth, HomeVibe Properties embarked on a journey to
          leverage Power BI, a powerful business intelligence tool, to develop an
          end-to-end solution. This case study delves into HomeVibe Properties&apos;
          strategic utilization of Power BI, outlining the entire workflow from
          data collection to an interactive dashboard, aimed at optimizing tenant
          retention and solidifying its position as a beacon of excellence in the
          residential real estate industry.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-semibold text-[#173740]">Business challenge</h4>
        <p className="leading-relaxed text-[#173740]">
          HomeVibe Properties has identified several pressing challenges related to
          tenant retention, presented in bullet points for clarity:
        </p>
        <BulletList items={businessChallengeItems} />
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-semibold text-[#173740]">
          Rationale for this project
        </h4>
        <p className="leading-relaxed text-[#173740]">
          HomeVibe Properties has identified several pressing challenges related to
          tenant retention, presented in bullet points for clarity:
        </p>
        <BulletList items={rationaleItems} />
      </div>
    </section>
  );
}
