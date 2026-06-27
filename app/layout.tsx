import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { KEYWORDS } from "@/lib/seo";
import { themeInitScript } from "@/components/theme/ThemeProvider";

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

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
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
  verification: {
    // Google Search Console (set GOOGLE_SITE_VERIFICATION in env if using the
    // HTML-tag method; safe to leave unset if verified via DNS).
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    // Bing Webmaster Tools (msvalidate.01).
    other: { "msvalidate.01": "6CDFDC35E1EA41791B1A912DBA0A5FF8" },
  },
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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
