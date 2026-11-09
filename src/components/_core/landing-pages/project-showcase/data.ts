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
  more?: string;
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
  { id: "tech", label: "Tech scope" },
  { id: "workflow", label: "Work flow" },
  { id: "lesson", label: "Lesson" },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "cement-demand",
    title: "Cement Demand Forecasting Across Multiple Sites",
    description:
      "This project focuses on developing a data-driven cement demand forecasting system for Midlands Infrastructure Group (MIG) Ltd.",
    careerTrack: "Data Science",
    category: "Civil Engineering and Construction",
    duration: "5 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/business-testimonial/meeting.jpg",
    contributor: "Daniel Okussei",
    skills: [
      "Time-Series Analysis",
      "Machine Learning/Modelling",
      "Feature Engineering",
      "Dashboarding",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "This project focuses on developing a data-driven cement demand forecasting system for Midlands Infrastructure Group (MIG) Ltd. Using historical construction requirements, planned pours, inventory levels, and weather data, the solution will predict cement requirements across multiple construction sites and support efficient inventory management.",
        },
        {
          heading: "Business context",
          body: "MIG operates multiple construction sites where cement availability directly impacts project timelines and operational costs. Existing manual forecasting methods contribute to stockouts, overstocking, material wastage, and emergency deliveries. The company needs a more reliable forecasting approach to improve procurement planning and maintain uninterrupted construction operations.",
        },
        {
          heading: "Project purpose",
          body: "The purpose of this project is to build a predictive system that forecasts cement demand across sites and cement types over an eight-week horizon.",
          more: "By combining operational, inventory, and weather variables, the system will enable proactive procurement, optimized site utilization, and fewer emergency deliveries.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "Midlands Infrastructure Group (MIG) Ltd is a West Midlands contractor running several live civil and building sites. Cement is bought centrally, then called off by each site against its own pour calendar.",
        },
        {
          heading: "Who you work with",
          body: "The sponsor is the head of supply chain. Site managers own the pour plan, and the buyer places the weekly order. Your forecast has to be readable by all three, not only by a data team.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "Forecast weekly cement demand by site and product for an eight-week horizon. Compare that forecast with the current manual estimate, and flag sites heading for a stockout or excess yard stock.",
        },
        {
          heading: "Out of scope",
          body: "The engagement does not replace the procurement system or renegotiate supplier contracts. It hands the buyer a number they can act on every Monday.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "Work in Python with pandas and a time-series model. Features come from pour plans, on-hand inventory, delivery lead time, and weather. The output is a site-level dashboard plus a short note on model error.",
        },
      ],
      workflow: [
        {
          heading: "How the five weeks run",
          body: "Week 1 is a data audit and a baseline against the manual forecast. Weeks 2 and 3 build features and the model. Week 4 reviews error with the sponsor and drafts the dashboard. Week 5 is the handover and a one-page operating guide for the Monday order.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "A pour plan is not a fact. The useful forecast is a range the buyer can order against, with a clear note for what happens when a site schedule slips.",
        },
      ],
    },
  },
  {
    id: "harbor-medical",
    title: "Operational Efficiency and Patient Outcome Analysis",
    description:
      "Operational Efficiency and Patient Outcome Analysis at Harbor Medical Center.",
    careerTrack: "Data Analysis",
    category: "Healthcare",
    duration: "2 weeks",
    status: "Active",
    mark: "apex",
    image: "/images/pngs/new-home/the-impact/project-1.png",
    contributor: "Amaka Bello",
    skills: [
      "Exploratory Analysis",
      "KPI Design",
      "Cohort Comparison",
      "Reporting",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Harbor Medical Center wants a clear view of where patient flow slows down, and whether those delays show up in outcomes. This project turns theatre, ward, and discharge data into a small set of operational measures the leadership team can review each week.",
        },
        {
          heading: "Business context",
          body: "Beds stay occupied longer than planned, and discharge decisions are still assembled from separate ward lists. Leaders can see volume, but they cannot see which pathway, ward, or time of day is driving the delay.",
        },
        {
          heading: "Project purpose",
          body: "Build an analysis that links flow measures to outcome measures, so the hospital can choose one operational change to test next.",
          more: "The deliverable is a baseline pack: where time is lost, which patient groups are most affected, and which metric should be watched if a change is piloted.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "Harbor Medical Center is a regional hospital with inpatient wards, a day-surgery unit, and a busy emergency department. Operations and the clinical director share ownership of patient flow.",
        },
        {
          heading: "Who you work with",
          body: "You work with the flow lead and a ward manager. Clinical detail stays inside the hospital's existing records. The analysis uses aggregated pathway data, not identifiable patient notes.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "Map the current discharge and theatre pathway, define three to five flow KPIs, and compare cohorts by ward and admission type. Recommend one change the hospital can pilot.",
        },
        {
          heading: "Out of scope",
          body: "This is not a clinical audit and it does not redesign staffing rotas. Recommendations stay inside the data the operations team already collects.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "Use SQL or spreadsheets for the extract, then a notebook or BI tool for the cohort cuts. The final view is a one-page report a ward manager can read in a stand-up.",
        },
      ],
      workflow: [
        {
          heading: "How the two weeks run",
          body: "Days 1 to 3 confirm the measures and the data gaps. Days 4 to 7 cut the cohorts and check the story with the flow lead. The last days package the baseline and the proposed pilot metric.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "An outcome chart without a flow chart does not tell a hospital what to change. Pair the result with the step in the pathway that created it.",
        },
      ],
    },
  },
  {
    id: "largence",
    title: "Developing a Customer Satisfaction and Retention Programme",
    description:
      "Largence is a UK-focused LegalTech platform designed to modernise legal operations by providing clearer case workflows.",
    careerTrack: "Project Management",
    category: "LegalTech",
    duration: "2 weeks",
    status: "Completed",
    mark: "spectrum",
    image: "/images/pngs/business-testimonial/collab.jpg",
    contributor: "Priya Shah",
    skills: [
      "Stakeholder Mapping",
      "Delivery Planning",
      "Risk Register",
      "Client Reporting",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Largence wants a retention programme for law firms that already use its case workflow. This project plans that programme: who owns it, what clients hear at each stage, and how the team knows it is working.",
        },
        {
          heading: "Business context",
          body: "New firms sign up, then go quiet after onboarding. Support hears complaints late, and account managers have no shared view of which clients are at risk of leaving.",
        },
        {
          heading: "Project purpose",
          body: "Set up a 90-day retention programme with owners, a client cadence, and a simple health score the account team can update.",
          more: "The plan covers the first check-in, the signals that trigger an escalation, and the report the founder reviews each month.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "Largence is a UK LegalTech company. Its product gives law firms a clearer path through case work, from intake to completion. The team is small, so the programme has to run without a new department.",
        },
        {
          heading: "Who you work with",
          body: "The founder sponsors the work. Customer success and support supply the complaints and the renewal dates. You coordinate them. You do not rebuild the product.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "A stakeholder map, a 90-day client cadence, a risk register for the rollout, and a monthly report template. Define the health score and who updates it.",
        },
        {
          heading: "Out of scope",
          body: "Pricing changes, a new product feature, and a full CRM implementation sit outside this engagement.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "The working tools are a delivery plan, a RACI, and the client's existing support inbox and billing list. No new platform is required to start the cadence.",
        },
      ],
      workflow: [
        {
          heading: "How the two weeks run",
          body: "Week 1 maps who speaks to the client today and where accounts go quiet. Week 2 agrees the cadence, the health score, and the first month's report with the founder.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "A retention programme fails when nobody owns the check-in. Name the owner, the trigger, and the date before you add another metric.",
        },
      ],
    },
  },
  {
    id: "housing-repair",
    title: "Housing Repair Service Improvement Project",
    description:
      "Westbridge Borough Council is a local authority based in the West Midlands, England. Established in 1974.",
    careerTrack: "Business Analysis",
    category: "Construction",
    duration: "3 weeks",
    status: "Active",
    mark: "apex",
    image: "/images/pngs/new-home/the-impact/project-2.png",
    contributor: "James Adeyemi",
    skills: [
      "Process Mapping",
      "Requirements",
      "As-Is / To-Be",
      "Stakeholder Interviews",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "Westbridge Borough Council needs its housing repair service to move from first report to completed job with fewer handoffs. This project documents how a repair is raised today and proposes a clearer path for tenants and operatives.",
        },
        {
          heading: "Business context",
          body: "Tenants report the same repair more than once because status is hard to see. Operatives arrive without the right part, and the contact centre cannot tell a tenant when the job will actually close.",
        },
        {
          heading: "Project purpose",
          body: "Produce an as-is map, a to-be journey, and the requirements the council can hand to its repairs system owner.",
          more: "The requirements cover status updates for tenants, a parts check before a visit is booked, and the measure the service lead will use to see repeat reports falling.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "Westbridge Borough Council is a West Midlands local authority, established in 1974. Its housing service looks after council homes and a repairs team that covers routine and emergency jobs.",
        },
        {
          heading: "Who you work with",
          body: "The housing service lead sponsors the work. You interview the contact centre, a repairs scheduler, and an operative. Tenant detail stays anonymised.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "Map the current repair journey from report to close. Write the to-be steps and a prioritised requirement list. Call out where the current system blocks a status update.",
        },
        {
          heading: "Out of scope",
          body: "Procuring a new repairs contractor and changing the council's emergency policy are outside this project.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "Process maps, a requirements catalogue, and the fields already stored in the repairs system. The output is written so a system owner can configure it without a second discovery round.",
        },
      ],
      workflow: [
        {
          heading: "How the three weeks run",
          body: "Week 1 is interviews and the as-is map. Week 2 tests that map with the scheduler and drafts the to-be journey. Week 3 prioritises requirements and walks the service lead through them.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "A tenant measures the service by whether they know what happens next. A process map that hides the status update has missed the requirement.",
        },
      ],
    },
  },
  {
    id: "medisure",
    title: "Strengthening Cyber Resilience through Phishing Simulation",
    description:
      "This case study simulates a phishing incident targeting MediSure Health Network, a healthcare provider.",
    careerTrack: "SOC Analysis",
    category: "Healthcare",
    duration: "2 weeks",
    status: "Completed",
    mark: "spectrum",
    image: "/images/pngs/new-home/the-impact/project-3.png",
    contributor: "Lena Okonkwo",
    skills: [
      "Phishing Analysis",
      "Log Review",
      "Incident Response",
      "Awareness Reporting",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "MediSure Health Network wants to know how a phishing email would move through its clinics. This case study walks a simulated incident from the first click to containment, using the logs the security team already keeps.",
        },
        {
          heading: "Business context",
          body: "Clinic staff share inboxes and open patient-related email all day. A previous drill stopped at the click rate. Nobody traced what the account could reach after the click, or how long the mailbox stayed exposed.",
        },
        {
          heading: "Project purpose",
          body: "Produce an incident timeline, the controls that would have stopped it, and a short awareness note for clinic managers.",
          more: "The note tells managers what to report, who to call, and which mailbox actions to take in the first hour. It is written for clinic staff, not for the security team.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "MediSure Health Network runs clinics and a shared administrative service. Email is the main way referrals and patient documents arrive. The security function is small and shares on-call cover.",
        },
        {
          heading: "Who you work with",
          body: "The security lead sponsors the simulation. IT provides mailbox and sign-in logs. No real patient record is opened during the exercise.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "Replay one simulated phishing path. Build the timeline from delivery to containment. List the detective and preventive controls, and draft the one-hour clinic response.",
        },
        {
          heading: "Out of scope",
          body: "A live phishing campaign against staff, a new email gateway, and a full security-policy rewrite are out of scope.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "Mailbox headers, sign-in logs, and the existing alerting rules. The write-up uses the team's current tooling so the timeline can be repeated after the engagement.",
        },
      ],
      workflow: [
        {
          heading: "How the two weeks run",
          body: "Week 1 reconstructs the path and the gaps in detection. Week 2 checks the timeline with the security lead and writes the clinic note and the control list.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "A click rate is not an incident report. The useful product is the hour-by-hour path, and the first action a clinic manager can take without waiting for the security on-call.",
        },
      ],
    },
  },
  {
    id: "safemed",
    title: "Enterprise Security Governance & Compliance",
    description:
      "SafeMed Innovations is a high-growth healthcare technology company founded in 2020 that provides digital care tools.",
    careerTrack: "GRC",
    category: "Healthcare",
    duration: "3 weeks",
    status: "Active",
    mark: "google",
    image: "/images/pngs/new-home/the-impact/project-4.png",
    contributor: "Omar Haddad",
    skills: [
      "Control Mapping",
      "Risk Assessment",
      "Policy Review",
      "Compliance Reporting",
    ],
    tabs: {
      brief: [
        {
          heading: "Project summary",
          body: "SafeMed Innovations is preparing for a customer security review. This project maps the controls it already runs to the questions enterprise buyers ask, and shows where the evidence is thin.",
        },
        {
          heading: "Business context",
          body: "SafeMed sells digital care tools into hospitals. Buyers now ask for a control list, an owner for each risk, and proof that policies match what the product team actually does. Those answers currently live in separate documents.",
        },
        {
          heading: "Project purpose",
          body: "Deliver a control map, a short risk register, and a gap list the founder can use in the next security questionnaire.",
          more: "Each gap names the owner, the evidence that is missing, and whether it blocks a sale or can wait until the following quarter.",
        },
      ],
      company: [
        {
          heading: "About the client",
          body: "SafeMed Innovations was founded in 2020. It builds digital care tools used by clinical teams. The company is still small, and security governance sits with the founder and the engineering lead.",
        },
        {
          heading: "Who you work with",
          body: "You work with the founder and the engineering lead. Policy text is checked against the product's real access, logging, and vendor list, not against a template alone.",
        },
      ],
      scope: [
        {
          heading: "In scope",
          body: "Map current controls to a standard buyer questionnaire. Record the top risks, the policy that covers each one, and the evidence on file. Rank the gaps by whether they block a deal.",
        },
        {
          heading: "Out of scope",
          body: "A full certification audit and a rebuild of the product's access model are outside this engagement.",
        },
      ],
      tech: [
        {
          heading: "Tools and approach",
          body: "A control matrix, the existing policies, and the engineering team's access and vendor records. The output is a register a founder can answer from, with a pointer to the evidence for each control.",
        },
      ],
      workflow: [
        {
          heading: "How the three weeks run",
          body: "Week 1 collects policies and the questions buyers actually send. Week 2 maps controls and marks missing evidence. Week 3 reviews the gap list with the founder and agrees what is fixed before the next questionnaire.",
        },
      ],
      lesson: [
        {
          heading: "What this project teaches",
          body: "A policy that nobody can evidence will not pass a buyer review. Write the control next to the proof, and say plainly when the proof is not there yet.",
        },
      ],
    },
  },
];

export function getShowcaseProject(slug: string) {
  return SHOWCASE_PROJECTS.find((project) => project.id === slug);
}
