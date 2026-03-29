"use client";

import Link from "next/link";
import { Phone, Mail, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { initClassicAos } from "./init-classic-aos";
import { type CountryItem, useCountries } from "@/features/portfolio/use-countries";

export type FooterContact = {
  phone: string;
  email: string;
  country: string;
  region?: string;
  /** ISO 3166-1 alpha-2; preferred for flag lookup. */
  countryCode?: string;
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
  id?: string;
};

const TEAL = "#202C3D";

export function Footer({
  contact = {
    phone: "(+234) 08 111 222 34",
    email: "juwonlo@amdari.io",
    country: "Canada",
    region: "North America",
    countryCode: "CA",
  },
  socialLinks = [
    { type: "twitter" as const, href: "#", label: "X (Twitter)" },
    { type: "linkedin" as const, href: "#", label: "LinkedIn" },
    { type: "phone" as const, href: "#", label: "Phone" },
    { type: "mail" as const, href: "#", label: "Email" },
  ],
  poweredByHref = "/",
  id,
}: FooterProps) {
  const { data: countries = [] } = useCountries();

  const countryMatch = useMemo((): CountryItem | undefined => {
    if (!countries.length) return undefined;
    const norm = (s: string) => s.trim().toLowerCase();
    const code = contact.countryCode?.trim().toUpperCase();
    if (code) {
      const byCode = countries.find((c) => c.code.toUpperCase() === code);
      if (byCode) return byCode;
    }
    const countryName = contact.country?.trim();
    if (countryName && countryName !== "—") {
      const n = norm(countryName);
      const regionNorm = contact.region ? norm(contact.region) : "";
      const byName = countries.find((c) => norm(c.name) === n);
      if (byName) return byName;
      if (regionNorm) {
        return countries.find(
          (c) =>
            norm(c.name) === n &&
            (norm(c.subregion) === regionNorm || norm(c.region) === regionNorm)
        );
      }
    }
    return undefined;
  }, [countries, contact.country, contact.countryCode, contact.region]);

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

  useEffect(() => {
    initClassicAos();
  }, []);

  return (
    <footer id={id} data-aos="fade-up" className="mt-16 pt-10 pb-4" aria-label="Contact and footer">
      {/* Top: Contact left, Email + Social right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-3">Contact Me</h3>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="block text-base md:text-lg lg:text-2xl font-semibold text-[#202C3D] hover:opacity-90"
          >
            {contact.phone}
          </a>
          <div className="mt-3 flex items-start gap-2">
            {countryMatch?.flag ? (
              <img
                src={countryMatch.flag}
                alt=""
                className="size-4 shrink-0 rounded-sm object-cover"
                aria-hidden
              />
            ) : (
              <span className="text-base leading-none shrink-0" aria-hidden>
                🌍
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-[#092A31]">{contact.country}</p>
              {contact.region && (
                <p className="text-sm text-zinc-500">{contact.region}</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:text-right">
          <a
            href={`mailto:${contact.email}`}
            className="text-base md:text-lg lg:text-2xl font-semibold text-[#202C3D] hover:opacity-90"
          >
            {contact.email}
          </a>
          <div className="mt-3 flex flex-wrap gap-2 justify-start md:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
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
