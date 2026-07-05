export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // Native, Fluent, Conversational, Basic
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
}

export type TemplateType = "modern" | "minimalist" | "serif" | "split" | "creative" | "academic" | "bold" | "editorial";

export interface ResumeTheme {
  primaryColor: string; // Hex code or Tailwind class
  fontFamily: string;
  spacing: "compact" | "normal" | "spacious";
}
