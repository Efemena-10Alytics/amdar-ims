"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  LinkIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import CTAbanner from "./cta-banner";
import Aos from "aos";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import type { InternshipProgram } from "@/types/internship-program";
import { usePathname } from "next/navigation";
import StillHaveQuestion from "../../business-partners/still-have-question";

const PROGRAMS_LABELS = [
  "Product Design",
  "Project Mgt.",
  "Data Analytics",
  "Business Analysis",
  "Data Science",
  "Ethical Hacking",
] as const;

function findProgramForLabel(programs: InternshipProgram[], label: string): InternshipProgram | undefined {
  const normalizedLabel = label
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, " and ")
    .replace(/\bmgt\.?/gi, "management");
  return programs.find((program) => {
    const title = program.title
      .toLowerCase()
      .replace(/\s*&\s*/g, " and ")
      .replace(/\bmgt\.?/gi, "management");
    return title.includes(normalizedLabel) || normalizedLabel.includes(title);
  });
}

const Footer = () => {
  const { data } = useGetInternshipPrograms();
  const pathname = usePathname();
  const isBusinessPartnersPage = pathname === "/business-partners";
  const programsLinks = useMemo(() => {
    const programs = (Array.isArray(data) ? data : (data as { data?: InternshipProgram[] })?.data) ?? [];
    return PROGRAMS_LABELS.map((label) => {
      const program = findProgramForLabel(programs, label);
      return program ? { label, href: `/internship/${program.id}` } : null;
    }).filter((link): link is { label: (typeof PROGRAMS_LABELS)[number]; href: string } => link !== null);
  }, [data]);

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "FAQs", href: "/faqs" },
    { label: "Blog", href: "/blog" },
    { label: "Success Story", href: "/home#success-stories" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms and Conditions", href: "/terms-and-conditions" },
  ];

  const whatsappContacts = [
    { name: "Alexandra", number: "+447478036553" },
    { name: "Rita", number: "+447471551285" },
    { name: "Ummi", number: "+447646442409" },
    { name: "Zuliah", number: "+447366485755 " },
  ];

  const callContacts = [
    { name: "Alexandra", number: "+447478036553" },
    { name: "Rita", number: "+447427132271" },
    { name: "Ummi", number: "+44 7700 101979" },
    { name: "Zuliah", number: "⁠+447426460814" },
  ];

  const TikTokSvg = () => (
    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <title>tiktok</title>
        <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z" />
      </g>
    </svg>
  );

  const LinkindInSvg = () => (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <title>LinkedIn</title>
        <desc>Created with Sketch.</desc>
        <defs />
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Dribbble-Light-Preview" transform="translate(-180.000000, -7479.000000)" fill="currentColor">
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path d="M144,7339 L140,7339 L140,7332.001 C140,7330.081 139.153,7329.01 137.634,7329.01 C135.981,7329.01 135,7330.126 135,7332.001 L135,7339 L131,7339 L131,7326 L135,7326 L135,7327.462 C135,7327.462 136.255,7325.26 139.083,7325.26 C141.912,7325.26 144,7326.986 144,7330.558 L144,7339 L144,7339 Z M126.442,7323.921 C125.093,7323.921 124,7322.819 124,7321.46 C124,7320.102 125.093,7319 126.442,7319 C127.79,7319 128.883,7320.102 128.883,7321.46 C128.884,7322.819 127.79,7323.921 126.442,7323.921 L126.442,7323.921 Z M124,7339 L129,7339 L129,7326 L124,7326 L124,7339 Z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );


  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/amdari_io?igsh=MTYwdG1ydTFib2I1bg%3D%3D&utm_source=qr", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/share/1B6fY6uoT2/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/amdari_io?s=21", label: "Twitter" },
    { icon: Youtube, href: "https://www.youtube.com/@Amdari-Projects", label: "YouTube" },
    { icon: LinkindInSvg, href: "https://www.linkedin.com/company/amdari", label: "LinkedIn" },
    { icon: TikTokSvg, href: "https://www.tiktok.com/@amdari_io", label: "TikTok" },
  ];

  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <footer className="text-white relative overflow-hidden">
      {/* Background Color */}
      <div className="absolute inset-0 bg-[#092A31] z-0" />
      {/* Ellipse Overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: "url(/images/svgs/footer-ellipse.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* CTA Banner */}
      <div className="relative z-10">
       {isBusinessPartnersPage? <StillHaveQuestion /> : <CTAbanner />}
      </div>

      {/* Main Footer Content */}
      <div className="app-width relative z-10 py-12 lg:py-16">
        {/* Upper Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Company Information & Newsletter */}
          <div data-aos="fade-down" className="lg:col-span-2 lg:max-w-[80%]">
            <Image
              src="/logo-white.svg"
              height={40}
              width={180}
              alt="AMDARI"
              className="mb-4"
            />
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              At AMDARI, our goal is to get you closer to career success with
              our ready-made project solutions. Our end-to-end portfolio
              projects are designed to help you Increase your chances of landing
              your dream job
            </p>
            <div className="flex rounded-lg bg-[#0F4652] overflow-hidden mb-4 border-0">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-4 py-2.5 bg-[#156374] text-white placeholder:text-white/70 focus:outline-none text-sm border-0"
              />
              <button
                type="button"
                className="px-4 py-2.5 bg-[#156374] text-white hover:bg-[#0f4d5a] transition-colors flex items-center justify-center min-w-12"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <Checkbox
                id="terms"
                className={cn(
                  "border-white/60 data-[state=checked]:bg-primary",
                  "data-[state=checked]:border-amdari-yellow",
                )}
              />
              <span>I agree to the terms of service</span>
            </label>
          </div>

          {/* Programs Links */}
          <div data-aos="fade-up">
            <h3 className="text-base font-semibold uppercase mb-4">PROGRAMS</h3>
            <nav className="flex flex-col gap-3">
              {programsLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Links */}
          <div data-aos="fade-up">
            <h3 className="text-base font-semibold uppercase mb-4">COMPANY</h3>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Us */}
          <div data-aos="fade-down">
            <h3 className="text-base font-semibold uppercase mb-4">CONTACT US</h3>

            {/* WhatsApp Contacts */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-amdari-yellow" />
                <span className="text-sm font-medium">WhatsApp</span>
              </div>
              <div className="flex flex-col gap-2">
                {whatsappContacts.map((contact, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/${contact.number.replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {contact.name} - {contact.number}
                  </a>
                ))}
              </div>
            </div>

            {/* Call Contacts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-amdari-yellow" />
                <span className="text-sm font-medium">Calls</span>
              </div>
              <div className="flex flex-col gap-2">
                {callContacts.map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact.number.replace(/\s/g, "")}`}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {contact.name} - {contact.number}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Lower Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  {(social.label === "TikTok" || social.label === "LinkedIn") ? <Icon /> : <Icon className="w-5 h-5" />}
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} - AMDARI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
