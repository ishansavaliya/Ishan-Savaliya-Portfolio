import { SeoContent } from "@/components/shared/SeoContent";
import { DesktopClient } from "@/components/os/DesktopClient";

export default function Home() {
  return (
    <main className="h-full w-full">
      {/* Visually hidden, server-rendered content for SEO + crawlers. */}
      <SeoContent />
      <DesktopClient />
    </main>
  );
}
