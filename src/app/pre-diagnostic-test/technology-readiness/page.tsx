import { Suspense } from "react";
import TechnologyReadinessPageContent from "@/components/_core/pre-diagnostic-test/technology-readiness-page-content";

function TechnologyReadinessFallback() {
  return (
    <div className="w-full max-w-190 px-4 pb-8 pt-0 sm:px-0">
      <p className="text-sm text-[#64748B]">Loading...</p>
    </div>
  );
}

const TechnologyReadinessPage = () => {
  return (
    <Suspense fallback={<TechnologyReadinessFallback />}>
      <TechnologyReadinessPageContent />
    </Suspense>
  );
};

export default TechnologyReadinessPage;
