import PlatformSwitchHint from "@/components/_core/dashboard/internship-program/platform-switch-hint";
import SpecialistPreviewBanner from "@/components/_core/dashboard/internship-program/specialist-preview-banner";
import InternshipProgramOverview from "@/components/_core/dashboard/internship-program/internship-program-overview";
import InternshipDetails from "@/components/_core/dashboard/internship-program/internship-details";
import YourTask from "@/components/_core/dashboard/internship-program/your-task";
import AnnouncementView from "@/components/_core/dashboard/internship-program/announcement";

type InternshipProgramPageProps = {
  searchParams: Promise<{ announcement?: string }>;
};

const InternshipProgramPage = async ({ searchParams }: InternshipProgramPageProps) => {
  const { announcement } = await searchParams;

  if (announcement === "true") {
    return <AnnouncementView />;
  }

  return (
    <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
      <PlatformSwitchHint />
      <SpecialistPreviewBanner />
      <InternshipProgramOverview />
      <YourTask />
      <InternshipDetails />
    </div>
  );
};

export default InternshipProgramPage;
