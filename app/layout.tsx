import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ishansavaliya.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ishan Savaliya — Ishan OS",
    template: "%s · Ishan OS",
  },
  description:
    "Ishan Savaliya's portfolio reimagined as a macOS-style developer operating system — projects, experience, blog, terminal and more.",
  keywords: [
    "Ishan Savaliya",
    "Full Stack Developer",
    "portfolio",
    "Next.js",
    "React",
    "macOS portfolio",
  ],
  authors: [{ name: "Ishan Savaliya" }],
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
