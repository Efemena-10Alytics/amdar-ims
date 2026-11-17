export const DIAGNOSTIC_CONFIG = {
  BOOKING_URL:
    "https://calendly.com/efemena-amdari/how-we-can-help-you-land-a-job-through-work-exp-clone",
  WEBHOOK_URL:
    "https://script.google.com/macros/s/AKfycbzG-_Tkuui7mndqUgN7jr_L-XZMumHEFfHN5Mlf4igVhtPDgZuEGRLjlup9AniILuiwhQ/exec",
} as const;

export type DiagnosticView = "quiz" | "gate" | "result";

export type RiskBandKey = "red" | "amber" | "green";

export interface RiskBand {
  key: RiskBandKey;
  label: string;
}

export interface QuestionOption {
  label: string;
  summary: string;
  pts: 0 | 5 | 10;
}

export interface DiagnosticQuestion {
  num: number;
  category: string;
  shortName: string;
  blurb: string;
  text: string;
  options: [QuestionOption, QuestionOption, QuestionOption];
}

export interface GapDetail {
  f: string;
  w: string;
  h: string;
}

export interface GapDefinition {
  svc: keyof typeof SERVICES;
  strong: string;
  A: (role: string) => GapDetail;
  B: (role: string) => GapDetail;
}

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ScoreGap {
  idx: number;
  p: 0 | 5 | 10;
}

export interface DiagnosticResult {
  pts: (0 | 5 | 10)[];
  total: number;
  pct: number;
  gaps: ScoreGap[];
  top3Gaps: ScoreGap[];
  potentialPct: number;
  band: RiskBand;
}

export const PTS: readonly (0 | 5 | 10)[] = [0, 5, 10];

export const QUESTIONS: DiagnosticQuestion[] = [
  {
    num: 2,
    category: "Visa Runway",
    shortName: "Visa Runway",
    blurb: "Time remaining on your current UK visa",
    text: "How much time is left on your current UK visa?",
    options: [
      {
        label: "Less than 12 months (Urgent)",
        summary: "<12 mos (Urgent)",
        pts: 0,
      },
      { label: "12 to 24 months", summary: "12-24 mos", pts: 5 },
      {
        label: "Over 2 years / Dependent / Settled",
        summary: ">2 yrs / Settled",
        pts: 10,
      },
    ],
  },
  {
    num: 3,
    category: "CV & UK Experience",
    shortName: "Commercial Exp",
    blurb: "Commercial deliverables and production proof",
    text: "Does your CV show live UK commercial projects?",
    options: [
      {
        label: "No, only degrees or course certificates",
        summary: "Degrees only (No UK projects)",
        pts: 0,
      },
      {
        label: "Personal projects only, no real UK company work",
        summary: "Personal projects only",
        pts: 5,
      },
      {
        label: "Yes, live UK project deliverables and references",
        summary: "Live UK commercial deliverables",
        pts: 10,
      },
    ],
  },
  {
    num: 4,
    category: "Application Response Rate",
    shortName: "Response Rate",
    blurb: "ATS conversion and recruiter callbacks",
    text: "What happens when you apply for UK roles right now?",
    options: [
      {
        label: "Silence or instant auto-rejections",
        summary: "Silence / Auto-rejections",
        pts: 0,
      },
      {
        label: "A few recruiter views, no interviews",
        summary: "Views only, no interviews",
        pts: 5,
      },
      {
        label: "Regular interviews for £41,700+ roles",
        summary: "Interviews for £41,700+ roles",
        pts: 10,
      },
    ],
  },
  {
    num: 5,
    category: "Interview & Sprint Readiness",
    shortName: "Interview Fluency",
    blurb: "Commercial scenario and Agile fluency",
    text: "Can you answer scenario questions using real UK team sprint examples?",
    options: [
      {
        label: "No, I only know textbook theory",
        summary: "Textbook theory only",
        pts: 0,
      },
      {
        label: "Only from school or personal projects",
        summary: "Academic/school projects only",
        pts: 5,
      },
      {
        label: "Yes, from real cross-functional client work",
        summary: "Live cross-functional sprint examples",
        pts: 10,
      },
    ],
  },
  {
    num: 6,
    category: "Salary & 5-Year ILR Alignment",
    shortName: "Salary & ILR",
    blurb: "Skilled worker threshold & settlement route",
    text: "What salary band are you targeting for sponsorship?",
    options: [
      {
        label: "Under £41,700 (Fails Skilled Worker baseline threshold)",
        summary: "<£41,700 (Fails sponsorship threshold)",
        pts: 0,
      },
      {
        label: "£41,700 – £50,270 (Meets visa rules, misses 5-year ILR)",
        summary: "£41,700-£50,270 (Meets visa, misses 5-Yr ILR)",
        pts: 5,
      },
      {
        label: "£50,300+ (Qualifies for visa AND 5-year ILR fast-track)",
        summary: "£50,300+ (Qualifies for 5-Yr ILR)",
        pts: 10,
      },
    ],
  },
  {
    num: 7,
    category: "Recruiter Access",
    shortName: "Recruiter Pipeline",
    blurb: "Direct access to active UK tech recruiters",
    text: "How are you reaching UK sponsors?",
    options: [
      {
        label: 'Mass "Easy Apply" on job boards',
        summary: "Mass Easy Apply",
        pts: 0,
      },
      {
        label: "Cold messaging random LinkedIn profiles",
        summary: "Cold LinkedIn messaging",
        pts: 5,
      },
      {
        label: "Direct pipeline of active UK tech recruiters",
        summary: "Direct recruiter pipeline",
        pts: 10,
      },
    ],
  },
];

export const SERVICES = {
  "ATS-Proof Resume Rebuild & Commercial Sprint": {
    d: "Your resume restructured to UK enterprise format and tested against live sponsor job descriptions with commercial sprint metrics.",
  },
  "10-Application Sprint": {
    d: "We find and custom-tailor 10 live roles that fit you at verified UK visa sponsors, ready to submit within 48 hours.",
  },
  "Interview Fast-Track Kit": {
    d: "Your 10 most likely technical and behavioural questions, STAR answers drafted from commercial work, and 1-on-1 mock interviews.",
  },
  "Skilled Worker Sponsorship Pack": {
    d: "Eligible SOC codes, a £41,700 sponsorship baseline audit, and a £50,271 5-Year ILR justification pitch for employers.",
  },
  "Recruiter Hit List (25 Direct Contacts)": {
    d: "25 specialist UK tech headhunters and hiring managers actively hiring for your role with ready-to-send messages.",
  },
} as const;

export const GAPS: GapDefinition[] = [
  // Q2: Visa Runway
  {
    svc: "Skilled Worker Sponsorship Pack",
    strong: "Secure visa runway or settled status allows strategic targeting.",
    A: () => ({
      f: "Critical Visa Runway (<12 Months Left)",
      w: "UK employers avoid sponsoring candidates with short runway if they fear hiring delays.",
      h: "Deploy a rapid 30-day sponsor targeting campaign focusing on licensed employers with immediate allocations.",
    }),
    B: () => ({
      f: "Narrowing Visa Window (12–24 Months Left)",
      w: "UK hiring and security vetting takes 3–6 months. Delaying your strategy burns critical leverage.",
      h: "Map your target role to UK SOC codes and build a direct pipeline of licensed sponsors right now.",
    }),
  },
  // Q3: CV & UK Experience
  {
    svc: "ATS-Proof Resume Rebuild & Commercial Sprint",
    strong: "Live UK commercial deliverables and verified references.",
    A: (role) => ({
      f: "Academic Degrees Only (Zero Commercial UK Deliverables)",
      w: "UK employers filter out academic CVs. Sponsoring companies require verified business deliverables.",
      h: `Rebuild your CV around live UK commercial project briefs for ${role} with measurable business metrics.`,
    }),
    B: () => ({
      f: "Personal Portfolio Lacks Commercial Validation",
      w: "Personal GitHub projects show interest, but sponsors demand proof you can deliver in client sprints.",
      h: "Convert personal project concepts into structured commercial client case studies with signed references.",
    }),
  },
  // Q4: Application Response Rate
  {
    svc: "10-Application Sprint",
    strong:
      "Consistent screening calls and interview callbacks for £41,700+ roles.",
    A: () => ({
      f: "CV Failing ATS Screeners (Immediate Rejections / Silence)",
      w: "Automated filters reject your CV in seconds due to non-UK phrasing and missing commercial keywords.",
      h: "Optimize your CV against live UK sponsor job specs to guarantee an 85%+ score on enterprise ATS parsers.",
    }),
    B: () => ({
      f: "Profile Views Without Interview Progression",
      w: "Recruiters scan your CV in 7 seconds and don't see immediate commercial proof, so they bypass you.",
      h: "Restructure your executive summary and top commercial deliverables to compel immediate callbacks.",
    }),
  },
  // Q5: Interview & Sprint Readiness
  {
    svc: "Interview Fast-Track Kit",
    strong:
      "Fluent STAR storytelling based on real cross-functional commercial sprints.",
    A: () => ({
      f: "Theoretical-Only Knowledge in Technical & Agile Rounds",
      w: "UK managers probe with real scenario challenges. Textbook answers trigger immediate rejections.",
      h: "Master structured STAR scenario frameworks using live Agile sprint examples (Jira, stand-ups, retros).",
    }),
    B: () => ({
      f: "Informal or Academic Examples in Scenario Rounds",
      w: "Citing school group projects makes hiring managers doubt you can handle £41,700+ responsibilities.",
      h: "Replace academic examples with enterprise delivery stories and rehearse in 1-on-1 mock panels.",
    }),
  },
  // Q6: Salary & 5-Year ILR Alignment
  {
    svc: "Skilled Worker Sponsorship Pack",
    strong:
      "Targeting £50,300+ to qualify for 5-Year ILR settlement fast-track.",
    A: (role) => ({
      f: "Sub-£41,700 Salary Fails Baseline Sponsorship Threshold",
      w: "The UK general Skilled Worker threshold is £41,700. Roles below £41,700 cannot legally sponsor you.",
      h: `Reposition your profile for £41,700–£55,000 mid-level roles in ${role} by highlighting high-value deliverables.`,
    }),
    B: () => ({
      f: "£41,700–£50,270 Meets Visa Rules But Traps You in 10-Year Settlement",
      w: "£41,700 secures your visa, but falling below £50,271 disqualifies you from 5-Year fast-track ILR.",
      h: "Upgrade your commercial depth so your applications compete for £50,300+ roles that lock in 5-Year ILR.",
    }),
  },
  // Q7: Recruiter Access
  {
    svc: "Recruiter Hit List (25 Direct Contacts)",
    strong:
      "Direct pipeline of specialist UK tech recruiters and hiring managers.",
    A: () => ({
      f: "Easy Apply Job Board Trap (300+ Applicants per Post)",
      w: "Easy Apply pits you against hundreds of applicants where automated filters discard non-settled candidates.",
      h: "Bypass public job boards with direct access to specialist UK headhunters actively placing sponsored talent.",
    }),
    B: (role) => ({
      f: "Cold Outreach Without Warm Introductions or Pitch",
      w: "Cold LinkedIn messaging without a verified sponsor pitch converts at under 3%.",
      h: `Access 25 verified UK headhunters and hiring managers actively placing sponsored candidates in ${role}.`,
    }),
  },
];

export const STATUS_MESSAGES = [
  "Auditing visa runway against UK Home Office rules...",
  "Evaluating commercial deliverables against ATS filters...",
  "Checking salary alignment with £41,700 sponsorship threshold & £50,271 5-Yr ILR track...",
  "Matching gaps to sponsorship consulting solutions...",
  "Your score is ready.",
] as const;

export interface CountryDialOption {
  iso: string;
  name: string;
  dial: string;
}

const RAW_COUNTRIES =
  "GB|United Kingdom|44;NG|Nigeria|234;GH|Ghana|233;KE|Kenya|254;ZA|South Africa|27;IN|India|91;PK|Pakistan|92;IE|Ireland|353;US|United States|1;CA|Canada|1;AU|Australia|61;" +
  "AF|Afghanistan|93;AL|Albania|355;DZ|Algeria|213;AD|Andorra|376;AO|Angola|244;AR|Argentina|54;AM|Armenia|374;AT|Austria|43;AZ|Azerbaijan|994;BS|Bahamas|1;BH|Bahrain|973;BD|Bangladesh|880;BB|Barbados|1;BY|Belarus|375;BE|Belgium|32;BZ|Belize|501;BJ|Benin|229;BT|Bhutan|975;BO|Bolivia|591;BA|Bosnia & Herzegovina|387;BW|Botswana|267;BR|Brazil|55;BN|Brunei|673;BG|Bulgaria|359;BF|Burkina Faso|226;BI|Burundi|257;KH|Cambodia|855;CM|Cameroon|237;CV|Cape Verde|238;CF|Central African Republic|236;TD|Chad|235;CL|Chile|56;CN|China|86;CO|Colombia|57;KM|Comoros|269;CG|Congo|242;CD|DR Congo|243;CR|Costa Rica|506;CI|Côte d'Ivoire|225;HR|Croatia|385;CU|Cuba|53;CY|Cyprus|357;CZ|Czechia|420;DK|Denmark|45;DJ|Djibouti|253;DO|Dominican Republic|1;EC|Ecuador|593;EG|Egypt|20;SV|El Salvador|503;GQ|Equatorial Guinea|240;ER|Eritrea|291;EE|Estonia|372;SZ|Eswatini|268;ET|Ethiopia|251;FJ|Fiji|679;FI|Finland|358;FR|France|33;GA|Gabon|241;GM|Gambia|220;GE|Georgia|995;DE|Germany|49;GR|Greece|30;GT|Guatemala|502;GN|Guinea|224;GW|Guinea-Bissau|245;GY|Guyana|592;HT|Haiti|509;HN|Honduras|504;HK|Hong Kong|852;HU|Hungary|36;IS|Iceland|354;ID|Indonesia|62;IR|Iran|98;IQ|Iraq|964;IL|Israel|972;IT|Italy|39;JM|Jamaica|1;JP|Japan|81;JO|Jordan|962;KZ|Kazakhstan|7;KW|Kuwait|965;KG|Kyrgyzstan|996;LA|Laos|856;LV|Latvia|371;LB|Lebanon|961;LS|Lesotho|266;LR|Liberia|231;LY|Libya|218;LI|Liechtenstein|423;LT|Lithuania|370;LU|Luxembourg|352;MO|Macao|853;MG|Madagascar|261;MW|Malawi|265;MY|Malaysia|60;MV|Maldives|960;ML|Mali|223;MT|Malta|356;MR|Mauritania|222;MU|Mauritius|230;MX|Mexico|52;MD|Moldova|373;MC|Monaco|377;MN|Mongolia|976;ME|Montenegro|382;MA|Morocco|212;MZ|Mozambique|258;MM|Myanmar|95;NA|Namibia|264;NP|Nepal|977;NL|Netherlands|31;NZ|New Zealand|64;NI|Nicaragua|505;NE|Niger|227;MK|North Macedonia|389;NO|Norway|47;OM|Oman|968;PS|Palestine|970;PA|Panama|507;PG|Papua New Guinea|675;PY|Paraguay|595;PE|Peru|51;PH|Philippines|63;PL|Poland|48;PT|Portugal|351;PR|Puerto Rico|1;QA|Qatar|974;RO|Romania|40;RU|Russia|7;RW|Rwanda|250;ST|São Tomé & Príncipe|239;SA|Saudi Arabia|966;SN|Senegal|221;RS|Serbia|381;SC|Seychelles|248;SL|Sierra Leone|232;SG|Singapore|65;SK|Slovakia|421;SI|Slovenia|386;SO|Somalia|252;KR|South Korea|82;SS|South Sudan|211;ES|Spain|34;LK|Sri Lanka|94;SD|Sudan|249;SE|Sweden|46;CH|Switzerland|41;SY|Syria|963;TW|Taiwan|886;TJ|Tajikistan|992;TZ|Tanzania|255;TH|Thailand|66;TG|Togo|228;TT|Trinidad & Tobago|1;TN|Tunisia|216;TR|Türkiye|90;TM|Turkmenistan|993;UG|Uganda|256;UA|Ukraine|380;AE|United Arab Emirates|971;UY|Uruguay|598;UZ|Uzbekistan|998;VE|Venezuela|58;VN|Vietnam|84;YE|Yemen|967;ZM|Zambia|260;ZW|Zimbabwe|263";

export const COUNTRIES: CountryDialOption[] = RAW_COUNTRIES.split(";").map(
  (entry) => {
    const [iso, name, dial] = entry.split("|");
    return { iso, name, dial };
  },
);

export const PHONE_LEN: Record<string, [number, number]> = {
  NG: [10, 10],
  GB: [10, 10],
  GH: [9, 9],
  KE: [9, 9],
  ZA: [9, 9],
  IN: [10, 10],
  US: [10, 10],
  CA: [10, 10],
  PK: [10, 10],
  AE: [9, 9],
  IE: [8, 9],
  AU: [9, 9],
};

export function guessCountryIso(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const map: Record<string, string> = {
      "Africa/Lagos": "NG",
      "Europe/London": "GB",
      "Africa/Accra": "GH",
      "Africa/Nairobi": "KE",
      "Africa/Johannesburg": "ZA",
      "Asia/Kolkata": "IN",
      "Asia/Calcutta": "IN",
      "Asia/Karachi": "PK",
      "Europe/Dublin": "IE",
      "America/New_York": "US",
      "America/Chicago": "US",
      "America/Los_Angeles": "US",
      "America/Toronto": "CA",
      "Australia/Sydney": "AU",
    };
    return map[tz] || "GB";
  } catch {
    return "GB";
  }
}

export function flagFallbackEmoji(iso: string): string {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)),
  );
}

export function getRiskBand(pct: number): RiskBand {
  if (pct < 40) {
    return { key: "red", label: "Cannot Land Sponsorship (Critical Risk)" };
  }
  if (pct < 70) {
    return { key: "amber", label: "At Risk (Fails ATS Screeners)" };
  }
  return { key: "green", label: "Ready for Sponsorship" };
}

export function computeDiagnosticScore(
  answers: (number | null)[],
): DiagnosticResult {
  const pts = answers.map((idx) => (idx !== null ? (PTS[idx] ?? 0) : 0));
  const total = pts.reduce<number>((sum, p) => sum + p, 0);
  const pct = Math.round((total / 60) * 100);
  const gaps: ScoreGap[] = pts
    .map((p, idx) => ({ idx, p }))
    .filter((g) => g.p < 10)
    .sort((a, b) => a.p - b.p);
  const top3Gaps = gaps.slice(0, 3);
  const potentialPts =
    total + top3Gaps.reduce((acc, g) => acc + (10 - g.p), 0);
  const potentialPct = Math.min(100, Math.round((potentialPts / 60) * 100));

  return {
    pts,
    total,
    pct,
    gaps,
    top3Gaps,
    potentialPct,
    band: getRiskBand(pct),
  };
}

export function buildDiagnosticSummary(answers: (number | null)[]): string {
  return QUESTIONS.map((q, idx) => {
    const selectedIdx = answers[idx];
    const chosen = selectedIdx !== null ? q.options[selectedIdx] : undefined;
    return `${q.shortName}: ${chosen ? chosen.summary : "Not Answered"}`;
  }).join(" | ");
}

export interface DiagnosticWebhookPayload {
  timestamp: string;
  lead_source: "Sponsorship_Quiz_V2";
  full_name: string;
  email: string;
  whatsapp_phone: string;
  target_role: string;
  readiness_score: string;
  risk_band: string;
  diagnostic_summary: string;
  calendly_clicked: boolean;
}

export function sendDiagnosticWebhook(payload: DiagnosticWebhookPayload): void {
  if (!DIAGNOSTIC_CONFIG.WEBHOOK_URL) return;
  try {
    fetch(DIAGNOSTIC_CONFIG.WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // Non-blocking analytics/webhook call
  }
}
