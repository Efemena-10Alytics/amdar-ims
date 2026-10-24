export const DEFAULT_PROJECT_IMAGE =
  "/images/pngs/new-home/project-details.png";

export type ProjectApproachCard = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

export type ProjectDetails = {
  challenge: {
    heading?: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
  };
  approach: {
    intro: string;
    featured: ProjectApproachCard;
    cards: ProjectApproachCard[];
  };
  join: {
    prompt: string;
    followUp: string;
    cta: string;
    href: string;
    image: string;
    stepsTitle: string;
    steps: string[];
  };
  impact: {
    eyebrow?: string;
    title: string;
    body: string;
    value?: string;
    label?: string;
    statement?: string;
    statementDetail?: string;
    image: string;
  };
  highlightsTitle: string;
  highlights: { title: string; body: string }[];
  capabilitiesTitle: string;
  capabilities: {
    phase: string;
    badge: string;
    title: string;
    body: string;
  }[];
  solve: {
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  metric?: { value: string; label: string };
  details?: ProjectDetails;
};

export const PROJECTS: Project[] = [
  {
    id: "bottom-line-impact",
    title:
      "How AMDARI Consultants Delivered Over $4.5 Million in Bottom-Line Impact",
    description:
      "AMDARI Consultants partnered with a leading technology firm to reimagine productivity at scale. By leveraging AI and data-driven decision-making, the engagement focused on streamlining operations, accelerating execution, and unlocking measurable business value.",
    image: DEFAULT_PROJECT_IMAGE,
    metric: { value: "$4.5M+", label: "Reported bottom-line Impact" },
    details: {
      challenge: {
        paragraphs: [
          "Large technology organisations must continuously improve productivity while managing complex operations, execution demands, and competing business priorities.",
          "This engagement focused on reimagining productivity at scale and identifying opportunities to improve operational performance through more effective use of AI and data-driven decision-making.",
        ],
        image: "/images/pngs/new-home/project-1/challenge.png",
        imageAlt: "Project brief on a laptop beside an Amdari mug",
      },
      approach: {
        intro:
          "AMDARI Consultants worked at the intersection of technology, data, and operational execution to support a more effective approach to productivity.",
        featured: {
          title: "AI-Enabled Decision-Making",
          body: "Explore how AI can support more informed business decisions and improve the way organizations evaluate opportunities for productivity.",
          image: "/images/pngs/new-home/project-1/ui%20snippet.png",
          imageAlt: "Brief is generating",
        },
        cards: [
          {
            title: "Data-Driven Operations",
            body: "Use business data and performance insights to identify opportunities to streamline operations and strengthen decision-making.",
            image: "/images/pngs/new-home/project-1/ui%20snippet%20(1).png",
            imageAlt: "Reports",
          },
          {
            title: "Execution and Business Value",
            body: "Connect insights to operational priorities and execution, with a focus on improving productivity and delivering measurable business value.",
            image: "/images/pngs/new-home/project-1/Window.png",
            imageAlt: "APIs window",
          },
        ],
      },
      join: {
        prompt: "Want to work on project like this?",
        followUp: "Click to join the team",
        cta: "Join the team",
        href: "/auth/sign-up",
        image: "/images/pngs/new-home/join-the-team.png",
        stepsTitle: "Turning Business Insight into Measurable Value",
        steps: ["Understand", "Analyse", "Optimise", "Execute", "Measure"],
      },
      impact: {
        eyebrow: "Business Impact",
        title: "Measurable Business\nValue",
        body: "The engagement demonstrates the potential of combining AI, data-driven decision-making, and operational execution to unlock significant business value.",
        value: "$4.5M+",
        label: "Reported bottom-line impact",
        image: "/images/pngs/new-home/office-bg.png",
      },
      highlightsTitle: "What This Engagement Highlights",
      highlights: [
        {
          title: "Productivity Requires More Than Technology",
          body: "Business value depends on connecting technology to real operational priorities.",
        },
        {
          title: "Data Strengthens Decision-Making",
          body: "Better use of data can help organisations evaluate opportunities and make more informed decisions.",
        },
        {
          title: "Execution Connects Insight to Impact",
          body: "The value of an insight is realised when it translates into meaningful business action.",
        },
      ],
      capabilitiesTitle: "Capabilities Behind the Work",
      capabilities: [
        {
          phase: "Phase 1",
          badge: "Beginning",
          title: "Data & Analytics",
          body: "Turning business data into insight that supports confident decisions.",
        },
        {
          phase: "Phase 2",
          badge: "Action",
          title: "AI & Digital Transformation",
          body: "Applying AI and digital capabilities to improve how organizations operate.",
        },
        {
          phase: "Phase 3",
          badge: "Learning",
          title: "Operational Excellence",
          body: "Strengthening operational performance and execution.",
        },
        {
          phase: "Phase 4",
          badge: "Experience",
          title: "Project & Programme Management",
          body: "Coordinating complex initiatives from plan through delivery.",
        },
      ],
      solve: {
        title: "Let's Solve Your Next Business Challenge.",
        body: "Every organisation has opportunities to improve performance, unlock value, and build for the future. Let's explore how AMDARI can help your organisation turn its priorities into measurable progress.",
        primaryLabel: "Discuss a Business Challenge",
        primaryHref: "/contact",
        secondaryLabel: "Explore Our Capabilities",
        secondaryHref: "#capabilities",
      },
    },
  },
  {
    id: "carbon-footprint",
    title:
      "How AMDARI Consultants Unlocked a New Revenue Stream Through Carbon Footprint Accounting",
    description:
      "AMDARI Consultants explored how lower-emission production could become a scalable revenue opportunity. Through technology, data, and sustainability-driven insights, the collaboration focused on linking environmental performance to commercial value.",
    image: "/images/pngs/new-home/the-impact/project-2.jpg",
    details: {
      challenge: {
        heading: "The Opportunity",
        paragraphs: [
          "Manufacturers face growing pressure to reduce emissions while identifying new sources of commercial value.",
          "This engagement explored how lower-emission production and carbon footprint accounting could support a new revenue stream.",
        ],
        image: "/images/pngs/new-home/project-1/challenge.png",
        imageAlt: "Project brief on a laptop beside an Amdari mug",
      },
      approach: {
        intro:
          "AMDARI Consultants worked at the intersection of sustainability, technology, and commercial strategy to explore how carbon footprint accounting could support a new revenue stream.",
        featured: {
          title: "Carbon Footprint Accounting",
          body: "Establish a structured way to measure and understand the carbon footprint of production activity.",
          image: "/images/pngs/new-home/project-1/ui%20snippet.png",
          imageAlt: "Brief is generating",
        },
        cards: [
          {
            title: "Data and Technology",
            body: "Use data and technology to turn environmental information into insight that can support business decisions.",
            image: "/images/pngs/new-home/project-1/ui%20snippet%20(1).png",
            imageAlt: "Reports",
          },
          {
            title: "Commercial Opportunity",
            body: "Identify how lower-emission production can create a scalable revenue opportunity.",
            image: "/images/pngs/new-home/project-1/Window.png",
            imageAlt: "Commercial opportunity",
          },
        ],
      },
      join: {
        prompt: "Want to work on project like this?",
        followUp: "Click to join the team",
        cta: "Join the team",
        href: "/auth/sign-up",
        image: "/images/pngs/new-home/join-the-team.png",
        stepsTitle: "From Environmental Insight to Commercial Opportunity",
        steps: [
          "Preparation Data",
          "Footprint Insights",
          "Value Identification",
          "Execution",
        ],
      },
      impact: {
        title: "Linking Environmental\nResults with Value",
        body: "Lower-emission production can create opportunities beyond compliance. Carbon footprint data can support new commercial offerings and revenue streams.",
        statement: "From Carbon Data to Commercial Opportunity",
        statementDetail: "Revenue is growing stronger.",
        image: "/images/pngs/new-home/office-bg.png",
      },
      highlightsTitle: "What This Engagement Highlights",
      highlights: [
        {
          title: "Sustainability Can Drive Long-Term Business Strategy",
          body: "Environmental performance can inform decisions that extend beyond reporting and compliance.",
        },
        {
          title: "Data Helps an Organisation See Where Value Exists",
          body: "Carbon footprint data can reveal opportunities that are difficult to see through traditional business metrics alone.",
        },
        {
          title: "Insight and Action Need to Stay Connected",
          body: "The commercial value of environmental insight depends on an organisation's ability to act on it.",
        },
      ],
      capabilitiesTitle: "Capabilities Behind the Work",
      capabilities: [
        {
          phase: "Phase 1",
          badge: "Beginning",
          title: "Data & Analytics",
          body: "Turning carbon and operational data into insight.",
        },
        {
          phase: "Phase 2",
          badge: "Action",
          title: "Sustainability Strategy",
          body: "Connecting environmental performance to long-term business priorities.",
        },
        {
          phase: "Phase 3",
          badge: "Learning",
          title: "Commercial Model Design",
          body: "Identifying how lower-emission production can support a new revenue stream.",
        },
        {
          phase: "Phase 4",
          badge: "Experience",
          title: "Technology & Digital Enablement",
          body: "Using technology to make carbon footprint accounting practical and scalable.",
        },
      ],
      solve: {
        title: "Turn Complex Business Challenges into New Opportunities.",
        body: "Every organisation has opportunities to improve performance, unlock value, and build for the future. Let's explore how AMDARI can help your organisation turn its priorities into measurable progress.",
        primaryLabel: "Discuss a New Challenge",
        primaryHref: "/contact",
        secondaryLabel: "Explore Our Capabilities",
        secondaryHref: "#capabilities",
      },
    },
  },
  {
    id: "avoidable-discharges",
    title:
      "AMDARI Consultants Helped a Regional Health System Reduce Avoidable Discharge Delays by 18%",
    description:
      "AMDARI Consultants partnered with a regional health system to address avoidable discharge delays and reduce pressure on inpatient capacity. By unifying patient-flow data and supporting clinical adoption, the engagement focused on helping teams act earlier and with greater confidence.",
    image: "/images/pngs/new-home/the-impact/project-3.jpg",
    metric: {
      value: "18%",
      label: "Reduction in avoidable discharge delays",
    },
    details: {
      challenge: {
        paragraphs: [
          "Busy hospital systems struggle when discharge decisions depend on fragmented information and late coordination across clinical teams.",
          "This engagement focused on unifying patient-flow data, predicting discharge readiness, and helping clinicians act earlier so patients could move through care without avoidable delay.",
        ],
        image: "/images/pngs/new-home/project-1/challenge.png",
        imageAlt: "Project brief on a laptop beside an Amdari mug",
      },
      approach: {
        intro:
          "AMDARI Consultants worked with operations, clinical, and IT leaders to connect patient-flow insight with day-to-day discharge decisions.",
        featured: {
          title: "Unified Patient-Flow Data",
          body: "Bring together the information clinical teams need to see discharge readiness in one view.",
          image: "/images/pngs/new-home/project-1/ui%20snippet.png",
          imageAlt: "Brief is generating",
        },
        cards: [
          {
            title: "Readiness Analytics",
            body: "Use data to show which patients are likely ready for discharge, and where delays are building.",
            image: "/images/pngs/new-home/project-1/ui%20snippet%20(1).png",
            imageAlt: "Reports",
          },
          {
            title: "Clinical Adoption",
            body: "Support clinicians and operational leaders so the insight is used in daily discharge decisions.",
            image: "/images/pngs/new-home/project-1/Window.png",
            imageAlt: "Clinical adoption",
          },
        ],
      },
      join: {
        prompt: "Want to work on project like this?",
        followUp: "Click to join the team",
        cta: "Join the team",
        href: "/auth/sign-up",
        image: "/images/pngs/new-home/join-the-team.png",
        stepsTitle: "From Fragmented Data to Faster Discharges",
        steps: ["Assess", "Integrate", "Operationalise", "Predict"],
      },
      impact: {
        title: "Measurable Impact\non Patient Flow",
        body: "The engagement shows how unified patient-flow data and clinical adoption can shorten avoidable discharge delays and ease pressure on inpatient capacity.",
        value: "18%",
        label: "Reduction in avoidable discharge delays",
        image: "/images/pngs/new-home/office-bg.png",
      },
      highlightsTitle: "What This Engagement Highlights",
      highlights: [
        {
          title: "Capacity Problems Are Often Decision Problems",
          body: "Discharge delays grow when the right information reaches clinical teams too late.",
        },
        {
          title: "Hospital Operations Have to Work as One System",
          body: "Patient flow improves when clinical, operational, and technology teams share the same picture.",
        },
        {
          title: "Start with the Decision, Not the Dashboard",
          body: "The value of the data is realised when clinicians use it to act earlier.",
        },
      ],
      capabilitiesTitle: "Capabilities Behind the Work",
      capabilities: [
        {
          phase: "Phase 1",
          badge: "Beginning",
          title: "Data & Analytics",
          body: "Unifying patient-flow data into a single operational view.",
        },
        {
          phase: "Phase 2",
          badge: "Action",
          title: "Healthcare Technology",
          body: "Applying digital tools to discharge readiness and patient flow.",
        },
        {
          phase: "Phase 3",
          badge: "Learning",
          title: "Clinical Operations",
          body: "Helping clinical teams act on readiness insight in daily practice.",
        },
        {
          phase: "Phase 4",
          badge: "Experience",
          title: "Change Adoption",
          body: "Embedding the new way of working so the improvement holds.",
        },
      ],
      solve: {
        title: "Improve Care Delivery with Better Data.",
        body: "Every organisation has opportunities to improve performance, unlock value, and build for the future. Let's explore how AMDARI can help your organisation turn its priorities into measurable progress.",
        primaryLabel: "Discuss a Care Challenge",
        primaryHref: "/contact",
        secondaryLabel: "Explore Our Capabilities",
        secondaryHref: "#capabilities",
      },
    },
  },
  {
    id: "cyber-threats",
    title:
      "How AMDARI Consultants Helped a Global Financial Services Firm Respond to Cyber Threats 62% Faster",
    description:
      "A global financial services firm was overwhelmed by security alerts from dozens of disconnected tools. AMDARI Consultants teamed with its security and technology leaders to consolidate telemetry, automate triage, and focus analysts on the threats that carried real business risk.",
    image: "/images/pngs/new-home/the-impact/project-1.jpg",
    metric: { value: "62%", label: "Faster mean time to respond" },
    details: {
      challenge: {
        paragraphs: [
          "The security operations centre was buried in alerts from tools that did not speak to one another, so real threats were lost in the noise.",
          "This engagement consolidated security telemetry, automated the first line of triage, and gave analysts a single view of the threats that required a human decision.",
        ],
        image: "/images/pngs/new-home/project-1/challenge.png",
        imageAlt: "Project brief on a laptop beside an Amdari mug",
      },
      approach: {
        intro:
          "AMDARI Consultants worked with the firm's security and technology leaders to replace a fragmented alert queue with a faster, risk-based response.",
        featured: {
          title: "Consolidated Security Telemetry",
          body: "Bring alerts from disconnected tools into one stream the operations team can trust.",
          image: "/images/pngs/new-home/project-1/ui%20snippet.png",
          imageAlt: "Brief is generating",
        },
        cards: [
          {
            title: "Automated Triage & Response",
            body: "Clear routine alerts automatically so analysts spend their time on what needs a decision.",
            image: "/images/pngs/new-home/project-1/ui%20snippet%20(1).png",
            imageAlt: "Triage",
          },
          {
            title: "Risk-Based Prioritisation",
            body: "Rank threats by business impact so the highest-risk incidents are handled first.",
            image: "/images/pngs/new-home/project-1/Window.png",
            imageAlt: "Risk prioritisation",
          },
        ],
      },
      join: {
        prompt: "Want to work on project like this?",
        followUp: "Click to join the team",
        cta: "Join the team",
        href: "/auth/sign-up",
        image: "/images/pngs/new-home/join-the-team.png",
        stepsTitle: "From Fragmented Alerts to Faster Response",
        steps: ["Collect", "Triage", "Diagnose", "Contain", "Prioritise"],
      },
      impact: {
        title: "Faster Response,\nLower Risk",
        body: "Consolidating telemetry and automating triage cut the time to respond, so analysts could focus on the incidents with the greatest business impact.",
        value: "62%",
        label: "Faster mean time to respond",
        image: "/images/pngs/new-home/office-bg.png",
      },
      highlightsTitle: "What This Engagement Highlights",
      highlights: [
        {
          title: "Faster Is Better When It Is the Right Threat",
          body: "Speed only helps when analysts are working on the incidents that matter.",
        },
        {
          title: "Automation Clears a Path for the Judgement",
          body: "Routine alerts can be handled automatically, so people focus on the decisions that need them.",
        },
        {
          title: "Priorities Follow Business Risk",
          body: "The queue should reflect the impact on the business, not the volume of the tools.",
        },
      ],
      capabilitiesTitle: "Capabilities Behind the Work",
      capabilities: [
        {
          phase: "Phase 1",
          badge: "Beginning",
          title: "Cybersecurity Strategy & SOC",
          body: "Shaping how the operations centre sees and responds to threats.",
        },
        {
          phase: "Phase 2",
          badge: "Action",
          title: "Security Operations",
          body: "Running triage and response against a single stream of telemetry.",
        },
        {
          phase: "Phase 3",
          badge: "Learning",
          title: "Threat Detection",
          body: "Finding the incidents that carry real business risk.",
        },
        {
          phase: "Phase 4",
          badge: "Experience",
          title: "Incident Response",
          body: "Containing and resolving the threats that reach an analyst.",
        },
      ],
      solve: {
        title: "Strengthen Your Cyber Resilience.",
        body: "Every organisation has opportunities to improve performance, unlock value, and build for the future. Let's explore how AMDARI can help your organisation turn its priorities into measurable progress.",
        primaryLabel: "Discuss a Security Challenge",
        primaryHref: "/contact",
        secondaryLabel: "Explore Our Capabilities",
        secondaryHref: "#capabilities",
      },
    },
  },
];

export function getProject(id: string) {
  return PROJECTS.find(
    (project, index) => project.id === id || String(index + 1) === id,
  );
}
