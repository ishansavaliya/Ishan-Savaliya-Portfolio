export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  coverGradient: string; // CSS background for the cover
  /** Markdown body. */
  body: string;
}
