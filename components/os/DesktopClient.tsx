"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Monitor, ArrowLeft } from "lucide-react";

// Client-only desktop shell. Dynamic import with ssr:false is allowed here
// because this file is a Client Component.
const Desktop = dynamic(
  () => import("@/components/os/Desktop").then((m) => m.Desktop),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-black text-white/60">
        Starting Ishan OS…
      </div>
    ),
  }
);

/** Ishan OS needs a larger screen; small screens get a friendly redirect. */
function MobileGate() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-black px-8 text-center text-white">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
        <Monitor size={30} />
      </span>
      <div>
        <h1 className="text-2xl font-semibold">Ishan OS is a desktop experience</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
          The interactive operating system uses draggable windows and a dock —
          best on a laptop or desktop. Open this site on a larger screen to boot
          it, or explore the classic portfolio here.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
      >
        <ArrowLeft size={16} /> Open the classic portfolio
      </Link>
    </div>
  );
}

export function DesktopClient() {
  // null = unknown (pre-mount); avoids SSR/CSR flicker mismatch.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isDesktop === null) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-white/60">
        Starting Ishan OS…
      </div>
    );
  }
  if (!isDesktop) return <MobileGate />;
  return <Desktop />;
}
