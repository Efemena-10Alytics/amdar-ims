"use client";

import { Button } from "@/components/ui/button";
import { scrollToHash } from "@/lib/scroll-to-hash";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CustomButtonProps {
  btnText: string;
  onClick?: () => void;
  href?: string;
}

const buttonClassName = cn(
  "bg-primary text-white hover:bg-[#0f4d5a] rounded-full h-12 text-base",
  "inline-flex items-center gap-2 w-fit justify-center",
  "group hover:bg-amdari-yellow transition-colors duration-300",
);

const CustomButton = ({ btnText, onClick, href }: CustomButtonProps) => {
  const content = (
    <>
      <div className="group-hover:text-primary">{btnText}</div>
      <div
        className={cn(
          "flex h-5 w-5 rounded-full justify-center items-center bg-amdari-yellow",
          "group-hover:bg-primary text-primary group-hover:text-amdari-yellow",
        )}
      >
        <ArrowUpRight className="w-3 h-3" />
      </div>
    </>
  );

  if (href != null && href !== "") {
    if (href.startsWith("#")) {
      return (
        <Button asChild className={buttonClassName}>
          <a
            href={href}
            onClick={(event) => {
              event.preventDefault();
              scrollToHash(href);
            }}
          >
            {content}
          </a>
        </Button>
      );
    }

    return (
      <Button asChild className={buttonClassName}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className={buttonClassName}>
      {content}
    </Button>
  );
};

export default CustomButton;
