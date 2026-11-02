/**
 * Location filtering for the jobs feed.
 *
 * The upstream `location` filter is a case-insensitive substring match against
 * every name in a job's `locations` array, and that feed labels places
 * inconsistently: country names ("United States"), informal aliases ("USA",
 * "UK"), cities ("London"), regions ("Europe", "EMEA") and multi-country
 * strings ("Germany, Ireland, Spain, Sweden, UK"). Substring matching covers
 * the multi-country rows for free, but a formal country name matches nothing.
 */

/** The entry pinned above the countries in the location dropdown. */
export const REMOTE_LOCATION_OPTION = "Remote";

/**
 * Country-list names the feed never uses, mapped to the label it does. Checked
 * against the live feed — each formal name returned 0 jobs where the mapped one
 * returned real results (e.g. "Moldova, Republic of" 0 → "Moldova" 17,
 * "Czech Republic" 5 → "Czechia" 30).
 */
const LOCATION_QUERY_ALIASES: Record<string, string> = {
  "bolivia, plurinational state of bolivia": "Bolivia",
  "cocos (keeling) islands": "Cocos",
  "congo, the democratic republic of the": "Congo",
  "czech republic": "Czechia",
  "iran, islamic republic of": "Iran",
  "macedonia, the former yugoslav republic of": "North Macedonia",
  "micronesia, federated states of": "Micronesia",
  "moldova, republic of": "Moldova",
  "palestinian territory, occupied": "Palestine",
  "saint helena, ascension and tristan da cunha": "Saint Helena",
  "tanzania, united republic of": "Tanzania",
  "vatican city state (holy see)": "Holy See",
  "venezuela, bolivarian republic of": "Venezuela",
  "virgin islands, british": "Virgin Islands",
  "virgin islands, u.s.": "Virgin Islands",
};

/** The term to send upstream for a chosen country. */
export function locationQueryValue(country: string): string {
  const trimmed = country.trim();
  return LOCATION_QUERY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

/**
 * Turns the dropdown's value into feed filters. "Remote" is a working
 * arrangement rather than a place: only a couple of hundred jobs carry a
 * location literally named "Remote — eligibility unspecified", while
 * `remoteMode=remote` matches every remote listing, so it must not be sent
 * as a location.
 */
export function locationFilterParams(
  value: string,
): { location?: string; remoteMode?: string } {
  const trimmed = value.trim();
  if (!trimmed) return {};
  if (trimmed === REMOTE_LOCATION_OPTION) return { remoteMode: "remote" };
  return { location: locationQueryValue(trimmed) };
}

/** Remote first, then every country alphabetically. */
export function buildLocationOptions(countryNames: string[] | undefined): string[] {
  const countries = Array.from(new Set(countryNames ?? []))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return [REMOTE_LOCATION_OPTION, ...countries];
}

/**
 * The reverse direction, for looking a job's location up in the country list
 * (the card uses it to pick a flag). Keyed on the labels the feed actually
 * emits — "USA" and "UK" alone account for roughly a sixth of the rows.
 */
const FEED_COUNTRY_ALIASES: Record<string, string> = {
  usa: "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  us: "United States",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  "great britain": "United Kingdom",
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  "northern ireland": "United Kingdom",
  czechia: "Czech Republic",
  "north macedonia": "Macedonia, The Former Yugoslav Republic of",
  moldova: "Moldova, Republic of",
  venezuela: "Venezuela, Bolivarian Republic of",
  bolivia: "Bolivia, Plurinational State of Bolivia",
  tanzania: "Tanzania, United Republic of",
  iran: "Iran, Islamic Republic of",
};

/** The country-list name for a label taken from a job's location string. */
export function countryNameFromFeedLabel(label: string): string {
  const trimmed = label.trim();
  return FEED_COUNTRY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}
