import type { Metadata } from "next";
import { WriteBlog } from "@/components/apps/blog/WriteBlog";

export const metadata: Metadata = {
  title: "Write a Post — Ishan Savaliya Blog",
  description:
    "Submit a guest blog post for Ishan Savaliya's blog. Posts are reviewed before publishing.",
  robots: { index: false },
};

export default function WritePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Write a post</h1>
      <p className="mb-6 text-os-muted">
        Share a post on the blog. Submissions are reviewed before publishing.
      </p>
      <div className="overflow-hidden rounded-2xl border border-glass-border">
        <WriteBlog />
      </div>
    </div>
  );
}
