import { ResumeData } from "./types";

export const WASI_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Wasi Bahadur",
    title: "Freelance Python Developer & Data Specialist",
    email: "bahadurwasi@gmail.com",
    phone: "0322-7436731",
    location: "Gujrat, Pakistan",
    website: "",
    github: "github.com/wasibahadur01",
    linkedin: "linkedin.com/in/wasibahadur",
    photoUrl: "",
  },
  summary: "Results-driven Python Developer and self-taught Data Analyst specializing in building custom web scrapers, interactive performance dashboards, and automation scripts. Adept in utilizing Pandas, NumPy, and Generative AI prompt engineering to deliver clean, structured datasets and automated workflows that streamline operations.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Developer (Freelance)",
      company: "Self-Employed / Independent Gigs",
      location: "Remote",
      startDate: "2025-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Engineered a high-performance Web Scraper using BeautifulSoup and Requests, extracting structured product catalogs from 15+ target sites and automating exports to clean CSV. [Weak bullet: add number of target sites or average pages scraped, e.g. 10,000+ pages, if available]",
        "Developed custom Data Analysis Dashboards in Python (Pandas & NumPy) to clean raw marketing campaign datasets and visualize performance trends. [Weak bullet: add impact, e.g. improving data-to-decision time by 30%]",
        "Programmed a modular Weather Client that dynamically queries global REST APIs, optimizing response caching to ensure zero latency graphical updates. [Weak bullet: specify if you served this to any users or used a specific UI library like Tkinter]",
        "Created an intelligent desktop Virtual Assistant incorporating SpeechRecognition and voice automation to replace manual key-entry operations. [Weak bullet: add automation rate or productivity percentage, e.g. accelerating workflows by 40%]"
      ]
    },
    {
      id: "exp-2",
      role: "Software Logic Specialist",
      company: "Academic & Personal Projects",
      location: "Gujrat, Pakistan",
      startDate: "2024-06",
      endDate: "2024-12",
      current: false,
      bullets: [
        "Architected a logic-based Number Guessing Game in Python, demonstrating advanced command of nested control flows, error containment, and secure user-input state validation.",
        "Created scalable repository code structures on Git/GitHub to enable clean version control and structured collaboration workflows."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "BS Computer Science (Admission Pending)",
      school: "University of Gujrat (UOG)",
      location: "Gujrat, Pakistan",
      startDate: "2025-09",
      endDate: "Present",
      current: true,
      gpa: "",
      description: "Application submitted and processing for the incoming fall term. Focused on academic mastery in Software Engineering, Algorithms, and Database Management Systems."
    },
    {
      id: "edu-2",
      degree: "Intermediate — ICS (Physics with Computer Science)",
      school: "Intermediate College Board",
      location: "Gujrat, Pakistan",
      startDate: "2023-09",
      endDate: "2025-06",
      current: false,
      gpa: "Passed",
      description: "Specialized study in computer science fundamentals, logic design, algebra, and basic physics."
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programming Languages",
      skills: ["Python", "SQL (Basics)", "HTML/CSS (Basics)"]
    },
    {
      id: "skill-2",
      category: "Libraries & Core Tools",
      skills: ["Pandas", "NumPy", "BeautifulSoup", "Requests", "Tkinter", "SpeechRecognition"]
    },
    {
      id: "skill-3",
      category: "AI & Prompt Engineering",
      skills: ["Google AI Studio", "ChatGPT", "Claude", "Prompt Engineering", "Generative AI Applications"]
    },
    {
      id: "skill-4",
      category: "Data & Workflows",
      skills: ["Data Cleaning", "Exploratory Data Analysis", "Dashboard Building", "Excel", "VS Code", "Git / GitHub", "Command Line"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Global Tech Campaign Data Analysis Dashboard",
      description: "A Python-based data cleaning and visualization tool built using Pandas and NumPy to ingest raw marketing campaign logs, perform descriptive analysis, and output charts detailing ROI metrics.",
      url: "github.com/wasibahadur01/data-dashboard",
      technologies: ["Python", "Pandas", "NumPy", "Tkinter"]
    },
    {
      id: "proj-2",
      name: "Automated CSV Web Extractor",
      description: "A robust scraper engineered with BeautifulSoup and Requests to securely scrape unstructured web catalog fields and process them into cleanly formatted CSV tables.",
      url: "github.com/wasibahadur01/web-scraper",
      technologies: ["Python", "BeautifulSoup", "Requests", "CSV"]
    }
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Fluent" },
    { id: "lang-2", name: "Urdu", proficiency: "Native" },
    { id: "lang-3", name: "Japanese", proficiency: "Certified (NUML)" }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Google AI Professional Certificate",
      issuer: "Google",
      date: "2026-06"
    },
    {
      id: "cert-2",
      name: "Data Analyst with Python",
      issuer: "IBM",
      date: "2026-04"
    },
    {
      id: "cert-3",
      name: "Japanese Language Certificate",
      issuer: "National University of Modern Languages (NUML)",
      date: "2026-01"
    },
    {
      id: "cert-4",
      name: "Generative AI Suite: Prompt Engineering & Applications",
      issuer: "IBM",
      date: "In Progress"
    },
    {
      id: "cert-5",
      name: "Build, Launch, and Manage E-commerce Stores",
      issuer: "Google",
      date: "2025-11"
    },
    {
      id: "cert-6",
      name: "Fundamentals of Financial Analysis",
      issuer: "London Business School",
      date: "2025-08"
    }
  ]
};
