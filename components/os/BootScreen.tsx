"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/** IS-logo boot screen with a filling progress bar. */
export function BootScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black">
      <Image
        src="/brand/is-logo-mark.png"
        alt="Ishan OS"
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover"
        priority
      />
      <div className="mt-14 h-1 w-48 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          onAnimationComplete={onDone}
        />
      </div>
    </div>
  );
}
