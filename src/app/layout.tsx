import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import "aos/dist/aos.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { media: "(prefers-color-scheme: light)", color: "white" },
  ],
  icons: {
    icon: "https://www.Amdaridatastrategists.com/logo1.png",
    shortcut: "https://www.Amdaridatastrategists.com/logo1.png",
    apple: "https://www.Amdaridatastrategists.com/logo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable}! antialiased`}>{children}</body>
    </html>
  );
}
