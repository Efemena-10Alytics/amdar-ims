import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const BLOG_QUERY_KEY = (slug: string) => ["blogs", "detail", slug] as const;

export type BlogDetail = {
  id?: string | number | null;
  slug?: string | null;
  title?: string | null;
  categories?: string[] | null;
  author?: string | null;
  date?: string | null;
  coverImage?: string | null;
  image?: string | null;
  excerpt?: string | null;
  content?: string | null;
  [key: string]: unknown;
};

type BlogDetailApiResponse = BlogDetail | { data?: BlogDetail };

type UseGetBlogOptions = {
  enabled?: boolean;
};

export function useGetBlog(
  slug: string | undefined | null,
  options: UseGetBlogOptions = {},
) {
  const normalizedSlug = slug?.trim() ?? "";
  const { enabled = true } = options;

  return useQuery({
    queryKey: BLOG_QUERY_KEY(normalizedSlug),
    queryFn: async (): Promise<BlogDetail | null> => {
      const { data } = await axiosInstance.get<BlogDetailApiResponse>(
        `/blogs/${normalizedSlug}`,
      );

      if (!data || typeof data !== "object") return null;
      if ("data" in data && data.data != null) {
        return data.data as BlogDetail;
      }
      return data as BlogDetail;
    },
    enabled: !!apiBaseURL && enabled && normalizedSlug.length > 0,
  });
}
