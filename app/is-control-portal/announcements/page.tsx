import { createServerSupabase } from "@/lib/supabase/server";
import { setAnnouncement } from "../actions";

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

  return (
    <div>
      <h1 className="text-2xl font-semibold">Announcements</h1>
      <p className="mt-1 text-os-muted">
        Post a status banner (e.g. “Available for freelance”).
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
            className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10"
          >
            <span>{a.message}</span>
            <span
              className={`text-xs ${a.active ? "text-accent-green" : "text-os-muted"}`}
            >
              {a.active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
        {items.length === 0 && <p className="text-os-muted">No announcements.</p>}
      </div>
    </div>
  );
}
