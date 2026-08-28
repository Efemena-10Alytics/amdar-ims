import type { Metadata } from "next";
import AuthAside from "@/components/_core/auth/aside";
import React from "react";

export const metadata: Metadata = {
  title: "Defer internship",
};

const DefermentLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
      <AuthAside showJourneyControls={true} />
      <div
        className="relative h-full min-h-0 w-full overflow-y-auto sm:pl-10"
        style={{
          backgroundColor: "#E8EFF1",
          backgroundImage: "url(/images/pngs/auth-pattern.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DefermentLayout;
