// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Ankita Singh",
  brandName: "ANKITA SINGH",
  role: "Data Analyst",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "ankitasingh27cs@gmail.com",
  phone: "+917806000879",
  availability: "Open to Internships and Full time Role",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/Ankita6455",
  linkedin: "https://www.linkedin.com/in/ankita-singh-962881291/",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro: "I turn raw data into meaningful insights and interactive dashboards.",
  statusLines: [
    "Analyzing data with Python & SQL",
    "Building interactive Power BI dashboards",
    "Always learning new technologies",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Turning raw data into meaningful insights.",
  paragraph:
    "I am a Computer Science graduate interested in data analytics and problem-solving. I work with Python, Java, SQL, Excel, Power BI, and Tableau to analyze data and create meaningful insights. I enjoy learning new tools and applying my skills to real-world projects, currently sharpening my skills through the placement training program at TAP Academy.",
  stats: [
    { value: 8.19, suffix: "", label: "B.Tech CGPA" },
    { value: 4, suffix: " Wks", label: "AICTE Internship" },
    { value: 300, suffix: "+", label: "DSA problems solved" },
  ],
};

export const skillGroups = [
  {
    title: "Programming",
    items: ["Python", "Java", "OOP Concepts"],
  },
  {
    title: "Data Analytics",
    items: ["SQL", "MySQL", "Pandas", "NumPy", "Data Cleaning", "EDA", "KPI Analysis"],
  },
  {
    title: "Visualization",
    items: ["Power BI", "Tableau", "Microsoft Excel", "Dashboard Development"],
  },
  {
    title: "Web & Tools",
    items: ["HTML", "CSS", "JavaScript", "GitHub", "VS Code", "Jupyter Notebook"],
  },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Superstore Sales Dashboard",
    description:
      "Developed an interactive Power BI dashboard to analyze sales across product categories, regions, customer segments, and payment methods. Used visualizations and filters to identify trends and present business insights.",
    tags: ["Power BI", "Excel", "Data Visualization"],
    year: "2026",
    liveUrl: "https://github.com/Ankita6455",
    githubUrl: "https://github.com/Ankita6455",
  },
  {
    id: "project-2",
    number: "02",
    title: "Healthcare Risk Prediction & Stratification",
    description:
      "Created SQL tables and queries across multiple tables, performed data analysis, validation, and visualization, and developed a Python-based healthcare risk prediction model. Also worked on deploying a healthcare risk stratification application.",
    tags: ["Python", "SQL", "Data Analysis"],
    year: "2026",
    liveUrl: "https://github.com/Ankita6455",
    githubUrl: "https://github.com/Ankita6455",
  },
  {
    id: "project-3",
    number: "03",
    title: "Web-Based Chat Application",
    description:
      "Developed a web application combining chat functionality with music streaming features, focusing on responsive design and a user-friendly interface.",
    tags: ["HTML", "CSS", "JavaScript"],
    year: "2026",
    liveUrl: "https://github.com/Ankita6455",
    githubUrl: "https://github.com/Ankita6455",
  },
  {
    id: "project-4",
    number: "04",
    title: "ATM Simulation System",
    description:
      "Developed an academic programming project to demonstrate ATM operations and basic programming concepts.",
    tags: ["Java", "OOP", "Banking System"],
    year: "2026",
    liveUrl: "https://github.com/Ankita6455",
    githubUrl: "https://github.com/Ankita6455",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Placement Training",
    org: "TAP Academy",
    description:
      "Developing technical and professional skills in programming, problem-solving, and interview preparation.",
  },
  {
    period: "2026",
    role: "AICTE-Certified Intern",
    org: "AICTE Internship Program",
    description:
      "Gained practical exposure to Python, data analytics, and problem-solving through healthcare-related challenges.",
  },
  {
    period: "2022 — 2026",
    role: "B.Tech in Computer Science & Engineering",
    org: "Bansal Institute of Science & Technology, Bhopal",
    description:
      "Graduated with 8.19 CGPA and built a foundation in programming, databases, and analytics.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};

