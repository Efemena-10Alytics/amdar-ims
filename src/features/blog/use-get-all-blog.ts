import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const ALL_BLOGS_QUERY_KEY = (page: number) =>
  ["blogs", "all", page] as const;

export type BlogItem = {
  id?: string | number | null;
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  author?: string | null;
  date?: string | null;
  coverImage?: string | null;
  image?: string | null;
  excerpt?: string | null;
  content?: string | null;
};

export type BlogPaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type AllBlogsResponse = {
  current_page: number;
  data: BlogItem[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: BlogPaginationLink[];
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

type AllBlogsApiResponse = AllBlogsResponse | { data?: AllBlogsResponse } | BlogItem[];

type UseGetAllBlogOptions = {
  enabled?: boolean;
  page?: number;
};

export function useGetAllBlog(options: UseGetAllBlogOptions = {}) {
  const { enabled = true, page = 1 } = options;

  return useQuery({
    queryKey: ALL_BLOGS_QUERY_KEY(page),
    queryFn: async (): Promise<AllBlogsResponse> => {
      const { data } = await axiosInstance.get<AllBlogsApiResponse>(
        "/blogs/all",
        { params: { page } },
      );

      // Backward compatibility if API returns a plain array.
      if (Array.isArray(data)) {
        return {
          current_page: page,
          data,
          first_page_url: null,
          from: data.length > 0 ? 1 : null,
          last_page: 1,
          last_page_url: null,
          links: [],
          next_page_url: null,
          path: null,
          per_page: data.length,
          prev_page_url: null,
          to: data.length > 0 ? data.length : null,
          total: data.length,
        };
      }

      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        data.data &&
        typeof data.data === "object" &&
        !Array.isArray(data.data)
      ) {
        return data.data as AllBlogsResponse;
      }

      if (data && typeof data === "object" && Array.isArray((data as AllBlogsResponse).data)) {
        return data as AllBlogsResponse;
      }

      return {
        current_page: page,
        data: [],
        first_page_url: null,
        from: null,
        last_page: 1,
        last_page_url: null,
        links: [],
        next_page_url: null,
        path: null,
        per_page: 15,
        prev_page_url: null,
        to: null,
        total: 0,
      };
    },
    enabled: !!apiBaseURL && enabled,
  });
}
