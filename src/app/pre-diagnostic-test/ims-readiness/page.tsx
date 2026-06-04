import { Suspense } from "react";
import ImsReadinessPageContent from "@/components/_core/pre-diagnostic-test/ims-readiness-page-content";

function ImsReadinessFallback() {
  return (
    <div className="w-full max-w-190 px-4 pb-8 pt-0 sm:px-0">
      <p className="text-sm text-[#64748B]">Loading...</p>
    </div>
  );
}

const ImsReadinessPage = () => {
  return (
    <Suspense fallback={<ImsReadinessFallback />}>
      <ImsReadinessPageContent />
    </Suspense>
  );
};

export default ImsReadinessPage;
