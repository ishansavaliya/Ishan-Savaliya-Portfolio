import type { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  FolderGit2,
  Quote,
  Megaphone,
  LogOut,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { signOut } from "./actions";

const NAV = [
  { href: "/is-control-portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/is-control-portal/messages", label: "Messages", icon: Inbox },
  { href: "/is-control-portal/blogs", label: "Blog posts", icon: FileText },
  { href: "/is-control-portal/projects", label: "Projects", icon: FolderGit2 },
  { href: "/is-control-portal/testimonials", label: "Testimonials", icon: Quote },
  { href: "/is-control-portal/announcements", label: "Announcements", icon: Megaphone },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Render the admin chrome only for authenticated sessions. The login page
  // (reachable unauthenticated via middleware) renders its own full screen.
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-os-bg text-os-fg">
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 p-4">
        <div className="mb-6 px-2 text-lg font-semibold">Ishan OS Admin</div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-os-fg/85 hover:bg-white/8"
              >
                <Icon size={16} className="text-accent" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-accent-red hover:bg-white/8"
          >
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
