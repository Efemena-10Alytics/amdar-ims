"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import WelcomeNotStarted from "@/components/_core/dashboard/dashboard/welcome/welcome-not-started";
import WelcomeStarted from "@/components/_core/dashboard/dashboard/welcome/welcome-started";
import {
  EMPTY_WELCOME_COUNTDOWN,
  getCountdownTo,
  getWelcomeDisplayName,
  hasProgramStarted,
  resolveEndDate,
  type WelcomeCountdown,
} from "@/components/_core/dashboard/dashboard/welcome/welcome-shared";

const DashboardWelcome = () => {
  const { data: userInfo } = useGetUserInfo();
  const { data: enrollment } = useGetUserEnrollment();
  const displayName = getWelcomeDisplayName(userInfo ?? undefined);

  const startDate = enrollment?.cohort?.start_date ?? null;
  const endDate = useMemo(
    () =>
      resolveEndDate(
        enrollment?.cohort?.start_date,
        enrollment?.cohort?.end_date,
        enrollment?.cohort?.duration,
      ),
    [
      enrollment?.cohort?.start_date,
      enrollment?.cohort?.end_date,
      enrollment?.cohort?.duration,
    ],
  );

  const programStarted = hasProgramStarted(startDate);
  const targetDate = programStarted ? endDate : startDate;

  const [countdown, setCountdown] = useState<WelcomeCountdown>(
    EMPTY_WELCOME_COUNTDOWN,
  );

  useEffect(() => {
    setCountdown(getCountdownTo(targetDate));

    const interval = setInterval(() => {
      setCountdown(getCountdownTo(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!programStarted) {
    return (
      <WelcomeNotStarted
        displayName={displayName}
        countdown={countdown}
      />
    );
  }

  return <WelcomeStarted displayName={displayName} countdown={countdown} />;
};

export default DashboardWelcome;
