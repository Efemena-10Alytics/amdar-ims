"use client";
import React from "react";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import CTAbanner from "./cta-banner";
import Aos from "aos";

const Footer = () => {
  const projectsLinks = [
    { label: "Product Design & Mgt.", href: "#" },
    { label: "Project Mgt.", href: "#" },
    { label: "Data Analytics", href: "#" },
    { label: "Business Analytics", href: "#" },
    { label: "Cybersecurity", href: "#" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Success Story", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  const whatsappContacts = [
    { name: "Emem", number: "+447878711494" },
    { name: "Rita", number: "+447471551285" },
    { name: "Ummi", number: "+447646 442409" },
  ];

  const callContacts = [
    { name: "Emem", number: "+447446151822" },
    { name: "Rita", number: "+447471551285" },
    { name: "Ummi", number: "+447446 442409" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
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
        <CTAbanner />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Upper Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Information & Newsletter */}
          <div data-aos="fade-down" className="lg:col-span-1">
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
              a Data Science job
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

          {/* Projects Links */}
          <div data-aos="fade-up">
            <h3 className="text-base font-bold uppercase mb-4">PROJECTS</h3>
            <nav className="flex flex-col gap-3">
              {projectsLinks.map((link) => (
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
            <h3 className="text-base font-bold uppercase mb-4">COMPANY</h3>
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
            <h3 className="text-base font-bold uppercase mb-4">CONTACT US</h3>

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
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
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
