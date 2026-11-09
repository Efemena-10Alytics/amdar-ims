"use client";

import { MessageCircle } from "lucide-react";
import ServiceEmailRequestCard, {
  TEAL_SERVICE_THEME,
} from "@/components/_core/dashboard/internship-program/internship-details/career-center/service-email-request-card";

const GlobalTalentsCard = () => {
  return (
    <ServiceEmailRequestCard
      title="Global Talents"
      requestTitle="Global Talents"
      description="A 48-hour audit of your achievements against Global Talent criteria, with a gap analysis and a structured evidence checklist."
      icon={<MessageCircle className="size-5" strokeWidth={2} />}
      theme={TEAL_SERVICE_THEME}
    />
  );
};

export default GlobalTalentsCard;
