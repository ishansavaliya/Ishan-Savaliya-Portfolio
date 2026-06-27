export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  /** CSS background gradient used when there is no uploaded cover image. */
  coverGradient: string;
  /** Uploaded cover image URL (Supabase storage), if any. */
  coverImage?: string;
  /** Markdown body. */
  body: string;
  /** Author credit — defaults to the site owner for first-party posts. */
  authorName?: string;
  /** Author link (portfolio / social), shown with the credit. */
  authorUrl?: string;
  /** Total likes. */
  likes?: number;
}

export interface BlogComment {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  createdAt: string;
}
