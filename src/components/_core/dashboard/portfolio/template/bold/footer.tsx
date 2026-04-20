"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { useEffect, useMemo } from "react";
import { initClassicAos } from "../classic/init-classic-aos";
import { type CountryItem, useCountries } from "@/features/portfolio/use-countries";

export type FooterContact = {
  phone: string;
  email: string;
  country: string;
  region?: string;
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

export function Footer({
  contact = {
    phone: "(+234) 81 222 333",
    email: "juwonlo@amdari.io",
    country: "Canada",
    region: "North America",
    countryCode: "CA",
  },
  socialLinks = [],
  poweredByHref = "/",
  id,
}: FooterProps) {
  const { data: countries = [] } = useCountries();

  const countryMatch = useMemo((): CountryItem | undefined => {
    if (!countries.length) return undefined;
    const code = contact.countryCode?.trim().toUpperCase();
    if (code) {
      const byCode = countries.find((country) => country.code.toUpperCase() === code);
      if (byCode) return byCode;
    }

    const normalizedCountry = contact.country.trim().toLowerCase();
    return countries.find(
      (country) => country.name.trim().toLowerCase() === normalizedCountry,
    );
  }, [contact.country, contact.countryCode, countries]);

  useEffect(() => {
    initClassicAos();
  }, []);

  const Icon = ({ type }: { type: SocialLink["type"] }) => {
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
    <footer id={id} data-aos="fade-up" className="mt-20 pb-6 pt-10" aria-label="Footer">
      <h3 className="text-xl font-semibold tracking-tight text-[#A1A8B1]">Let&apos;s talk</h3>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="flex flex-col items-start gap-3">
            {countryMatch?.flag ? (
              <img
                src={countryMatch.flag}
                alt=""
                className="size-5 rounded-full object-cover"
                aria-hidden
              />
            ) : (
              <span className="text-base leading-none" aria-hidden>
                🌍
              </span>
            )}
            <div>
              <p className="text-base font-semibold text-[#64748B]">{contact.country}</p>
              {contact.region ? (
                <p className="text-base text-[#64748B]">{contact.region}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="block text-base font-semibold text-[#64748B] hover:opacity-90"
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="mt-1 block text-base font-semibold text-[#64748B] hover:opacity-90"
          >
            {contact.email}
          </a>

          <div className="mt-4 flex items-center gap-2 md:justify-end">
            {socialLinks.map((link) => (
              <a
                key={`${link.type}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex size-9 items-center justify-center rounded-lg bg-primary text-white"
              >
                <Icon type={link.type} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-center gap-1.5">
        <Image src="/favicon.svg" width={18} height={18} alt="Amdari" />
        <span className="text-sm font-medium text-[#A1A8B1]">Powered by</span>
        <Link href={poweredByHref} className="text-sm font-semibold text-primary underline">
          Amdari.
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
