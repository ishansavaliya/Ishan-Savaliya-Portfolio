import { createServerSupabase } from "@/lib/supabase/server";
import { toggleTestimonial } from "../actions";

interface T {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  approved: boolean;
}

export default async function TestimonialsPage() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase.from("testimonials").select("*").order("created_at", { ascending: false })
    : { data: [] as T[] };
  const items = (data ?? []) as T[];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Testimonials</h1>
      <p className="mt-1 text-os-muted">
        Approve which testimonials appear publicly.
      </p>
      <div className="mt-6 space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="italic text-os-fg/85">“{t.quote}”</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-os-muted">
                — {t.name}
                {t.role ? `, ${t.role}` : ""}
                {t.company ? ` @ ${t.company}` : ""}
              </span>
              <form action={toggleTestimonial.bind(null, t.id, !t.approved)}>
                <button
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    t.approved
                      ? "bg-accent-green/20 text-accent-green"
                      : "bg-white/10 text-os-muted"
                  }`}
                >
                  {t.approved ? "Approved (click to hide)" : "Hidden (click to approve)"}
                </button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-os-muted">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
