import SetupShell from "@/components/_core/setup/setup-shell";
import React, { Suspense } from "react";

const SetupLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SetupShell>
      <Suspense fallback={null}>{children}</Suspense>
    </SetupShell>
  );
};

export default SetupLayout;
