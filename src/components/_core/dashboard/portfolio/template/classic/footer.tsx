"use client";

import Link from "next/link";
import { Phone, Mail, Flag, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

export type FooterContact = {
  phone: string;
  email: string;
  country: string;
  region?: string;
};

export type SocialLink = {
  type: "twitter" | "linkedin" | "phone" | "mail";
  href: string;
  label: string;
};

type FooterProps = {
  contact?: FooterContact;
  socialLinks?: SocialLink[];
  poweredByHref?: string;
};

const TEAL = "#202C3D";

export function Footer({
  contact = {
    phone: "(+234) 08 111 222 34",
    email: "juwonlo@amdari.io",
    country: "Canada",
    region: "North America",
  },
  socialLinks = [
    { type: "twitter" as const, href: "#", label: "X (Twitter)" },
    { type: "linkedin" as const, href: "#", label: "LinkedIn" },
    { type: "phone" as const, href: "#", label: "Phone" },
    { type: "mail" as const, href: "#", label: "Email" },
  ],
  poweredByHref = "/",
}: FooterProps) {
  const SocialIcon = ({ type }: { type: SocialLink["type"] }) => {
    switch (type) {
      case "twitter":
        return <Twitter className="size-4" />;
      case "linkedin":
        return <Linkedin className="size-4" />;
      case "phone":
        return <Phone className="size-4" />;
      case "mail":
        return <Mail className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="mt-16 pt-10 pb-4" aria-label="Contact and footer">
      {/* Top: Contact left, Email + Social right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-3">Contact Me</h3>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="block text-lg font-bold text-[#202C3D] hover:opacity-90"
          >
            {contact.phone}
          </a>
          <div className="mt-3 items-center gap-2">
            <Flag className="size-4 text-[#092A31] shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-medium text-zinc-700">{contact.country}</p>
              {contact.region && (
                <p className="text-sm text-zinc-500">{contact.region}</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:text-right">
          <a
            href={`mailto:${contact.email}`}
            className="text-base font-medium text-[#202C3D] hover:opacity-90"
          >
            {contact.email}
          </a>
          <div className="mt-3 flex flex-wrap gap-2 justify-start md:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.type}
                href={link.href}
                aria-label={link.label}
                className="flex size-9 items-center justify-center rounded-lg bg-primary text-white shrink-0"
                // style={{ backgroundColor: TEAL }}
              >
                <SocialIcon type={link.type} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Powered by */}
      <div className="mt-12 flex items-center justify-center gap-1.5">
        <Image src={"/favicon.svg"} width={20} height={20} alt="amdari" />
        <span className="text-sm text-zinc-500">Powered by</span>
        <Link
          href={poweredByHref}
          className="text-sm font-medium text-primary hover:underline"
        >
          Amdari.
        </Link>
      </div>
    </footer>
  );
}
