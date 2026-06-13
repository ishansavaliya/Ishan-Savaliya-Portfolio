"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push("/is-control-portal");
    router.refresh();
  }

  const field =
    "w-full rounded-lg bg-white/6 px-3 py-2.5 text-[15px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted";

  return (
    <div className="flex min-h-screen items-center justify-center bg-os-bg px-4 text-os-fg">
      <form onSubmit={onSubmit} className="glass w-full max-w-sm rounded-2xl p-7">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
            <Lock size={22} className="text-accent" />
          </span>
          <h1 className="text-xl font-semibold">Ishan OS Admin</h1>
          <p className="text-sm text-os-muted">Sign in to manage your content</p>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-accent-red">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
