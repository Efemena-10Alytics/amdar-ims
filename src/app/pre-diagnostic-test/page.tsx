import { Suspense } from "react";
import CareerReadinessPageContent from "@/components/_core/pre-diagnostic-test/career-readiness-page-content";

function CareerReadinessFallback() {
  return (
    <div className="w-full max-w-190 px-4 pb-8 pt-0 sm:px-0">
      <p className="text-sm text-[#64748B]">Loading...</p>
    </div>
  );
}

const PreDiagnosticTestPage = () => {
  return (
    <Suspense fallback={<CareerReadinessFallback />}>
      <CareerReadinessPageContent />
    </Suspense>
  );
};

export default PreDiagnosticTestPage;
