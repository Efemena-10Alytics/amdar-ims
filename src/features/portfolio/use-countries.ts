import { useQuery } from "@tanstack/react-query";

const COUNTRIES_API =
  "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd";

export type CountryItem = {
  name: string;
  code: string;
  flag: string;
  callingCode: string;
};

type RestCountry = {
  name: { common: string };
  cca2: string;
  flags: { png: string; svg: string };
  idd?: { root?: string; suffixes?: string[] };
};

function parseCallingCode(idd: RestCountry["idd"]): string {
  if (!idd) return "";
  const root = idd.root ?? "";
  const suffix = idd.suffixes?.[0] ?? "";
  return `${root}${suffix}`.replace(/\s/g, "");
}

function mapCountry(raw: RestCountry): CountryItem {
  return {
    name: raw.name.common,
    code: raw.cca2,
    flag: raw.flags.svg,
    callingCode: parseCallingCode(raw.idd),
  };
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<CountryItem[]> => {
      const res = await fetch(COUNTRIES_API);
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = (await res.json()) as RestCountry[];
      return data
        .filter((c) => c.cca2 && c.name?.common)
        .map(mapCountry)
        .filter((c) => c.callingCode)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });
}
