/**
 * Maps skill names to devicon CDN slugs (real tech logos, no install).
 * https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<slug>/<slug>-original.svg
 */
const MAP: Record<string, string> = {
  "React.js": "react/react-original",
  React: "react/react-original",
  "Next.js": "nextjs/nextjs-original",
  "Next.js 15": "nextjs/nextjs-original",
  "React 18": "react/react-original",
  TypeScript: "typescript/typescript-original",
  JavaScript: "javascript/javascript-original",
  "Tailwind CSS": "tailwindcss/tailwindcss-original",
  HTML: "html5/html5-original",
  CSS: "css3/css3-original",
  "Spring Boot": "spring/spring-original",
  "Node.js": "nodejs/nodejs-original",
  "Express.js": "express/express-original",
  Hibernate: "hibernate/hibernate-original",
  Firebase: "firebase/firebase-plain",
  "PostgreSQL (JSONB)": "postgresql/postgresql-original",
  PostgreSQL: "postgresql/postgresql-original",
  MongoDB: "mongodb/mongodb-original",
  SQL: "azuresqldatabase/azuresqldatabase-original",
  Redis: "redis/redis-original",
  Elasticsearch: "elasticsearch/elasticsearch-original",
  Java: "java/java-original",
  Python: "python/python-original",
  Git: "git/git-original",
  GitHub: "github/github-original",
  GitLab: "gitlab/gitlab-original",
  Docker: "docker/docker-original",
  Jenkins: "jenkins/jenkins-original",
  AWS: "amazonwebservices/amazonwebservices-original-wordmark",
  DigitalOcean: "digitalocean/digitalocean-original",
  Cloudflare: "cloudflare/cloudflare-original",
  Linux: "linux/linux-original",
  Bash: "bash/bash-original",
  Vercel: "vercel/vercel-original",
  "Scikit-learn": "scikitlearn/scikitlearn-original",
  Pandas: "pandas/pandas-original",
  NumPy: "numpy/numpy-original",
  Streamlit: "streamlit/streamlit-original",
  "RESTful API": "",
  "Drizzle ORM": "",
  "Sanity CMS": "",
  Razorpay: "",
  JWT: "",
  Redux: "redux/redux-original",
  "Gemini API": "",
  MCP: "",
  "Random Forest": "",
  "Logistic Regression": "",
  YFinance: "",
  Hostinger: "",
  SEO: "",
};

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export function skillIcon(name: string): string | null {
  const slug = MAP[name];
  return slug ? `${CDN}/${slug}.svg` : null;
}
