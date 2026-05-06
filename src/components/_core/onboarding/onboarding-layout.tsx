import React from "react";
import Aside from "./aside";

const OnboardingLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="w-full h-screen overflow-hidden flex bg-white p-3 2xl:p-5">
      {/* left side */}
      <Aside />
      {/* right side - two backgrounds: solid color + pattern */}
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

export default OnboardingLayout;
