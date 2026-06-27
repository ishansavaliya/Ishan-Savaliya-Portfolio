import type { Metadata } from "next";
import { SeoContent } from "@/components/shared/SeoContent";
import { DesktopClient } from "@/components/os/DesktopClient";

export const metadata: Metadata = {
  title: "Ishan OS — Interactive Desktop Portfolio",
  description:
    "Ishan Savaliya's portfolio as a macOS-style developer operating system. Explore apps for projects, terminal, VS Code, blog and more.",
  alternates: { canonical: "/os" },
};

export default function OsPage() {
  return (
    <main className="h-full w-full">
      <SeoContent />
      <DesktopClient />
    </main>
  );
}
