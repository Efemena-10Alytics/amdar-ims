"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  Newspaper,
  UsersRound,
  CircleHelp,
  Phone,
  ShieldCheck,
} from "lucide-react";

let activeNav = {
    color: "#146374",
    background: "#EEF9FC",
    fontWeight: 700,
};


const navItems = [
  { href: "/about", label: "About Us", Icon: Building2 },
  { href: "/team", label: "Meet The Team", Icon: Users },
  { href: "/pricing-plan", label: "Pricing Plan", Icon: Newspaper },
  { href: "/project-contributors", label: "Project Contributors", Icon: UsersRound },
  { href: "/faqs", label: "FAQ", Icon: CircleHelp },
  { href: "/contact", label: "Contact Us", Icon: Phone },
  { href: "/privacy", label: "Privacy Policy", Icon: ShieldCheck },
];

interface AboutBarProps {
  closeAboutBar: () => void;
  /** Optional wrapper class for dropdown usage (e.g. in Navbar). */
  className?: string;
}

const AboutBar = ({ closeAboutBar, className }: AboutBarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={className ?? "absolute top-20 -left-45"}
      onMouseLeave={closeAboutBar}
    >
      <div className="relative w-full h-full bg-whiterounded-[10px] shadow-sm shadow-[#18758A] p-5">
        <div className="flex items-start justify-start gap-4 w-full">
          <div className="flex flex-col items-start gap-4 w-66">
            {navItems.map(({ href, label, Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={isActive ? activeNav : undefined}
                  className="text-[#333333] hover:bg-[#EEF9FC] transition duration-300 w-full"
                >
                  <span className="text-[14px] font-bold leading-10 hover:text-[#146374] flex items-center gap-2 pl-2">
                    <Icon className="h-5 w-5" />
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBar