import { createServerSupabase } from "@/lib/supabase/server";
import { setAnnouncement, deleteAnnouncement, toggleAnnouncement } from "../actions";
import { Trash2 } from "lucide-react";

interface A {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export default async function AnnouncementsPage() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase.from("announcements").select("*").order("created_at", { ascending: false })
    : { data: [] as A[] };
  const items = (data ?? []) as A[];

  async function create(formData: FormData) {
    "use server";
    const message = String(formData.get("message") || "").trim();
    if (message) await setAnnouncement(message, true);
  }

  async function remove(formData: FormData) {
    "use server";
    await deleteAnnouncement(String(formData.get("id")));
  }

  async function toggle(formData: FormData) {
    "use server";
    await toggleAnnouncement(
      String(formData.get("id")),
      formData.get("active") === "true"
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Announcements</h1>
      <p className="mt-1 text-os-muted">
        Post a status banner (e.g. “Available for freelance”). The active one
        shows in the site hero. Only one can be active at a time.
      </p>

      <form action={create} className="mt-5 flex gap-2">
        <input
          name="message"
          placeholder="New announcement…"
          className="flex-1 rounded-lg bg-white/6 px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent"
        />
        <button className="rounded-lg bg-accent px-4 font-medium text-white">
          Post
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {items.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10"
          >
            <span className="min-w-0 flex-1 truncate">{a.message}</span>
            <div className="flex shrink-0 items-center gap-2">
              <form action={toggle}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="active" value={String(!a.active)} />
                <button
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    a.active
                      ? "bg-accent-green/15 text-accent-green hover:bg-accent-green/25"
                      : "bg-white/8 text-os-muted hover:bg-white/14"
                  }`}
                >
                  {a.active ? "Active" : "Inactive"}
                </button>
              </form>
              <form action={remove}>
                <input type="hidden" name="id" value={a.id} />
                <button
                  aria-label="Delete announcement"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-os-muted transition hover:bg-accent-red/15 hover:text-accent-red"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-os-muted">No announcements.</p>}
      </div>
    </div>
  );
}
