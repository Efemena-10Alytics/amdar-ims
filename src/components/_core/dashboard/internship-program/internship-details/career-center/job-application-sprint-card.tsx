"use client";

import { Rocket } from "lucide-react";
import ServiceEmailRequestCard, {
  BLUE_SERVICE_THEME,
} from "@/components/_core/dashboard/internship-program/internship-details/career-center/service-email-request-card";

const JobApplicationSprintCard = () => {
  return (
    <ServiceEmailRequestCard
      title="10 Job Application Sprint"
      requestTitle="10 Job Application Sprint"
      description="Send a request to get 10 job applications, custom CV and cover letter for each ready in 48 hrs."
      icon={<Rocket className="size-5" strokeWidth={2} />}
      theme={BLUE_SERVICE_THEME}
    />
  );
};

export default JobApplicationSprintCard;
