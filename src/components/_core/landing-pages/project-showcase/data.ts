import type { CompanyMark } from "./company-logo";

export type ProjectStatus = "Active" | "Completed";

export type ShowcaseTab =
  | "brief"
  | "company"
  | "scope"
  | "tech"
  | "workflow"
  | "lesson";

export type ShowcaseSection = {
  heading: string;
  body: string;
  /** When set, shows a "Read more >>>" link to `/internship`. */
  more?: string | boolean;
};

export type ShowcaseProject = {
  id: string;
  title: string;
  description: string;
  careerTrack: string;
  category: string;
  duration: string;
  status: ProjectStatus;
  mark: CompanyMark;
  image: string;
  contributor: string;
  skills: string[];
  tabs: Record<ShowcaseTab, ShowcaseSection[]>;
};

export const SHOWCASE_TABS: { id: ShowcaseTab; label: string }[] = [
  { id: "brief", label: "Project brief" },
  { id: "company", label: "Company details" },
  { id: "scope", label: "Scope" },
  { id: "tech", label: "Tech stacks" },
  { id: "workflow", label: "Work flow" },
  { id: "lesson", label: "Lesson" },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "tenant-retention-optimization-building-an-interactive-power-bi-dashboard-for",
    title:
      "Tenant Retention Optimization: Building an Interactive Power BI Dashboard for.",
    description:
      "This project focuses on developing a data-driven cement demand forecasting system for Midlands Infrastructure Group (MIG) Ltd.",
    careerTrack: "Data Science",
    category: "Civil Engineering and Construction",
    duration: "3 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/business-testimonial/meeting.jpg",
    contributor: "Daniel Olusesi",
    skills: [
      "Time-Series Analysis",
      "Machine Learning Modelling",
      "Feature Engineering",
      "Dashboarding",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "This project focuses on developing a data-driven cement demand forecasting system for Midlands Infrastructure Group (MIG) Ltd. Using historical consumption, planned pours, inventory levels, and weather data, the solution will predict cement requirements across multiple construction sites and support efficient inventory management.",
        },
        {
          heading: "Business context",
          body: "MIG operates multiple construction sites where cement availability directly impacts project timelines and operational costs. Existing manual forecasting methods contribute to stockouts, overstocking, material wastage, and emergency deliveries. The company needs a more reliable forecasting approach to improve procurement planning and maintain uninterrupted construction operations.",
        },
        {
          heading: "Project purpose",
          body: "The purpose of this project is to build a predictive system that forecasts cement demand across sites and cement types over an eight-week horizon. By combining operational, inventory, and weather variables, the system will enable proactive procurement, optimized silo utilization,",
          more: "reduced emergency deliveries, and more reliable construction schedules across MIG's multi-site operations.",
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "Midlands Infrastructure Group (MIG) Ltd. Company Name: Midlands Infrastructure Group (MIG) Ltd. Headquarters / Location: Birmingham, United Kingdom. Founded: 1994. Industry: Civil Engineering and Construction.",
        },
        {
          heading: "Background",
          body: "MIG has experienced significant operational expansion over three decades: 2000s — Expanded into multi-site operations, establishing regional operational hubs. 2012 — Standardized planning processes and cost coding to improve coordination between site operations and commercial teams. 2018 — Established framework agreements with leading cement suppliers to improve material availability and supply stability. 2021 — Introduced digital operational tools, including weighbridge integration and electronic proof",
          more: "of delivery, giving procurement and site teams a shared view of cement movements and stock positions.",
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "This project establishes measurable objectives designed to address MIG's demand forecasting and inventory management challenges. Each objective connects predictive modelling with practical operational improvements.",
        },
        {
          heading: "Objective 1: Develop Accurate Cement Demand Forecasts",
          body: "Build forecasting models that predict cement consumption across individual construction sites and cement types over an eight-week horizon. Target: Achieve a Mean Absolute Percentage Error (MAPE) of 15% or less for site-level forecasts.",
        },
        {
          heading: "Objective 2: Improve Construction Readiness",
          body: "Use predicted demand and inventory information to anticipate cement requirements before scheduled concrete pours. Target: Achieve at least 98% pour readiness, measured by the availability of sufficient cement for scheduled pours.",
        },
        {
          heading: "Objective 3: Optimize Inventory Utilization",
          body: "Translate forecast outputs into inventory guidance that balances silo capacity, supplier lead times, and pour schedules.",
          more: "Reduce excess stock and emergency deliveries while keeping sites ready for planned pours.",
        },
      ],
      tech: [
        {
          heading: "SQLite",
          body: "How to install",
        },
        {
          heading: "Python, Numpy, Pandas",
          body: "How to install · Click to download",
        },
        {
          heading: "Statsmodels, Scikit-learn",
          body: "How to install · Click to download",
        },
        {
          heading: "Plotly, Dash",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "Project phase",
          body: "The project follows a structured analytical workflow covering data preparation, forecasting, inventory optimization, and application development.",
        },
        {
          heading: "Step 1: Data Ingestion & Validation",
          body: "Import the Cement_Demand dataset from SQLite into Python. Validate the schema, inspect missing values, identify duplicates, and assess data consistency.",
        },
        {
          heading: "Step 2: Data Cleaning & Preparation",
          body: "Address missing and negative values, validate inventory movements, reconcile stock balances, and prepare consistent analytical datasets.",
        },
        {
          heading: "Step 3: Exploratory Data Analysis",
          body: "Analyze consumption patterns across sites and cement types. Investigate seasonality, demand variations, and relationships between weather conditions and planned pours.",
        },
        {
          heading: "Step 4: Feature Engineering",
          body: "Prepare forecasting variables using historical consumption, planned pours, rainfall, temperature, and relevant time-based features.",
        },
        {
          heading: "Step 5: Forecasting Model",
          body: "Train and evaluate forecasting models for site-level and cement-type demand over the eight-week horizon.",
          more: "Compare model error against the MAPE target, then use the best-performing forecasts to support inventory guidance and the interactive dashboard.",
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "This project demonstrates how time-series forecasting and machine learning can address practical supply chain challenges in construction. By integrating operational, inventory, and weather data, businesses can improve demand visibility, optimize material availability, reduce waste, and make proactive procurement decisions. It highlights the value of translating predictive analytics into actionable business intelligence.",
        },
        {
          heading: "Summary",
          body: "The cement demand forecasting project provides a foundation for smarter, data-driven inventory management across construction sites. By combining predictive modelling, inventory simulation, and interactive visualization, the proposed solution supports operational efficiency and better resource allocation. Ultimately, it demonstrates how data science can transform complex operational challenges into measurable business opportunities.",
        },
      ],
    },
  },
  {
    id: "operational-efficiency-and-patient-outcome-analysis-at-harbor-medical-center",
    title:
      "Operational Efficiency and Patient Outcome Analysis at Harbor Medical Center",
    description:
      "Harbor Medical Center wants a clearer view of how patient admissions, doctor visits and vital-sign records relate to hospital performance.",
    careerTrack: "Data Analysis",
    category: "Healthcare",
    duration: "2 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/new-home/the-impact/project-1.png",
    contributor: "Adedola Elumaro",
    skills: [
      "Power Query/Data Cleaning",
      "Data modelling",
      "DAX",
      "KPI Interpretation",
      "Dashboard Design",
      "Analytical Thinking",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Harbor Medical Center wants a clearer view of how patient admissions, doctor visits and vital-sign records relate to hospital performance. Consultants will use Power BI to extract valuable insights and recommendations from four healthcare datasets.",
        },
        {
          heading: "Business context",
          body: "Hospitals collect valuable patient and operational information, but disconnected records can make it difficult to identify delays, understand workload or assess care outcomes. The project focuses on making this information easier to examine and explain.",
        },
        {
          heading: "Project purpose",
          body: "To develop an interactive Power BI report that brings together patient, admission, doctor-visit and vital-sign data and helps management identify trends, operational challenges and areas for improvement.",
          more: true,
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "Harbor Medical Center is an European multi-specialty healthcare provider serving urban and semi-urban communities. It provides services across areas such as Emergency, Cardiology, Pulmonology and Internal Medicine, supported by electronic patient records.",
        },
        {
          heading: "Business challenge",
          body: "Hospital leaders need better visibility into patient demand, repeated admissions, slow doctor responses, differences between departments and unusual vital-sign readings. The available data exists in separate files, making a combined view difficult.",
        },
        {
          heading: "Rationale for this project",
          body: "Bringing the datasets into a shared analytical model will help teams monitor trends, investigate bottlenecks and make more informed decisions. This is a learning case study using historical extracts; it is not a live clinical monitoring system.",
          more: true,
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "1. Prepare and connect the four supplied datasets in Power BI. 2. Analyse admissions, recorded readmission outcomes, doctor responsiveness and vital-sign patterns. 3. Compare departmental admission volumes and patient outcomes. 4. Develop clear interactive report pages and evidence-based recommendations.",
          more: true,
        },
      ],
      tech: [
        {
          heading: "Power BI",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "Project phase",
          body: "The project follows a Power BI workflow from connecting the four healthcare datasets through cleaning, modelling, KPI definition and interactive hospital operations reporting.",
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "Accurate reporting starts with understanding the business question and the meaning of each field. Cleaning should preserve valid information and make assumptions visible. A sound model prevents duplicate counting and supports reliable filtering. KPIs are useful only when their definitions, denominators and limitations are clear. The best dashboards answer business questions, not just attractive charts.",
        },
        {
          heading: "Summary",
          body: "On completion of this project, consultants will have worked through a complete Power BI project relevant to businesses in the healthcare sector, from the raw data to an interactive hospital operations dashboard. The emphasis is on explaining decisions clearly, validating the results and making responsible recommendations based on what the data supports.",
          more: true,
        },
      ],
    },
  },
  {
    id: "developing-a-customer-satisfaction-and-retention-analytics-dashboard-to-improve-customer-experience-at-largence",
    title:
      "Developing a Customer Satisfaction and Retention Analytics Dashboard to Improve Customer Experience at Largence",
    description:
      "Largence is a UK-focused LegalTech platform designed to modernise legal operations by providing legal professionals with a unified workspace to create, manage, review, collaborate on, and execute legal documents.",
    careerTrack: "Project Management",
    category: "LegalTech",
    duration: "2 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/business-testimonial/collab.jpg",
    contributor: "Nendelwa Bupwatda",
    skills: [],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Largence is a UK-focused LegalTech platform designed to modernise legal operations by providing legal professionals with a unified workspace to create, manage, review, collaborate on, and execute legal documents. Following improvements to its legal workflow capabilities, Largence is focused on understanding whether customers are achieving continuous value from the platform. As a growing SaaS organisation, customer satisfaction and retention are critical to long-term success. While Largence provides advanced capabilities such as AI-assisted drafting, workflow management, compliance support, collaboration tools, and document execution processes, the company requires better visibility into customer experience after adoption. This project focuses on developing a Customer Satisfaction and Retention Analytics Dashboard that enables Largence to monitor customer health, understand user engagement, identify dissatisfaction trends, and proactively address churn risks. The project will combine project management and business analysis practices to gather requirements, analyse customer experience challenges, define key performance indicators (KPIs), and develop a dashboard framework that supports customer success decision-making.",
          more: true,
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "Largence is a UK-focused LegalTech platform designed to modernise legal operations by providing a unified workspace for legal professionals to create, manage, review, collaborate on, and execute legal documents. It addresses fragmented workflows and disconnected tools in the legal sector to improve document visibility and efficiency. The platform provides a centralized legal operating environment and combines AI-assisted legal capabilities with structured workflows.",
        },
        {
          heading: "Founding & Growth",
          body: "Largence was founded to address inefficiencies within traditional legal workflows where organizations still operated through disconnected systems.",
          more: true,
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "1. Analyse customer satisfaction levels and feedback trends. 2. Identify factors influencing customer retention and churn. 3. Evaluate customer engagement with Largence platform features. 4. Develop customer experience KPIs and measurement criteria. 5. Create a customer satisfaction and retention dashboard.",
          more: true,
        },
      ],
      tech: [
        {
          heading: "Power BI",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "1. Project Charter",
          body: "Project overview, business objectives, scope definition, stakeholder identification, and success criteria.",
        },
        {
          heading: "2. Project Plan",
          body: "Timeline, milestones, responsibilities, and dependencies.",
          more: true,
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "This project enables Largence to move from simply delivering a LegalTech platform to actively understanding and improving customer experience. By developing a customer satisfaction and retention dashboard, Largence gains better visibility into customer health, engagement levels, and potential churn risks. The project demonstrates how Project Management and Business Analysis practices can work together to transform customer data into actionable business improvements, supporting stronger customer relationships, improved retention, and sustainable SaaS growth.",
        },
        {
          heading: "Summary",
          body: "10. Lessons Learnt — The Largence Customer Satisfaction and Retention Analytics Dashboard Project provides valuable lessons in project management, business analysis, customer experience management, and data-driven decision-making.",
          more: true,
        },
      ],
    },
  },
  {
    id: "housing-repair-service-improvement-project",
    title: "Housing Repair Service Improvement Project",
    description:
      "Westbridge Borough Council is a local authority based in the West Midlands, England. Established in 1978, the council has served its community for 48 years and provides essential public services to approximately 280,000 residents.",
    careerTrack: "Business Analysis",
    category: "Construction",
    duration: "3 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/new-home/the-impact/project-2.png",
    contributor: "Oluchi Ibeh",
    skills: [
      "Business Problem Analysis",
      "Stakeholder Analysis",
      "Requirements Elicitation",
      "Requirements Analysis",
      "Requirements Prioritisation",
      "Process Analysis",
      "Process Modelling",
      "Root Cause Analysis",
      "Gap Analysis",
      "User Story Writing",
      "Acceptance Criteria Definition",
      "UAT Planning",
      "Requirements Traceability",
      "Consulting Mindset",
      "Collaboration",
      "Presentation Skill",
      "Facilitation & Workshop Skills",
      "Stakeholder Communication",
      "Problem-Solving",
      "Critical Thinking",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Westbridge Borough Council is a local authority based in the West Midlands, England. Established in 1978, the council has served its community for 48 years and provides essential public services to approximately 280,000 residents. Its Housing Services Department manages around 42,000 council-owned properties and receives over 60,000 repair requests each year. The council is currently experiencing challenges within its housing repair service. Residents have reported delays, limited repair updates and difficulties tracking the progress of their requests. Internally, staff rely on manual processes, manage a high volume of repair enquiries and sometimes work with incomplete repair information. Management also has limited visibility into service performance, repair trends, and the key factors driving delays. As part of its Digital Housing Transformation Programme, the council wants to review the current repair journey, understand the challenges affecting service delivery and identify opportunities to improve the experience for both residents and staff. To support this initiative, the Business Analysis and Project Management teams have been engaged to work collaboratively. The Business Analysis team will investigate the current repair process, understand stakeholder needs, identify business challenges and",
          more: true,
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "Westbridge Borough Council is a local authority based in the West Midlands, England. Established in 1978, the council has served its community for 46 years, delivering essential public services to about 280,000 residents. The council is responsible for managing a wide range of services, including housing, waste management, planning, environmental services, social care and community support. The Housing Services Department plays a key role in supporting residents by managing around 42,000 council-owned properties and overseeing more than 60,000 repair requests annually. The department works with internal teams and external maintenance contractors to ensure housing issues are reported, assessed and resolved effectively. As part of its commitment to improving public services, Westbridge Borough Council is investing in digital transformation initiatives that enhance resident experience, improve operational efficiency and enable better decision-making through improved processes and information management.",
          more: true,
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "The objective of this project is to analyse the current housing repair service at Westbridge Borough Council, identify key challenges and opportunities for improvement, and define requirements for a more efficient, resident-focused service. By working together, the BA and PM teams will: understand how the current housing repair service operates and identify the challenges affecting its delivery; identify key stakeholders involved in the repair journey and understand their needs, expectations and concerns; analyse available project and service information to understand repair volumes, timelines, service performance and resident experience; identify pain points, delays, duplication and manual effort within the current service; investigate the root causes of key problems identified through stakeholder engagement and available evidence; and define the business, user and solution requirements that the future service should address.",
          more: true,
        },
      ],
      tech: [
        {
          heading: "Confluence",
          body: "How to install · Click to download",
        },
        {
          heading: "Miro",
          body: "How to install · Click to download",
        },
        {
          heading: "Microsoft Excel",
          body: "How to install · Click to download",
        },
        {
          heading: "Jira",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "Project Stages & Team Responsibilities",
          body: "1. Kick-off & Problem Definition — BA Focus: Define the business problem; establish the project purpose, scope and success measures. PM Focus: Coordinate project initiation; agree roles and responsibilities; establish the 10-day project plan, milestones and deadlines; set up communication channels. Joint Output: Project Understanding Summary; Business Problem Statement.",
          more: true,
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "The experience has shown that effective BA work goes beyond producing documents, and it requires curiosity, critical thinking, collaboration and the ability to turn business problems into practical improvements.",
        },
        {
          heading: "Key Lessons",
          body: "1. Listen to different stakeholder perspectives. 2. Ask the right questions, and analyse before concluding.",
          more: true,
        },
      ],
    },
  },
  {
    id: "strengthening-cyber-resilience-through-phishing-email-investigation-and-response-in-healthcare-organizations",
    title:
      "Strengthening Cyber Resilience through Phishing Email Investigation and Response in Healthcare Organizations",
    description:
      "This case study simulates a phishing incident targeting MediSure Health Network, a healthcare provider that relies heavily on electronic health records (EHRs), patient portals, and digital communications.",
    careerTrack: "SOC Analysis",
    category: "Healthcare",
    duration: "2 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/new-home/the-impact/project-3.png",
    contributor: "Victoria Simon",
    skills: [
      "Header parsing and Received-chain forensics",
      "SPF, DKIM, and DMARC interpretation",
      "URL defanging and reputation lookups",
      "Risk-based prioritization under queue pressure",
      "Escalation judgment against defined criteria, including national CSOC thresholds",
      "Clear, defensible incident writing",
      "Stakeholder and handover communication",
      "Social-engineering pattern recognition",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "This case study simulates a phishing incident targeting MediSure Health Network, a healthcare provider that relies heavily on electronic health records (EHRs), patient portals, and digital communications. Students and interns will assume the role of SOC analysts investigating the phishing attempt, validating its authenticity, tracing impact through Splunk logs, and producing actionable reports and awareness content.",
        },
        {
          heading: "Business context",
          body: "MediSure Health Network is a leading healthcare provider known for its strong use of digital technology. This strength also makes it a prime target for cyber threats. One morning, staff received an email that looked like a vendor invoice. It seemed normal but was actually a phishing attempt designed to steal sensitive data such as patient information and financial records. The incident revealed a deeper issue: while the systems were secure, employees remained vulnerable to deception. The organization faced both immediate risk and the need for stronger long-term protection against phishing and business email compromise attacks.",
          more: true,
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "MediSure Health Network takes a proactive stance in investigating phishing attempts to safeguard patient data. The organization is moving from reactive defense to proactive resilience through structured investigation workflows and supporting technology stacks.",
        },
        {
          heading: "Business challenge",
          body: "Phishing emails continue to target employees. In one case, a suspicious email from what appeared to be a trusted medical supplier asked employees to verify an outstanding invoice, creating both an immediate risk and a longer-term need for stronger detection and response.",
          more: true,
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "The project aims to analyze, validate, and respond to the suspected phishing email, while also improving MediSure's long-term resilience against similar threats. Identify Phishing Indicators: Examine the email headers, sender information, and embedded links for signs of spoofing, domain manipulation, or suspicious payloads. Validate Sender Authenticity: Perform SPF, DKIM, and DMARC checks using DNS analysis tools to confirm or reject the legitimacy of the email's origin. Analyze Links and Attachments: Use malware analysis platforms to detect hidden payloads, trojans, or credential harvesting schemes. Correlate Network Logs: Cross-check inbound and outbound network traffic using SIEM tools to identify any connections to known malicious IP addresses or domains. Respond and Mitigate: Contain the threat by blocking domains, resetting credentials, isolating affected endpoints, and updating email security filters. Educate Employees: Develop awareness material based on findings, training staff to recognize similar attacks in the future.",
          more: true,
        },
      ],
      tech: [
        {
          heading: "mxtoolbox",
          body: "How to install · Click to download",
        },
        {
          heading: "Splunk Enterprise",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "Project Phase",
          body: "You will be provided the following: Email Header File — a real-world email header extracted from the suspicious message for SPF/DKIM/DMARC validation. Log File for Splunk — network and email server logs provided for ingestion into Splunk to track communication attempts to external servers. Educational Resources — YouTube: Phishing Attack Explained; Splunk Free Training for Security Logs; OWASP Phishing Awareness Guide. The project will be executed in seven structured phases. 1. Initial Email Review: Analyze subject lines, sender details, and message body for urgency tactics, impersonation, or embedded URLs.",
          more: true,
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "Greater confidence from patients, regulators, and stakeholders in MediSure's ability to protect sensitive information.",
        },
        {
          heading: "Key Lessons",
          body: "Phishing is not merely an IT problem; it is a business-critical challenge that directly impacts patient safety, regulatory compliance, and organizational reputation. MediSure Health Network's proactive stance in investigating and responding to this phishing attempt demonstrates its commitment to safeguarding sensitive patient data and maintaining uninterrupted medical services.",
          more: true,
        },
      ],
    },
  },
  {
    id: "enterprise-security-governance-compliance-transformation-for-safemed-innovations",
    title:
      "Enterprise Security Governance & Compliance Transformation for safemed innovations.",
    description:
      "SafeMed Innovations is a high-growth healthcare technology company founded in 2020 that provides digital care tools, currently facing governance and security gaps including a GDPR investigation and potential fines.",
    careerTrack: "GRC",
    category: "Healthcare",
    duration: "2 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/new-home/the-impact/project-4.png",
    contributor: "Azeez Rahman",
    skills: [
      "Governance",
      "Policy Development",
      "Cybersecurity fundamentals",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "SafeMed Innovations is a high-growth healthcare technology company founded in 2020 that provides digital care tools. The company is facing governance and security gaps, including a GDPR investigation and potential fines, and needs a structured transformation of its security governance and compliance practices.",
        },
        {
          heading: "Business context",
          body: "SafeMed Innovations is a high-growth healthcare technology company founded in 2020 that provides digital care tools. Rapid growth has outpaced formal security governance, leaving the organisation exposed to regulatory scrutiny and buyer security reviews.",
          more: true,
        },
      ],
      company: [
        {
          heading: "Company overview",
          body: "SafeMed Innovations. Company Name: SafeMed Innovations. Industry: Healthcare. Headquarters: London, UK. Corporate History & Evolution — Foundation Story (March 2020): Founded during COVID-19 with a focus on AI diagnostics and remote care. The founding team includes Dr. Samuel Lewis (CEO), Clara Mitchell (CTO), and Dr. Laura Rodriguez (CMO).",
          more: true,
        },
      ],
      scope: [
        {
          heading: "Project objectives",
          body: "This project focuses on transforming SafeMed Innovations' security governance, risk management, and compliance practices. Horizon 1: Immediate Survival (Months 1-3) — Objectives: Achieve compliance with GDPR and MDR to avoid regulatory fines. Key Actions: Rapid GDPR compliance review and action plan.",
          more: true,
        },
      ],
      tech: [
        {
          heading: "MS Office & Google Workspace",
          body: "How to install · Click to download",
        },
      ],
      workflow: [
        {
          heading: "Project Phase",
          body: "1. Project Initiation & Threat Landscape Brief (Days 1-2): Kick-off meetings with CISO, DPO, and CTO; develop a Project Charter; compile a Threat Landscape Brief. 2. Rapid Policy & SOP Gap Analysis (Days 3-5): Review SafeMed's existing policies against GDPR, MDR, and ISO 27001 requirements. 3. Core Policy Library Development (Days 6-10): Draft security policies and SOPs using Microsoft Word, focusing on Immediate Survival and Stabilization. 4. Draft Deliverable Review & Finalization (Days 11-13): Submit the draft Policy Library and Project Charter for leadership review and feedback. 5. Knowledge Transfer & Project Closeout (Day 14): Conduct a closeout meeting and transfer documentation.",
          more: true,
        },
      ],
      lesson: [
        {
          heading: "Key takeaways and reflection prompts",
          body: "1. Learning opportunities for the consultant (Amdari Security). 2. Navigating Crisis-Driven GRC: Experience in extreme pressure environments. 3. Applying Multi-Jurisdictional Healthcare Regulations: GDPR, EU MDR, and HIPAA compliance. 4. Translating Technical Debt into Governance Risk: Analyzing vulnerabilities like unpatched systems. 5. Strategic Policy Writing for a High-Stakes Environment: Drafting policies and SOPs. 6. Rapid Stakeholder Alignment: Identifying key stakeholders across legal, clinical, technical, and commercial teams.",
        },
        {
          heading: "Key Lessons",
          body: "Here are the key roles at SafeMed Innovations that are exposed to or impacted by this initial phase of the security transformation project: Board of Directors — The ultimate recipients of the project's justification and roadmap, as they have demanded a comprehensive security overhaul to protect the company's valuation and future.",
          more: true,
        },
      ],
    },
  },
];

export function getShowcaseProject(slug: string) {
  return SHOWCASE_PROJECTS.find((project) => project.id === slug);
}
