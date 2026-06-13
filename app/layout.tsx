import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { KEYWORDS } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans-stack",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ishansavaliya.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ishan Savaliya — Ishan OS",
    template: "%s · Ishan OS",
  },
  description:
    "Ishan Savaliya's portfolio reimagined as a macOS-style developer operating system — projects, experience, blog, terminal and more.",
  keywords: KEYWORDS,
  authors: [{ name: "Ishan Savaliya", url: SITE_URL }],
  creator: "Ishan Savaliya",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Google Search Console: replace with your verification token, or rely on
  // the DNS / HTML-file verification you've already configured.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ishan Savaliya — Ishan OS",
    description:
      "A macOS-style developer operating system portfolio by Ishan Savaliya.",
    siteName: "Ishan OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ishan Savaliya — Ishan OS",
    description:
      "A macOS-style developer operating system portfolio by Ishan Savaliya.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
