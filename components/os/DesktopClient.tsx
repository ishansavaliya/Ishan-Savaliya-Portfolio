"use client";

import dynamic from "next/dynamic";

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

export function DesktopClient() {
  return <Desktop />;
}
