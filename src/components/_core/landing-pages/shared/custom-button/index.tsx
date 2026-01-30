import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import React from "react";

interface CustomButtonProps {
  btnText: string;
  onClick?: () => void;
}
const CustomButton = ({ btnText, onClick }: CustomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-primary text-white hover:bg-[#0f4d5a] rounded-full h-12 text-base",
        "inline-flex items-center gap-2 w-fit justify-center",
        "group hover:bg-amdari-yellow transition-colors duration-300",
      )}
    >
      <div className="group-hover:text-primary">{btnText}</div>
      <div
        className={cn(
          "flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow",
          "group-hover:bg-primary text-primary group-hover:text-amdari-yellow",
        )}
      >
        <ArrowUpRight className="w-3 h-3" />
      </div>
    </Button>
  );
};

export default CustomButton;
