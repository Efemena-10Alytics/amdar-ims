import Aside from "@/components/_core/auth/aside";
import React from "react";

const AuthPagesLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="w-full h-screen overflow-hidden flex bg-white p-5">
      <Aside />
      <div className="w-full bg-[#E8EFF1] lg:pl-10">{children}</div>
    </div>
  );
};

export default AuthPagesLayout;
