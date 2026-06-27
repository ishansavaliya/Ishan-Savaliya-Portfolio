import type { PortfolioContent } from "@/types/content";

/**
 * Canonical portfolio content for Ishan Savaliya, consolidated from his
 * resumes (main full-stack CV is the current source of truth) and the
 * Greendotslab recommendation letter.
 *
 * This is the static fallback used everywhere when Supabase is not connected.
 * When the database is wired (Phase 2), the same shape is returned from
 * Postgres and this file seeds the initial rows.
 */
export const SEED: PortfolioContent = {
  profile: {
    name: "Ishan Savaliya",
    fullName: "Ishan Bhaveshbhai Savaliya",
    title: "Full-Stack Developer",
    tagline:
      "Building production-grade web apps across React.js & Spring Boot ecosystems.",
    location: "Surat, Gujarat, India",
    email: "ishansavaliya787@gmail.com",
    phone: "+91 7990408235",
    availability: "open",
    availabilityNote: "Open to full-time & freelance opportunities",
    summary:
      "Full-Stack Developer with hands-on experience building production-grade web applications across React.js and Spring Boot ecosystems. Skilled in designing scalable backend systems, REST APIs, and schema-driven architectures with PostgreSQL and dynamic data models. Experienced in cloud deployment, CI/CD pipelines, and distributed system workflows using AWS, DigitalOcean, and modern DevOps tools. Focused on delivering high-performance applications with clean system design, real-world problem solving, and AI-integrated features.",
    about: [
      "I'm a Full-Stack Developer currently building production systems at EMGAGE, working across React.js, Spring Boot, Hibernate and SQL with scalable architecture design.",
      "I love designing schema-driven backends, REST APIs and AI-integrated features — and shipping them to the cloud with CI/CD pipelines on AWS and DigitalOcean.",
      "When I'm not coding, I'm sharpening DSA, exploring system design, and building side projects that solve real problems.",
      "I also have a strong interest in Data Science, Machine Learning and AI agents.",
    ],
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/ishansavaliya",
        handle: "ishansavaliya",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/iamishansavaliya",
        handle: "iamishansavaliya",
      },
      {
        label: "LeetCode",
        url: "https://leetcode.com/u/ishansavaliya",
        handle: "ishansavaliya",
      },
      {
        label: "Codolio",
        url: "https://codolio.com/profile/ishansavaliya",
        handle: "ishansavaliya",
      },
      {
        label: "Portfolio",
        url: "https://ishansavaliya.vercel.app",
        handle: "ishansavaliya.vercel.app",
      },
    ],
    resumeUrl: "/resume/ishan-savaliya-resume.pdf",
    avatarUrl: "/brand/is-logo.png",
  },

  experience: [
    {
      id: "emgage",
      company: "EMGAGE",
      companyUrl: "https://emgage.work",
      role: "Full-Stack Developer",
      type: "internship",
      start: "Sept 2025",
      end: "Present",
      location: "India",
      current: true,
      highlights: [
        "Working on production-grade full-stack applications using React.js, Spring Boot, Hibernate, and SQL with scalable architecture design.",
        "Designed and developed RESTful APIs and integrated them with dynamic front-end systems ensuring high performance and responsiveness.",
        "Implemented CI/CD pipelines using Jenkins for automated build, testing, and deployment workflows.",
        "Deployed applications on AWS cloud infrastructure including EC2, S3, and cloud-based environments for scalability and reliability.",
        "Managed GitLab repositories with complete branch management workflows including feature branching, merging, and version control.",
        "Collaborated in agile development cycles — sprint planning, code reviews, and production releases.",
        "Worked on AI-based integrations including MCP architecture and intelligent system enhancements in real-world applications.",
        "Improved application performance, optimized backend queries, and enhanced system reliability for production-level systems.",
      ],
      stack: [
        "React.js",
        "Spring Boot",
        "Hibernate",
        "SQL",
        "Jenkins",
        "AWS",
        "GitLab",
        "MCP",
      ],
    },
    {
      id: "brainybeam",
      company: "Brainybeam Info-Tech Pvt. Ltd.",
      companyUrl: "https://brainybeam.com",
      role: "MERN Stack Intern",
      type: "internship",
      start: "May 2025",
      end: "June 2025",
      location: "India",
      current: false,
      highlights: [
        "Contributed to live MERN stack projects and collaborated with senior developers in a fast-paced agile environment.",
        "Gained hands-on experience in full-stack development, enhancing skills in MongoDB, Express.js, React.js, and Node.js.",
        "Improved code quality, debugging techniques, and deployment workflows through real-world development tasks.",
      ],
      stack: ["MongoDB", "Express.js", "React.js", "Node.js"],
    },
    {
      id: "greendotslab",
      company: "Greendotslab Software Solutions",
      role: "Junior Developer (Internship)",
      type: "internship",
      start: "2025",
      end: "2025",
      location: "Surat, Gujarat",
      current: false,
      highlights: [
        "Recognized by the proprietor for strong skills, work ethic and character during the internship.",
        "Recommended for Junior Developer roles — “a quick learner with a positive mindset, a pleasure to work with.”",
      ],
      stack: ["JavaScript", "React.js", "Node.js"],
    },
  ],

  projects: [
    {
      id: "interviewready",
      name: "InterviewReady",
      tagline: "AI Interview Platform",
      category: "personal",
      featured: true,
      description:
        "An AI-driven web app simulating real interviews with speech-to-text, webcam feedback, and analytics.",
      highlights: [
        "Developed an AI-driven web app simulating real interviews with speech-to-text, webcam feedback, and analytics.",
        "Boosted candidate preparation efficiency by 50% through personalized resume tools and real-time coaching.",
        "Integrated resume builder, career chatbot, and performance analysis dashboards for improved user engagement.",
      ],
      stack: ["React.js", "Tailwind CSS", "TypeScript", "Firebase", "Gemini API"],
      github:
        "https://github.com/ishansavaliya/InterviewReady-an-AI-Interview-Preparation",
      metrics: [{ label: "Prep efficiency", value: "+50%" }],
    },
    {
      id: "wire2web",
      name: "Wire2Web",
      tagline: "AI Wireframe to Code Converter",
      category: "personal",
      featured: true,
      description:
        "A responsive platform converting wireframes into code using AI models like OpenAI, Gemini, and Llama, with real-time code generation and export.",
      highlights: [
        "Built a responsive React + Tailwind platform converting wireframes using AI models like OpenAI, Gemini, and Llama, enabling real-time code and export features.",
        "Increased developer productivity by 35% and reduced front-end effort by 40% with design management and code regeneration.",
      ],
      stack: ["Next.js 15", "React 18", "Tailwind CSS", "Firebase", "Drizzle ORM"],
      github:
        "https://github.com/ishansavaliya/Wire2Web-Wireframe-to-Code-Generator",
      metrics: [
        { label: "Productivity", value: "+35%" },
        { label: "FE effort", value: "-40%" },
      ],
    },
    {
      id: "jobverse",
      name: "JobVerse",
      tagline: "Full-Stack Job Portal",
      category: "personal",
      featured: true,
      description:
        "A full-stack job portal connecting recruiters and job seekers with secure JWT auth, dashboards and recruiter workflows.",
      highlights: [
        "Developed a full-stack job portal connecting recruiters and job seekers with secure JWT authentication, dashboards, Redux, RESTful APIs, Cloudinary, and responsive routing.",
        "Reduced hiring time by 30% by streamlining applications, job posts, and recruiter workflows.",
      ],
      stack: ["React.js", "Node.js", "MongoDB", "Express.js", "JWT", "Redux"],
      github: "https://github.com/ishansavaliya/JobVerse-a-Job-Portal-Website",
      metrics: [{ label: "Hiring time", value: "-30%" }],
    },
    {
      id: "farmzy",
      name: "Farmzy",
      tagline: "Multi-Vendor Event & Service Booking System",
      category: "freelance",
      featured: true,
      description:
        "A multi-vendor booking system for event services (venues, photography, DJ) with schema-driven architecture and multi-service bookings in a single flow.",
      highlights: [
        "Developed a multi-vendor booking system enabling users to discover and book event services with support for multi-service bookings in a single flow.",
        "Implemented a schema-driven architecture where dynamic forms, filters, and listing structures are generated from backend-defined JSON schemas.",
        "Designed a modular backend using Spring Boot with REST APIs for services, bookings, categories, and vendor workflows.",
        "Built a PostgreSQL data model using JSONB fields to store dynamic attributes, eliminating rigid schema constraints across service categories.",
        "Implemented booking system with parent-child structure (bookings + booking_items) to support multi-vendor transactions.",
        "Developed role-based workflows including vendor listing submission, admin approval pipeline (Draft → Pending → Approved), and user booking lifecycle.",
        "Integrated availability management using date-based blocking and validation before booking confirmation.",
      ],
      stack: [
        "React",
        "Spring Boot",
        "PostgreSQL (JSONB)",
        "Redis",
        "Elasticsearch",
        "DigitalOcean",
        "Cloudflare",
        "Vercel",
      ],
      live: "https://www.farmzy.studio",
    },
    {
      id: "firefighter",
      name: "FireFighter E-Commerce",
      tagline: "Multi-Role E-Commerce Platform",
      category: "freelance",
      featured: true,
      description:
        "A complete multi-role e-commerce system for firefighters with Admin, Vendor, and User panels and Razorpay payments.",
      highlights: [
        "Developed a complete multi-role e-commerce system for firefighters including Admin, Vendor, and User panels.",
        "Built secure authentication, product management, order workflows, and role-based dashboards.",
        "Integrated Razorpay payment gateway for seamless online transactions.",
        "Designed scalable backend APIs and responsive UI for real-world client usage.",
      ],
      stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Razorpay"],
    },
    {
      id: "rasvaad",
      name: "Rasvaad",
      tagline: "Catering Business Website (Next.js + CMS)",
      category: "freelance",
      featured: true,
      description:
        "A modern, SEO-optimized catering website with SSR and a CMS for client-managed content. Live for a real client.",
      highlights: [
        "Built a modern, SEO-optimized website using Next.js with server-side rendering and optimized performance.",
        "Integrated a CMS for dynamic content management enabling client-side updates without developer dependency.",
        "Configured domain and production deployment with performance tuning.",
      ],
      stack: ["Next.js", "Sanity CMS", "JavaScript", "SEO"],
      live: "https://rasvaad.in",
    },
    {
      id: "agripredict",
      name: "Crop Recommendation System",
      tagline: "ML Agriculture Platform",
      category: "data-science",
      featured: false,
      description:
        "A Machine Learning system using Random Forest to analyze soil parameters and recommend optimal crops with 93.86% accuracy.",
      highlights: [
        "Developed a Machine Learning system using Random Forest Classifier to analyze soil parameters and recommend optimal crops with 93.86% accuracy.",
        "Increased crop yield predictions by 25% and improved resource efficiency for farmers through data-driven agricultural insights.",
      ],
      stack: ["Python", "Random Forest", "Streamlit", "Scikit-learn", "Pandas", "NumPy"],
      github: "https://github.com/ishansavaliya/AgriPredict",
      metrics: [{ label: "Accuracy", value: "93.86%" }],
    },
    {
      id: "heart-disease",
      name: "Heart Disease Prediction",
      tagline: "Medical AI Platform",
      category: "data-science",
      featured: false,
      description:
        "A healthcare prediction system using Logistic Regression to assess heart disease risk from medical parameters.",
      highlights: [
        "Built a healthcare prediction system using Logistic Regression to analyze medical parameters and predict heart disease risk with high accuracy.",
        "Reduced diagnostic delays by 40% by providing quick risk assessment for healthcare professionals and individuals.",
      ],
      stack: ["Python", "Logistic Regression", "Streamlit", "Pandas", "NumPy", "Scikit-learn"],
      github: "https://github.com/ishansavaliya/Heart-Disease-Prediction",
    },
    {
      id: "stock-market",
      name: "Stock Market Prediction",
      tagline: "Finance Forecasting Platform",
      category: "data-science",
      featured: false,
      description:
        "A stock forecasting system using statistical and ML techniques with an interactive search-and-visualize web interface.",
      highlights: [
        "Developed a stock market forecasting system using statistical and machine learning techniques to analyze historical stock data and predict future trends.",
        "Created an interactive web interface allowing users to search companies and visualize stock predictions with dynamic charts.",
      ],
      stack: ["Python", "Streamlit", "YFinance", "Scikit-learn", "Pandas"],
      github: "https://github.com/ishansavaliya/Stock-Market-Prediction",
    },
  ],

  skills: [
    {
      id: "frontend",
      label: "Frontend",
      skills: [
        { name: "React.js", level: "advanced" },
        { name: "Next.js", level: "advanced" },
        { name: "TypeScript", level: "advanced" },
        { name: "JavaScript", level: "expert" },
        { name: "Tailwind CSS", level: "advanced" },
        { name: "HTML", level: "expert" },
        { name: "CSS", level: "expert" },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      skills: [
        { name: "Spring Boot", level: "advanced" },
        { name: "Node.js", level: "advanced" },
        { name: "Express.js", level: "advanced" },
        { name: "Hibernate", level: "intermediate" },
        { name: "RESTful API", level: "advanced" },
        { name: "Firebase", level: "intermediate" },
      ],
    },
    {
      id: "databases",
      label: "Databases",
      skills: [
        { name: "PostgreSQL (JSONB)", level: "advanced" },
        { name: "MongoDB", level: "advanced" },
        { name: "SQL", level: "advanced" },
        { name: "Redis", level: "intermediate" },
        { name: "Elasticsearch", level: "intermediate" },
      ],
    },
    {
      id: "languages",
      label: "Languages",
      skills: [
        { name: "JavaScript", level: "expert" },
        { name: "TypeScript", level: "advanced" },
        { name: "Java", level: "advanced" },
        { name: "Python", level: "advanced" },
      ],
    },
    {
      id: "devops",
      label: "Tools & DevOps",
      skills: [
        { name: "Git", level: "expert" },
        { name: "GitHub", level: "expert" },
        { name: "GitLab", level: "advanced" },
        { name: "Docker", level: "advanced" },
        { name: "Jenkins", level: "intermediate" },
        { name: "AWS", level: "intermediate" },
        { name: "DigitalOcean", level: "intermediate" },
        { name: "Cloudflare", level: "intermediate" },
        { name: "Linux", level: "advanced" },
        { name: "Bash", level: "advanced" },
        { name: "Vercel", level: "advanced" },
      ],
    },
    {
      id: "ml",
      label: "ML & Data",
      skills: [
        { name: "Scikit-learn", level: "intermediate" },
        { name: "Pandas", level: "intermediate" },
        { name: "NumPy", level: "intermediate" },
        { name: "Streamlit", level: "intermediate" },
      ],
    },
    {
      id: "other",
      label: "Other",
      skills: [
        { name: "Data Structures & Algorithms", level: "advanced" },
        { name: "System Design Basics", level: "intermediate" },
        { name: "API Design", level: "advanced" },
        { name: "CI/CD Pipelines", level: "advanced" },
      ],
    },
  ],

  education: [
    {
      id: "adit",
      institution: "A.D. Patel Institute of Technology",
      degree: "B.Tech in Information Technology",
      grade: "CGPA: 8.49",
      start: "2022",
      end: "2026",
      location: "Anand, Gujarat",
    },
    {
      id: "hsc",
      institution: "Nalanda Vidhyalaya - 2",
      degree: "HSC (Higher Secondary)",
      grade: "Grade A2 · Percentile 97.04",
      start: "",
      end: "2022",
      location: "Surat, Gujarat",
    },
    {
      id: "ssc",
      institution: "Nalanda Vidhyalaya - 2",
      degree: "SSC (Secondary)",
      grade: "Grade A2 · Percentile 98.43",
      start: "",
      end: "2020",
      location: "Surat, Gujarat",
    },
  ],

  certifications: [
    {
      id: "meta-frontend",
      name: "Meta Front-End Developer",
      issuer: "Meta · Coursera",
      url: "https://www.coursera.org/account/accomplishments/specialization/5GDQX7IDJ8O0",
      category: "Meta",
    },
    {
      id: "meta-backend",
      name: "Meta Back-End Developer",
      issuer: "Meta · Coursera",
      url: "https://www.coursera.org/account/accomplishments/specialization/O4QYH20S8AAM",
      category: "Meta",
    },
    {
      id: "ibm-ds",
      name: "IBM Data Science Professional Certificate",
      issuer: "IBM · Coursera",
      url: "https://www.coursera.org/account/accomplishments/specialization/1SMHP7J5TO89",
      category: "IBM",
    },
  ],

  testimonials: [
    {
      id: "nikunj-greendotslab",
      name: "Nikunj Sardhara",
      role: "Proprietor",
      company: "Greendotslab Software Solutions",
      quote:
        "It is my pleasure to recommend Ishan Savaliya. During his internship I was consistently impressed by his skills, work ethic and character. He is a quick learner with a positive mindset — a pleasure to work with.",
    },
  ],

  achievements: [
    {
      id: "emgage-prod",
      title: "Shipping production systems at EMGAGE",
      description:
        "Building and deploying production-grade full-stack applications with CI/CD on AWS.",
      date: "2025",
      category: "milestone",
    },
    {
      id: "farmzy-live",
      title: "Farmzy live for a real client",
      description:
        "Delivered a schema-driven multi-vendor booking platform now live at farmzy.studio.",
      category: "milestone",
    },
    {
      id: "agri-accuracy",
      title: "93.86% ML model accuracy",
      description:
        "Crop Recommendation System using Random Forest reached 93.86% classification accuracy.",
      category: "milestone",
    },
  ],
};
