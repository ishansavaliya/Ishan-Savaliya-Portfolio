import { createServerSupabase } from "@/lib/supabase/server";

interface P {
  id: string;
  name: string;
  tagline: string | null;
  category: string;
  featured: boolean;
}

export default async function AdminProjectsPage() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase.from("projects").select("id,name,tagline,category,featured").order("sort_order")
    : { data: [] as P[] };
  const projects = (data ?? []) as P[];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Projects</h1>
      <p className="mt-1 text-os-muted">
        {projects.length} projects in the database. Edit content in Supabase or
        update <code className="text-accent-pink">lib/content/seed.ts</code> and
        re-run the seed.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-os-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Tagline</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-white/8">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-os-muted">{p.tagline}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.featured ? "★" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
