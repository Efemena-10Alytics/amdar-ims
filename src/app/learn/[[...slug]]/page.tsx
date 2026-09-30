import { permanentRedirect } from "next/navigation";

export default async function LearnRedirectPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugPath = slug ? `/${slug.join("/")}` : "";
  permanentRedirect(`https://app.amdari.io/learn${slugPath}`);
}
