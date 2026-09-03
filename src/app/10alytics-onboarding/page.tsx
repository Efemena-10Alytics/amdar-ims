import TenAnalyticsOnboarding from "@/components/_core/10nalytics-onboarding";

type TenAnalyticsOnboardingPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function TenAnalyticsOnboardingPage({
  searchParams,
}: TenAnalyticsOnboardingPageProps) {
  const { email = "" } = await searchParams;
  const decodedEmail = decodeURIComponent(email).replace(/ /g, "+");

  return <TenAnalyticsOnboarding email={decodedEmail} />;
}
