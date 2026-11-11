/**
 * Body copy for a role's detail page.
 *
 * The Figma file only specifies the Data Analysis Associate write-up, so that
 * one is reproduced verbatim and every other role reuses the same sections
 * with its own title woven into the intro. Swap this for the HR endpoint once
 * real descriptions exist.
 */

export type JobDescriptionSection = {
  heading: string;
  bullets: string[];
};

export type JobDescription = {
  intro: string[];
  sections: JobDescriptionSection[];
};

export function getJobDescription(roleTitle: string): JobDescription {
  return {
    intro: [
      `Amdari is seeking a curious, analytical, and detail-oriented ${roleTitle} to join its team on a contract basis. The successful candidate will work with data from Amdari's learning platforms, internship programs, and internal operations to uncover insights, track performance, and support data-driven decision-making.`,
      `Reporting to the relevant team lead, the ${roleTitle} will collect, clean, analyse, and visualise data while working closely with Product, Growth, Finance, Operations, and other teams. The role is ideal for someone who enjoys turning raw data into clear insights that help teams understand what is working, identify problems, and make better decisions.`,
    ],
    sections: [
      {
        heading: "Key Responsibilities",
        bullets: [
          "Collect, clean, organise, and analyse data from Amdari's platforms, programs, and internal operations.",
          "Build and maintain dashboards, reports, and data visualisations that communicate key business and program metrics.",
          "Use tools such as Excel/Google Sheets, SQL, Power BI, Tableau, or Looker Studio to analyse and present data.",
          "Identify trends, patterns, anomalies, and opportunities within learner, internship, product, financial, and operational data.",
          "Work with Product, Operations, Growth, Finance, and other teams to define metrics and provide actionable insights.",
          "Track learner engagement, program performance, completion rates, assessments, and other key internship metrics.",
          "Support data-driven evaluation of Amdari programs by measuring outcomes and identifying areas for improvement.",
          "Maintain accurate documentation of datasets, dashboards, reports, and analysis processes.",
          "Perform ad-hoc analysis and prepare clear reports or presentations for internal stakeholders.",
          "Ensure data is handled responsibly, accurately, and with appropriate attention to privacy and security.",
        ],
      },
      {
        heading: "Required Qualifications (Must-haves)",
        bullets: [
          "Bachelor's degree in Data Analysis, Statistics, Mathematics, Computer Science, Economics, Business Analytics, Information Technology, or a related field or equivalent professional experience.",
          "Demonstrated experience working with data through academic projects, internships, freelance work, or professional experience.",
          "Strong proficiency in Microsoft Excel or Google Sheets, including formulas, pivot tables, charts, and data cleaning.",
          "Working knowledge of SQL and relational databases.",
          "Experience creating dashboards or visual reports using Power BI, Tableau, Looker Studio, or similar tools.",
          "Strong analytical and problem-solving skills with the ability to identify meaningful insights from data.",
          "Good understanding of basic statistics, data interpretation, and data visualisation principles.",
          "Strong attention to detail and commitment to data accuracy.",
          "Ability to communicate analytical findings clearly to both technical and non-technical stakeholders.",
        ],
      },
      {
        heading: "Preferred Qualifications (Nice to Have)",
        bullets: [
          "Experience using Python or R for data analysis.",
          "Experience working with APIs, databases, or large datasets.",
          "Familiarity with data modelling, ETL processes, or data pipelines.",
          "Experience analysing EdTech, SaaS, e-commerce, finance, marketing, or product data.",
          "Experience building automated reporting systems or recurring dashboards.",
          "Familiarity with Google Analytics, Mixpanel, Amplitude, or similar product/marketing analytics platforms.",
          "Previous experience working within a technology, product, or data-focused team.",
        ],
      },
      {
        heading: "Success Measures",
        bullets: [
          "Deliver accurate and actionable reports and dashboards that support Amdari's business and operational decisions.",
          "Maintain high data accuracy across recurring reports, dashboards, and analysis.",
          "Provide timely insights into learner engagement, program performance, conversion, retention, and outcomes.",
          "Help teams identify performance gaps and opportunities through meaningful data analysis.",
          "Successfully support reporting for every learner cohort and internship program.",
          "Reduce manual reporting through improved dashboards, automation, and reusable analytical processes.",
          "Translate complex datasets into clear, practical recommendations that stakeholders can act on.",
        ],
      },
      {
        heading: "Why Join Amdari",
        bullets: [
          "Your analysis directly shapes careers — the insights you uncover help Amdari improve the learning and internship experience for aspiring tech professionals.",
          "Work at the intersection of Data, EdTech, Product, and Career Development, gaining exposure to real-world business problems and diverse datasets.",
          "Join a collaborative team where your analysis can directly influence products, programs, learner outcomes, and business decisions.",
          "Get hands-on experience working with real data, dashboards, analytics tools, and cross-functional teams.",
          "Work in an environment where you can grow your technical and analytical skills while contributing to projects with measurable impact.",
        ],
      },
    ],
  };
}
