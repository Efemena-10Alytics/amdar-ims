import DashboardHeader from "@/components/_core/dashboard/dashboard/header";
import DashboardWelcome from "@/components/_core/dashboard/dashboard/welcome";
import WelcomeVideo from "@/components/_core/dashboard/dashboard/welcome-video";

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
    </div>
  );
};

export default DashboardPage;
