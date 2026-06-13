import { createServerSupabase } from "@/lib/supabase/server";
import { markMessageRead, deleteMessage } from "../actions";
import { Mail, Trash2, Check } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

export default async function MessagesPage() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
    : { data: [] as Message[] };
  const messages = (data ?? []) as Message[];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-os-muted">
        Contact-form inquiries, newest first.
      </p>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-xl bg-white/5 p-10 text-center text-os-muted ring-1 ring-white/10">
          <Mail size={32} className="mx-auto mb-2 opacity-50" />
          No messages yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl p-4 ring-1 ring-white/10 ${
                m.read ? "bg-white/4" : "bg-accent/8"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.name}</span>
                    {!m.read && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {m.email}
                  </a>
                  {m.subject && (
                    <div className="mt-1 text-sm font-medium text-os-fg/90">
                      {m.subject}
                    </div>
                  )}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-os-fg/80">
                    {m.body}
                  </p>
                  <div className="mt-2 text-xs text-os-muted">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <form action={markMessageRead.bind(null, m.id, !m.read)}>
                    <button
                      className="rounded-lg p-2 text-os-muted hover:bg-white/10"
                      title={m.read ? "Mark unread" : "Mark read"}
                    >
                      <Check size={16} className={m.read ? "" : "text-accent"} />
                    </button>
                  </form>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <button
                      className="rounded-lg p-2 text-os-muted hover:bg-white/10 hover:text-accent-red"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
