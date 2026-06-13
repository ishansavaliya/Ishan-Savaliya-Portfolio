/**
 * Server-rendered, visually-hidden semantic content.
 * The desktop UI is canvas-like and client-only, so this gives search engines
 * and screen readers real, indexable text about Ishan Savaliya.
 */
export function SeoContent() {
  return (
    <div className="sr-only">
      <h1>Ishan Savaliya — Full Stack Developer</h1>
      <p>
        Ishan Savaliya is a full stack developer specializing in React,
        Next.js, TypeScript, Node.js and modern web platforms. This portfolio
        is presented as Ishan OS, a macOS-style developer operating system, with
        applications for projects, experience, skills, blog, resume and contact.
      </p>
      <nav aria-label="Sections">
        <ul>
          <li>About</li>
          <li>Experience</li>
          <li>Projects</li>
          <li>Skills</li>
          <li>Blog</li>
          <li>Resume</li>
          <li>Contact</li>
        </ul>
      </nav>
    </div>
  );
}
