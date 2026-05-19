import Aside from "@/components/_core/setup/aside";
import React, { Suspense } from "react";

const SetupLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
      <Suspense fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}>
        <Aside />
      </Suspense>
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

export default SetupLayout;
