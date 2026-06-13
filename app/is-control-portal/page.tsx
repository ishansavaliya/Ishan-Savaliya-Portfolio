import Link from "next/link";
import { Inbox, FolderGit2, Quote, FileText } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  async function count(table: string, onlyUnread = false) {
    if (!supabase) return 0;
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (onlyUnread) q = q.eq("read", false);
    const { count } = await q;
    return count ?? 0;
  }

  const [messages, unread, projects, testimonials, blogs] = await Promise.all([
    count("messages"),
    count("messages", true),
    count("projects"),
    count("testimonials"),
    count("blogs"),
  ]);

  const cards = [
    { label: "Messages", value: messages, sub: `${unread} unread`, href: "/is-control-portal/messages", icon: Inbox },
    { label: "Projects", value: projects, sub: "in database", href: "/is-control-portal/projects", icon: FolderGit2 },
    { label: "Testimonials", value: testimonials, sub: "total", href: "/is-control-portal/testimonials", icon: Quote },
    { label: "Blog posts", value: blogs, sub: "in database", href: "/is-control-portal/blogs", icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-os-muted">Manage your portfolio content.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/8"
            >
              <Icon size={20} className="text-accent" />
              <div className="mt-3 text-3xl font-bold">{c.value}</div>
              <div className="text-sm font-medium">{c.label}</div>
              <div className="text-xs text-os-muted">{c.sub}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
