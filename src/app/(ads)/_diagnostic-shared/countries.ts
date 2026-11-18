export const DIAGNOSTIC_CONFIG = {
  BOOKING_URL:
    "https://calendly.com/efemena-amdari/how-we-can-help-you-land-a-job-through-work-exp-clone",
  WEBHOOK_URL:
    "https://script.google.com/macros/s/AKfycbzG-_Tkuui7mndqUgN7jr_L-XZMumHEFfHN5Mlf4igVhtPDgZuEGRLjlup9AniILuiwhQ/exec",
} as const;

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
}

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

export function sanitizeFullName(raw: string): string {
  return raw.replace(/[^\p{L}\p{M}\s.'’-]/gu, "").replace(/\s{2,}/g, " ");
}

export function isValidFullName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && /\p{L}{2}/u.test(trimmed);
}

export function isValidEmailAddress(value: string): boolean {
  return /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(
    value.trim(),
  );
}

export function getFormattedPhone(digits: string, iso: string, dial: string) {
  const national = digits.replace(/\D/g, "").replace(/^0+/, "");
  return { national, full: `+${dial}${national}`, iso };
}

export function isValidWhatsAppPhone(
  digits: string,
  iso: string,
  dial: string,
): boolean {
  const { national } = getFormattedPhone(digits, iso, dial);
  const [min, max] = PHONE_LEN[iso] ?? [6, 14];
  return national.length >= min && national.length <= max;
}

function submitWebhookViaIframeFallback(payloadJson: string): void {
  if (typeof document === "undefined" || !DIAGNOSTIC_CONFIG.WEBHOOK_URL) {
    return;
  }
  try {
    let iframe = document.getElementById(
      "webhook_target_iframe",
    ) as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "webhook_target_iframe";
      iframe.name = "webhook_target_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    const form = document.createElement("form");
    form.method = "POST";
    form.action = DIAGNOSTIC_CONFIG.WEBHOOK_URL;
    form.target = "webhook_target_iframe";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "postData";
    input.value = payloadJson;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => form.remove(), 2000);
  } catch {
    // Non-blocking fallback
  }
}

export async function sendDiagnosticWebhook(
  payload: object,
  options?: { enableIframeFallback?: boolean },
): Promise<void> {
  if (!DIAGNOSTIC_CONFIG.WEBHOOK_URL) return;
  const body = JSON.stringify(payload);
  try {
    await fetch(DIAGNOSTIC_CONFIG.WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  } catch {
    if (options?.enableIframeFallback) {
      submitWebhookViaIframeFallback(body);
    }
  }
}
