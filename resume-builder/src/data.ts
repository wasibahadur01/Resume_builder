import { ResumeData } from "./types";

export const SAMPLE_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    title: "Senior Full-Stack Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    github: "github.com/alexrivera",
    linkedin: "linkedin.com/in/alexrivera",
  },
  summary: "Driven Full-Stack Engineer with 6+ years of experience designing, building, and optimizing scalable web applications. Expert in React, Node.js, and cloud architecture (AWS/GCP), with a proven track record of reducing database latency by 40% and leading high-performance engineering teams to deliver critical products ahead of schedule.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Full-Stack Developer",
      company: "CloudVibe Systems",
      location: "San Francisco, CA",
      startDate: "2023-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed a multi-tenant SaaS dashboard using React, Next.js, and TypeScript, improving core web vitals by 35% and active engagement by 22%.",
        "Led a cross-functional team of 6 engineers to build an AI-powered data processing pipeline, reducing server workloads by 45% using event-driven serverless architectures.",
        "Refactored legacy PostgreSQL queries and integrated Redis cache layers, cutting global API response latency from 680ms to less than 120ms.",
        "Mentored junior engineers and established automated CI/CD workflows, reducing deployment-related production incidents by 80%."
      ],
    },
    {
      id: "exp-2",
      role: "Software Engineer III",
      company: "DataSync Technologies",
      location: "Seattle, WA",
      startDate: "2020-06",
      endDate: "2023-02",
      current: false,
      bullets: [
        "Designed and implemented high-throughput RESTful and GraphQL APIs in Node.js, handling over 12 million daily client requests with 99.99% uptime.",
        "Co-developed an analytics platform processing real-time telemetry datasets using Apache Kafka and PostgreSQL, enabling microsecond insights.",
        "Spearheaded adoption of Tailwind CSS and design tokens across the engineering department, reducing front-end development cycle times by 30%."
      ],
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-09",
      endDate: "2020-05",
      current: false,
      gpa: "3.85 / 4.0",
      description: "Specialized in Software Engineering and Distributed Systems. Magna Cum Laude.",
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "SQL", "Go", "HTML5/CSS3"],
    },
    {
      id: "skill-2",
      category: "Frameworks & Tools",
      skills: ["React", "Next.js", "Node.js (Express)", "GraphQL", "Tailwind CSS", "Docker", "Git"],
    },
    {
      id: "skill-3",
      category: "Cloud & Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis", "AWS (S3, EC2, Lambda)", "Google Cloud", "Kafka"],
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Synapse: Real-Time Developer Collaboration Platform",
      description: "A secure real-time web editor supporting collaborative coding workspace environments, live terminal sharing, and direct audio/video streams using WebRTC.",
      url: "https://synapse-collab.io",
      technologies: ["React", "Socket.io", "TypeScript", "Tailwind CSS", "WebRTC"],
    },
    {
      id: "proj-2",
      name: "Nexus API Gateway",
      description: "Lightweight, high-performance API Gateway built in Go featuring intelligent dynamic rate-limiting, OAuth2 authentication, and multi-service routing.",
      url: "https://github.com/alexrivera/nexus-gateway",
      technologies: ["Go", "Redis", "Docker", "gRPC", "Prometheus"],
    }
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Spanish", proficiency: "Conversational" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2024-04",
    },
    {
      id: "cert-2",
      name: "Google Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "2025-01",
    }
  ]
};
