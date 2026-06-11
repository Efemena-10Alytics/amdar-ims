import { useQuery } from "@tanstack/react-query";

const COUNTRIES_API = "/api/countries";

export type CountryItem = {
  name: string;
  code: string;
  flag: string;
  callingCode: string;
  /** RestCountries region, e.g. "Americas". */
  region: string;
  /** RestCountries subregion, e.g. "North America". */
  subregion: string;
};

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<CountryItem[]> => {
      const res = await fetch(COUNTRIES_API);
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = (await res.json()) as CountryItem[];
      if (!Array.isArray(data)) throw new Error("Invalid countries response");
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });
}
