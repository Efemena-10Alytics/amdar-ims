import InternshipBasicInfo from "@/components/_core/dashboard/dashboard/intership-basic-info";
import YourRoadMap from "@/components/_core/dashboard/dashboard/your-road-map";
import Streak from "@/components/_core/dashboard/dashboard/streak";
import ActivityPeak from "@/components/_core/dashboard/dashboard/activity-peak";
import ReferenceLetter from "@/components/_core/dashboard/dashboard/reference-letter";
import InterviewPrepRequest from "@/components/_core/dashboard/dashboard/interview-prep-request";
import RecommendedCourses from "@/components/_core/dashboard/dashboard/recommended-courses";
import RecommendedCrashCourse from "@/components/_core/dashboard/dashboard/recommended-crash-course";

const InternshipHasStarted = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
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
      <div className="flex flex-col gap-4">
        {/* <LeaderBoard /> */}
        <RecommendedCrashCourse />
      </div>
    </div>
  );
};

export default InternshipHasStarted;
