import DashboardHeader from "@/components/_core/dashboard/dashboard/header";
import ActivityPeak from "@/components/_core/dashboard/dashboard/activity-peak";
import InternshipBasicInfo from "@/components/_core/dashboard/dashboard/intership-basic-info";
import Streak from "@/components/_core/dashboard/dashboard/streak";
import DashboardWelcome from "@/components/_core/dashboard/dashboard/welcome";
import WelcomeVideo from "@/components/_core/dashboard/dashboard/welcome-video";
import InterviewPrepRequest from "@/components/_core/dashboard/dashboard/interview-prep-request";
import ReferenceLetter from "@/components/_core/dashboard/dashboard/reference-letter";
import RecommendedCourses from "@/components/_core/dashboard/dashboard/recommended-courses";
import YourRoadMap from "@/components/_core/dashboard/dashboard/your-road-map";

const DashboardPage = () => {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <DashboardHeader />

      <div className="flex min-h-52 flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1">
          <DashboardWelcome />
        </div>
        <div className="flex min-w-0 flex-1 lg:max-w-100">
          <WelcomeVideo />
        </div>
      </div>

      <InternshipBasicInfo />
      <YourRoadMap />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Streak />
        <ActivityPeak />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReferenceLetter />
        <InterviewPrepRequest />
      </div>

      <RecommendedCourses />
    </div>
  );
};

export default DashboardPage;
