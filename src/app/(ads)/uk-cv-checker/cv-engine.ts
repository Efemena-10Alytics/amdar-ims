import type { LeadInfo } from "../_diagnostic-shared/countries";

export const PDFJS_SCRIPT_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
export const PDFJS_WORKER_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
export const MAMMOTH_SCRIPT_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";

interface PdfJsTextItem {
  str: string;
}

interface PdfJsPage {
  getTextContent: () => Promise<{ items: PdfJsTextItem[] }>;
}

interface PdfJsDocument {
  numPages: number;
  getPage: (pageNum: number) => Promise<PdfJsPage>;
}

interface PdfJsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<PdfJsDocument> };
}

interface MammothLib {
  extractRawText: (input: {
    arrayBuffer: ArrayBuffer;
  }) => Promise<{ value: string }>;
}

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
    mammoth?: MammothLib;
  }
}

export type CvCheckerView = "upload" | "processing" | "gate";

export interface MissingSignal {
  title: string;
  why: string;
  fix: string;
}

export interface CvEvaluation {
  score: number;
  riskBand: string;
  role: string;
  missingSignals: MissingSignal[];
  commCount: number;
  acadCount: number;
}

export interface CvWebhookPayload {
  timestamp: string;
  lead_source: "CV_Checker";
  full_name: string;
  email: string;
  whatsapp_phone: string;
  target_role: string;
  readiness_score: string;
  risk_band: string;
  diagnostic_summary: string;
  cv_file_name: string;
  cv_file_type: string;
  cv_file_base64: string;
  calendly_clicked: boolean;
}

export const SCAN_STEP_LABELS = [
  "Extracting document structure & text tokens",
  "Benchmarking against UK ATS screening algorithms",
  "Matching experience to Skilled Worker SOC codes",
  "Auditing commercial deliverables for £41,700 sponsorship & £50,271 5-Yr ILR",
  "Generating Sponsorability Scorecard",
] as const;

export const SCAN_PLAN: ReadonlyArray<{
  ms: number;
  doneIdx: number;
  nextIdx: number;
  msg: string;
}> = [
  {
    ms: 600,
    doneIdx: 0,
    nextIdx: 1,
    msg: "Scanning against UK Applicant Tracking System screeners...",
  },
  {
    ms: 1200,
    doneIdx: 1,
    nextIdx: 2,
    msg: "Matching detected tools and skills to UK Skilled Worker eligible SOC codes...",
  },
  {
    ms: 1800,
    doneIdx: 2,
    nextIdx: 3,
    msg: "Auditing commercial deliverables against £41,700 sponsorship & £50,271 5-Year ILR route...",
  },
  {
    ms: 2300,
    doneIdx: 3,
    nextIdx: 4,
    msg: "Finalizing your personalized Sponsorability Scorecard...",
  },
];

export const SCORECARD_PILLARS: ReadonlyArray<{
  label: string;
  chip: string;
  pct: number;
}> = [
  {
    label: "UK ATS Screening & Keyword Alignment",
    chip: "Critical Gap",
    pct: 32,
  },
  {
    label: "Commercial Deliverables vs. Academic Theory",
    chip: "Critical Gap",
    pct: 35,
  },
  {
    label: "Home Office Skilled Worker SOC Code Fit",
    chip: "Critical Gap",
    pct: 34,
  },
  {
    label: "£41,700 Sponsorship & £50,271 5-Year ILR Alignment",
    chip: "Critical Blocker (<£41,700)",
    pct: 30,
  },
];

export const REBUILD_STEPS: ReadonlyArray<{
  title: string;
  body: string;
}> = [
  {
    title: "Rebuild Around Live Commercial Briefs:",
    body: "Replace coursework with verified client deliverables and signed commercial references.",
  },
  {
    title: "Audit Against UK Enterprise ATS Tools:",
    body: "Integrate Jira, Agile sprint terminology, and quantified business impact metrics.",
  },
  {
    title: "Align with Sponsoring & 5-Year ILR Roles:",
    body: "Target mid-level consulting briefs that meet sponsorship thresholds and open 5-Year ILR.",
  },
];

export async function sniffCvFileType(
  file: File,
): Promise<"pdf" | "docx" | ""> {
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isPdf =
    head[0] === 0x25 &&
    head[1] === 0x50 &&
    head[2] === 0x44 &&
    head[3] === 0x46;
  const isZip =
    head[0] === 0x50 &&
    head[1] === 0x4b &&
    head[2] === 0x03 &&
    head[3] === 0x04;
  return isPdf ? "pdf" : isZip ? "docx" : "";
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = typeof e.target?.result === "string" ? e.target.result : "";
        resolve(res.includes(",") ? res.split(",")[1] : res);
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    } catch {
      resolve("");
    }
  });
}

export type ExtractedCvResult =
  | { text: string; pages: number; error?: undefined }
  | { error: "lib" | "read"; text?: undefined; pages?: undefined };

export async function extractCvText(
  file: File,
  kind: "pdf" | "docx",
): Promise<ExtractedCvResult> {
  try {
    const buf = await file.arrayBuffer();
    if (kind === "pdf") {
      if (!window.pdfjsLib) return { error: "lib" };
      if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      }
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      let text = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 6); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((it) => it.str).join(" ") + "\n";
      }
      return { text, pages: pdf.numPages };
    }
    if (!window.mammoth) return { error: "lib" };
    const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
    return { text: result.value || "", pages: 1 };
  } catch {
    return { error: "read" };
  }
}

export function assessCvDocument(
  ex: ExtractedCvResult,
): { ok: true; text: string } | { ok: false; title: string; msg: string } {
  if (ex.error === "lib") {
    return {
      ok: false,
      title: "We couldn't verify this file",
      msg: "Our document reader didn't load. Check your connection, refresh the page and try again.",
    };
  }
  if (ex.error) {
    return {
      ok: false,
      title: "We couldn't read this file",
      msg: "The file could not be opened. Please export your CV again as a PDF or DOCX and upload it.",
    };
  }

  const t = (ex.text || "").replace(/\s+/g, " ").trim();
  const lower = t.toLowerCase();
  const words = (t.match(/[A-Za-z]{2,}/g) || []).length;
  const notCV = {
    ok: false as const,
    title: "This doesn't look like a CV",
    msg: "Please upload your own CV or résumé (with sections such as Experience, Education and Skills). Invoices, letters, certificates, forms and other documents aren't accepted.",
  };

  if (words < 40) {
    return {
      ok: false,
      title: "No readable text found",
      msg: "We couldn't find readable text in this file. If your CV is a scan or image, please upload a text-based PDF or a DOCX version.",
    };
  }
  if (ex.pages > 6 || words > 4500 || words < 90) return notCV;

  const sections = [
    "experience",
    "work history",
    "employment",
    "education",
    "skills",
    "summary",
    "profile",
    "objective",
    "certifications?",
    "projects?",
    "references",
    "languages",
    "achievements",
    "qualifications",
    "training",
    "interests",
    "volunteer(?:ing)?",
    "career",
  ];
  const secHits = sections.filter((s) =>
    new RegExp(`\\b${s}\\b`).test(lower),
  ).length;
  const hasEmail = /[\w.+\-]+@[\w\-]+\.[\w.\-]+/.test(t);
  const hasPhone = /(\+?\d[\d\s().\-]{8,}\d)/.test(t);
  const hasLink = /linkedin\.com|github\.com|portfolio/.test(lower);
  const years = (t.match(/\b(19[89]\d|20[0-4]\d)\b/g) || []).length;
  const hasPresent = /\b(present|current|to date|till date|ongoing)\b/.test(
    lower,
  );
  const verbs = (
    lower.match(
      /\b(managed|developed|led|built|designed|delivered|implemented|analy[sz]ed|created|improved|coordinated|responsible|achieved|supported|maintained|collaborated|worked|executed|streamlined|reduced|increased)\b/g,
    ) || []
  ).length;
  const negatives = (
    lower.match(
      /\b(invoice|receipt|bill to|total due|amount due|purchase order|terms and conditions|dear sir|dear madam|yours sincerely|table of contents|abstract|chapter \d|bank statement|payslip|certificate of)\b/g,
    ) || []
  ).length;

  const score =
    Math.min(secHits, 5) * 2 +
    (hasEmail ? 2 : 0) +
    (hasPhone ? 1 : 0) +
    (hasLink ? 1 : 0) +
    (years >= 2 ? 2 : years ? 1 : 0) +
    (hasPresent ? 1 : 0) +
    (verbs >= 4 ? 2 : verbs >= 1 ? 1 : 0) -
    negatives * 3;

  const ok =
    secHits >= 2 &&
    score >= 9 &&
    (hasEmail || hasPhone || secHits >= 4) &&
    negatives < 3;

  return ok ? { ok: true, text: ex.text } : notCV;
}

export function runCvEvaluation(text: string, fileName: string): CvEvaluation {
  const lower = `${text} ${fileName}`.toLowerCase();

  const roleSignatures = [
    {
      role: "Data Analyst",
      keys: [
        "data analyst",
        "tableau",
        "power bi",
        "sql",
        "analytics",
        "bi developer",
        "pandas",
      ],
    },
    {
      role: "Business Analyst",
      keys: [
        "business analyst",
        "user stories",
        "agile",
        "brd",
        "requirements",
        "stakeholder",
      ],
    },
    {
      role: "Project Manager",
      keys: [
        "project manager",
        "scrum master",
        "jira",
        "pmp",
        "prince2",
        "sprint planning",
        "budget",
      ],
    },
    {
      role: "Cybersecurity Analyst",
      keys: [
        "cybersecurity",
        "security analyst",
        "siem",
        "soc",
        "penetration",
        "iso 27001",
        "vulnerability",
      ],
    },
    {
      role: "Software Engineer",
      keys: [
        "software engineer",
        "developer",
        "java",
        "react",
        "node",
        "python",
        "full stack",
        "c#",
      ],
    },
    {
      role: "Accountant / Finance",
      keys: [
        "accountant",
        "audit",
        "financial analyst",
        "acca",
        "reconciliation",
        "tax",
        "sage",
      ],
    },
    {
      role: "DevOps / Cloud Engineer",
      keys: [
        "devops",
        "cloud engineer",
        "aws",
        "azure",
        "docker",
        "kubernetes",
        "ci/cd",
        "terraform",
      ],
    },
  ];

  let detectedRole = "Data Analyst";
  let maxMatches = -1;
  for (const sig of roleSignatures) {
    let count = 0;
    for (const k of sig.keys) {
      if (lower.includes(k)) count += 1;
    }
    if (count > maxMatches) {
      maxMatches = count;
      detectedRole = sig.role;
    }
  }

  const commercialKeys = [
    "client",
    "sprint",
    "revenue",
    "saved",
    "increased",
    "%",
    "stakeholder",
    "delivered",
    "deployed",
    "commercial",
    "deliverables",
    "agile",
    "jira",
    "cross-functional",
    "budget",
  ];
  const academicKeys = [
    "university",
    "dissertation",
    "thesis",
    "coursework",
    "modules",
    "degree",
    "bachelor",
    "master",
    "gpa",
    "student",
    "certificate",
  ];

  let commCount = 0;
  for (const k of commercialKeys) {
    if (lower.includes(k)) commCount += 1;
  }
  let acadCount = 0;
  for (const k of academicKeys) {
    if (lower.includes(k)) acadCount += 1;
  }

  let score = 28;
  if (commCount >= 5) score += 3;
  else if (commCount >= 2) score += 2;
  if (
    lower.includes("jira") ||
    lower.includes("agile") ||
    lower.includes("scrum")
  ) {
    score += 2;
  }
  if (
    lower.includes("£") ||
    lower.includes("budget") ||
    lower.includes("roi")
  ) {
    score += 1;
  }
  score = Math.max(28, Math.min(score, 34));

  const missingSignals: MissingSignal[] = [
    {
      title: "Academic Framing Over Commercial Production Deliverables",
      why: "Your CV focuses on degrees and coursework rather than live client deliverables. UK sponsors reject academic CVs.",
      fix: "Restructure every role using the STAR formula with verified client deliverables and measurable business ROI.",
    },
    {
      title: "Missing Enterprise ATS Tooling & Agile Sprint Collaboration",
      why: "Recruiter screeners filter out profiles lacking Agile enterprise tools (Jira, Confluence, CI/CD, sprint planning).",
      fix: "Embed real cross-functional squad deliverables alongside Product Managers, Engineers, and stakeholders.",
    },
    {
      title: "Salary Positioning Below £41,700 Sponsorship Baseline",
      why: "Experience bullets read as junior support, failing the £41,700 Skilled Worker sponsorship threshold and £50,271 5-Yr ILR track.",
      fix: "Elevate your bullet points to mid-level consulting briefs that command £41,700–£65,000 market rates.",
    },
  ];

  return {
    score,
    riskBand: "Cannot Land Sponsorship (Critical Risk)",
    role: detectedRole,
    missingSignals,
    commCount,
    acadCount,
  };
}

export function buildCvDiagnosticSummary(evaluation: CvEvaluation): string {
  return `[Detected Role]: ${evaluation.role} | [Score]: ${evaluation.score}% | [Status]: ${evaluation.riskBand} | [Blockers]: Academic heavy, Missing UK deliverables, Below £41,700 threshold`;
}

export interface StoredCvCheckerState {
  evaluation: CvEvaluation;
  lead: LeadInfo;
  cvFileName: string;
  cvFileType: string;
  cvFileBase64: string;
}

const CV_STORAGE_KEY = "amdari_uk_cv_checker_result";
const CV_STORAGE_EVENT = "amdari-uk-cv-checker-storage";

let cvBase64MemoryCache = "";
let cachedRawCvState: string | null | undefined = undefined;
let cachedParsedCvState: StoredCvCheckerState | null = null;

function isValidStoredCvState(data: unknown): data is StoredCvCheckerState {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Partial<StoredCvCheckerState>;
  if (
    !candidate.evaluation ||
    typeof candidate.evaluation.score !== "number" ||
    typeof candidate.evaluation.role !== "string" ||
    typeof candidate.evaluation.riskBand !== "string" ||
    !Array.isArray(candidate.evaluation.missingSignals)
  ) {
    return false;
  }
  if (
    !candidate.lead ||
    typeof candidate.lead.name !== "string" ||
    typeof candidate.lead.email !== "string" ||
    typeof candidate.lead.phone !== "string"
  ) {
    return false;
  }
  if (
    typeof candidate.cvFileName !== "string" ||
    typeof candidate.cvFileType !== "string"
  ) {
    return false;
  }
  return true;
}

export function getLatestCvBase64(): string {
  return cvBase64MemoryCache;
}

export function saveCvCheckerState(state: StoredCvCheckerState): void {
  cvBase64MemoryCache = state.cvFileBase64;
  if (typeof window === "undefined") return;

  // Try persisting with base64 first; if oversized for sessionStorage quota,
  // persist lightweight report state without base64 and rely on cvBase64MemoryCache.
  const tryStore = (payload: StoredCvCheckerState): boolean => {
    try {
      const raw = JSON.stringify(payload);
      window.sessionStorage.setItem(CV_STORAGE_KEY, raw);
      cachedRawCvState = raw;
      cachedParsedCvState = payload;
      return true;
    } catch {
      return false;
    }
  };

  if (!tryStore(state)) {
    tryStore({ ...state, cvFileBase64: "" });
  }
  window.dispatchEvent(new Event(CV_STORAGE_EVENT));
}

export function clearCvCheckerState(): void {
  cvBase64MemoryCache = "";
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CV_STORAGE_KEY);
    cachedRawCvState = null;
    cachedParsedCvState = null;
    window.dispatchEvent(new Event(CV_STORAGE_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function subscribeCvCheckerState(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CV_STORAGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CV_STORAGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getCvCheckerStateSnapshot(): StoredCvCheckerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CV_STORAGE_KEY);
    if (raw === cachedRawCvState) return cachedParsedCvState;
    cachedRawCvState = raw;
    if (!raw) {
      cachedParsedCvState = null;
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidStoredCvState(parsed)) {
      cachedParsedCvState = null;
      return null;
    }
    cachedParsedCvState = {
      ...parsed,
      cvFileBase64: parsed.cvFileBase64 || cvBase64MemoryCache || "",
    };
    return cachedParsedCvState;
  } catch {
    cachedRawCvState = null;
    cachedParsedCvState = null;
    return null;
  }
}
