import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body className={`${sora.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
