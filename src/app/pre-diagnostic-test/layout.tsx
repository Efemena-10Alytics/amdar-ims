import PreDiagnosticShell from "@/components/_core/pre-diagnostic-test/pre-diagnostic-shell";
import React, { Suspense } from "react";

const PreDiagnosticTestLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <PreDiagnosticShell>
      <Suspense fallback={null}>{children}</Suspense>
    </PreDiagnosticShell>
  );
};

export default PreDiagnosticTestLayout;
