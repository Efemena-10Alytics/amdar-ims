import React from "react";
import { AlertCycleSvg } from "./svg";
import { X } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}
const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <div className="flex-1 p-3 flex justify-between gap-4 border border-[#AA3030] bg-[#FDECEC] rounded-md">
      <div className="flex text-[#AA3030] gap-2 items-center">
        <AlertCycleSvg />
        <p className="text-xs flex-1">{error}</p>
      </div>
      <X className="h-6 w-6 text-[#AA3030]" />
    </div>
  );
};

export default ErrorAlert;
