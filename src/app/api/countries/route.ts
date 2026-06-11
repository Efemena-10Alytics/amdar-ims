import { NextResponse } from "next/server";
import type { CountryItem } from "@/features/portfolio/use-countries";

const COUNTRIES_NOW_CODES =
  "https://countriesnow.space/api/v0.1/countries/codes";
const COUNTRIES_NOW_FLAGS =
  "https://countriesnow.space/api/v0.1/countries/flag/images";

type CountriesNowCodesResponse = {
  error?: boolean;
  msg?: string;
  data?: Array<{
    name: string;
    code: string;
    dial_code: string;
  }>;
};

type CountriesNowFlagsResponse = {
  error?: boolean;
  msg?: string;
  data?: Array<{
    name: string;
    flag: string;
    iso2: string;
  }>;
};

function flagUrlForCode(code: string, flagsByCode: Map<string, string>): string {
  const normalizedCode = code.trim().toUpperCase();
  const flag = flagsByCode.get(normalizedCode)?.trim();

  if (flag && flag.startsWith("http")) {
    return flag;
  }

  return `https://flagcdn.com/${normalizedCode.toLowerCase()}.svg`;
}

export async function GET() {
  try {
    const [codesRes, flagsRes] = await Promise.all([
      fetch(COUNTRIES_NOW_CODES, { next: { revalidate: 86400 } }),
      fetch(COUNTRIES_NOW_FLAGS, { next: { revalidate: 86400 } }),
    ]);

    if (!codesRes.ok || !flagsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: 502 },
      );
    }

    const codesPayload = (await codesRes.json()) as CountriesNowCodesResponse;
    const flagsPayload = (await flagsRes.json()) as CountriesNowFlagsResponse;

    if (codesPayload.error || !Array.isArray(codesPayload.data)) {
      return NextResponse.json(
        { error: codesPayload.msg ?? "Failed to fetch country codes" },
        { status: 502 },
      );
    }

    const flagsByCode = new Map(
      (flagsPayload.data ?? []).map((entry) => [
        entry.iso2.trim().toUpperCase(),
        entry.flag.trim(),
      ]),
    );

    const countries: CountryItem[] = codesPayload.data
      .filter((entry) => entry.code?.trim() && entry.name?.trim())
      .map((entry) => ({
        name: entry.name.trim(),
        code: entry.code.trim().toUpperCase(),
        flag: flagUrlForCode(entry.code, flagsByCode),
        callingCode: entry.dial_code.trim().replace(/\s/g, ""),
        region: "",
        subregion: "",
      }))
      .filter((entry) => entry.callingCode)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 502 },
    );
  }
}
