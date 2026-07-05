import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  Languages, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Edit, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Send, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Target,
  Wand2,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Scissors,
  Upload,
  Camera,
  User,
  RotateCw,
  Sliders,
  Sun,
  Moon,
  Contrast,
  Image as ImageIcon,
  Crop,
  Monitor,
  Terminal,
  Laptop
} from "lucide-react";
import { motion } from "motion/react";
import { WASI_RESUME_DATA } from "./initialData";
import { ResumeData, TemplateType, WorkExperience, Education, SkillCategory, Project, Language, Certification } from "./types";

export default function App() {
  // State management for resume data with localStorage recovery
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem("wasi_resume_data");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load saved resume data from localStorage:", e);
    }
    return WASI_RESUME_DATA;
  });

  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "projects" | "skills" | "education" | "certs" | "languages">("personal");
  
  // Theme Toggle: allows user to switch editor and live preview between light and dark modes
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem("wasi_theme") as "light" | "dark") || "dark";
    } catch (e) {
      return "dark";
    }
  });

  // Saving indicator status: "saved" | "saving" | "idle" | "error"
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle" | "error">("idle");

  // Keep theme preference in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wasi_theme", theme);
    } catch (e) {
      console.error("Failed to save theme setting", e);
    }
  }, [theme]);

  // Periodic and change-triggered auto-save effect
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("wasi_resume_data", JSON.stringify(resumeData));
        setSaveStatus("saved");
        // Revert status label to idle after 2.5 seconds
        const clearTimer = setTimeout(() => setSaveStatus("idle"), 2500);
        return () => clearTimeout(clearTimer);
      } catch (err) {
        console.error("Auto-save to localStorage failed:", err);
        setSaveStatus("error");
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [resumeData]);
  
  // Customization settings
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [primaryColor, setPrimaryColor] = useState<string>("#2563eb"); // Blue 600
  const [spacing, setSpacing] = useState<"compact" | "normal" | "spacious">("normal");
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  
  // Sheet background color: "white" or "black"
  const [sheetBg, setSheetBg] = useState<"white" | "black">(() => {
    try {
      const saved = localStorage.getItem("wasi_sheet_bg");
      if (saved === "white" || saved === "black") return saved;
    } catch (e) {
      console.warn("Failed to load saved sheet background:", e);
    }
    return "white";
  });

  useEffect(() => {
    try {
      localStorage.setItem("wasi_sheet_bg", sheetBg);
    } catch (e) {
      console.error("Failed to save sheet background setting", e);
    }
  }, [sheetBg]);
  
  // Sidebar Tabs
  const [sidebarTab, setSidebarTab] = useState<"editor" | "ai-coach" | "job-tailor">("editor");

  // PWA/Windows App installation prompt states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic prompt show
      e.preventDefault();
      // Store event
      setDeferredPrompt(e);
      // Show install option in toolbar
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Initial check for standalone display-mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const triggerPwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation choice: ${outcome}`);
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
      triggerToast("🎉 Windows Desktop App installed successfully!", "success");
    }
  };

  // AI Review State
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    feedback: Array<{ category: string; message: string; severity: "high" | "medium" | "low" }>;
    strengths: string[];
    suggestedKeywords: string[];
  } | null>(null);

  // AI Tailor State
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    matchScore: number;
    tailoredSummary: string;
    criticalKeywords: string[];
    actionableSteps: string[];
  } | null>(null);

  // AI Optimizer States
  const [isOptimizingSummary, setIsOptimizingSummary] = useState(false);
  const [summaryTone, setSummaryTone] = useState("professional");
  const [summaryIndustry, setSummaryIndustry] = useState("Freelance Software Development");

  // AI Bullet Builder States
  const [activeExpForBullet, setActiveExpForBullet] = useState<string>("");
  const [bulletDraftDescription, setBulletDraftDescription] = useState("");
  const [bulletDraftKeywords, setBulletDraftKeywords] = useState("");
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);

  // Print UI state
  const [showPrintHint, setShowPrintHint] = useState(true);
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  // Hidden input ref for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Photo Editor States
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editorPhotoSrc, setEditorPhotoSrc] = useState<string>("");
  const [editorZoom, setEditorZoom] = useState<number>(1.0);
  const [editorRotation, setEditorRotation] = useState<number>(0);
  const [editorBrightness, setEditorBrightness] = useState<number>(100);
  const [editorContrast, setEditorContrast] = useState<number>(100);
  const [editorGrayscale, setEditorGrayscale] = useState<number>(0);
  const [editorSepia, setEditorSepia] = useState<number>(0);
  const [editorBlur, setEditorBlur] = useState<number>(0);
  const [editorSaturate, setEditorSaturate] = useState<number>(100);
  const [editorSharpness, setEditorSharpness] = useState<number>(0);
  const [isAutoEnhanced, setIsAutoEnhanced] = useState<boolean>(false);
  const [editorPanX, setEditorPanX] = useState<number>(0);
  const [editorPanY, setEditorPanY] = useState<number>(0);
  const [cropShape, setCropShape] = useState<"circle" | "square" | "rounded">("circle");
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 280, height: 280 });

  // Drag to pan image states in editor
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Custom Toast Notification States
  interface ToastMessage {
    id: string;
    message: string;
    type: "success" | "error" | "info";
  }
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [rawFieldsState, setRawFieldsState] = useState<Record<string, string>>({});

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load sample or reset
  const handleResetToSample = () => {
    setResumeData(JSON.parse(JSON.stringify(WASI_RESUME_DATA)));
    setRawFieldsState({});
    triggerToast("Profile reset back to Wasi Bahadur's sample data!", "info");
  };

  // Helper functions to update state
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      role: "New Role",
      company: "Company Name",
      location: "Location",
      startDate: "2025-01",
      endDate: "Present",
      current: true,
      bullets: ["Led development of [what] using [tool] resulting in [metric]% increase in performance."]
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, updatedFields: Partial<WorkExperience>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, ...updatedFields } : exp)
    }));
  };

  const deleteExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    if (activeExpForBullet === id) {
      setActiveExpForBullet("");
    }
  };

  const addBulletToExperience = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: [...exp.bullets, "New bullet point details..."]
          };
        }
        return exp;
      })
    }));
  };

  const updateBulletInExperience = (expId: string, bulletIdx: number, val: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIdx] = val;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };

  const deleteBulletInExperience = (expId: string, bulletIdx: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx)
          };
        }
        return exp;
      })
    }));
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: "Degree / Program Name",
      school: "School Name",
      location: "Location",
      startDate: "2024-09",
      endDate: "2028-06",
      current: false,
      gpa: "",
      description: "Describe key coursework, honors, or research activities."
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, updatedFields: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, ...updatedFields } : edu)
    }));
  };

  const deleteEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Projects Handlers
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: "New Project Name",
      description: "Brief description of what you designed or built and the outcome.",
      url: "github.com/yourusername/project",
      technologies: ["Python", "Pandas"]
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, ...updatedFields } : proj)
    }));
  };

  const updateProjectTech = (id: string, techArray: string[]) => {
    updateProject(id, { technologies: techArray });
  };

  const deleteProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  // Skills Handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: "Tools & Frameworks",
      skills: ["Git", "VS Code"]
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
  };

  const updateSkillCategory = (id: string, categoryName: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, category: categoryName } : s)
    }));
  };

  const updateSkillTags = (id: string, tags: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, skills: tags } : s)
    }));
  };

  const deleteSkillCategory = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  // Languages Handlers
  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: "Language",
      proficiency: "Basic"
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, val: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: val } : l)
    }));
  };

  const deleteLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  // Certifications Handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "Certification Name",
      issuer: "Issuing Organization",
      date: "2025-01"
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, updatedFields: Partial<Certification>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updatedFields } : c)
    }));
  };

  const deleteCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // API Call: Optimize summary
  const optimizeSummary = async () => {
    if (!resumeData.summary.trim()) {
      triggerToast("Please enter a basic summary first to optimize.", "error");
      return;
    }
    setIsOptimizingSummary(true);
    try {
      const response = await fetch("/api/ai/optimize-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: resumeData.summary,
          tone: summaryTone,
          industry: summaryIndustry
        })
      });
      const data = await response.json();
      if (data.optimizedSummary) {
        setResumeData(prev => ({ ...prev, summary: data.optimizedSummary }));
        triggerToast("Summary rewritten successfully using Gemini AI!", "success");
      } else {
        triggerToast(data.error || "Could not optimize summary. Check network or key configuration.", "error");
      }
    } catch (e) {
      console.error(e);
      triggerToast("An error occurred while contacting the server optimizer.", "error");
    } finally {
      setIsOptimizingSummary(false);
    }
  };

  // API Call: Generate bullet points
  const generateBulletPoints = async () => {
    const activeExp = resumeData.experience.find(exp => exp.id === activeExpForBullet);
    if (!activeExp) {
      triggerToast("Please select a Work Experience entry below first.", "error");
      return;
    }
    if (!bulletDraftDescription.trim()) {
      triggerToast("Please write a few raw facts or accomplishments in the drafting box.", "error");
      return;
    }

    setIsGeneratingBullets(true);
    try {
      const keywordsArray = bulletDraftKeywords ? bulletDraftKeywords.split(",").map(k => k.trim()) : [];
      const response = await fetch("/api/ai/generate-bullet-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: activeExp.role,
          company: activeExp.company,
          description: bulletDraftDescription,
          keywords: keywordsArray
        })
      });
      const data = await response.json();
      if (data.bullets && Array.isArray(data.bullets)) {
        setResumeData(prev => ({
          ...prev,
          experience: prev.experience.map(exp => {
            if (exp.id === activeExpForBullet) {
              return {
                ...exp,
                bullets: [...exp.bullets, ...data.bullets]
              };
            }
            return exp;
          })
        }));
        setBulletDraftDescription("");
        triggerToast(`Successfully appended ${data.bullets.length} professional, action-driven bullets!`, "success");
      } else {
        triggerToast(data.error || "Failed to generate bullet points.", "error");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Error contacting the bullet-point generator.", "error");
    } finally {
      setIsGeneratingBullets(false);
    }
  };

  // API Call: Full Resume Review (ATS)
  const runResumeReview = async () => {
    setIsReviewing(true);
    setSidebarTab("ai-coach");
    try {
      const response = await fetch("/api/ai/review-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeData })
      });
      const data = await response.json();
      if (data.score !== undefined) {
        setReviewResult(data);
        triggerToast("Resume audit complete!", "success");
      } else {
        triggerToast(data.error || "Failed to review the resume.", "error");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Error contacting the review scanner.", "error");
    } finally {
      setIsReviewing(false);
    }
  };

  // API Call: Tailor Resume to Job Description
  const runResumeTailoring = async () => {
    if (!jobDescription.trim()) {
      triggerToast("Please paste a Job Description or freelance gig overview first.", "error");
      return;
    }
    setIsTailoring(true);
    try {
      const response = await fetch("/api/ai/tailor-resume", { // Clean path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription: jobDescription
        })
      });
      const data = await response.json();
      if (data.matchScore !== undefined) {
        setTailorResult(data);
        triggerToast("Resume tailored successfully!", "success");
      } else {
        triggerToast(data.error || "Failed to tailor the resume.", "error");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Error contacting the tailoring generator.", "error");
    } finally {
      setIsTailoring(false);
    }
  };

  // Get dynamic word count helper for ATS evaluation
  const getWordCount = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  // Trigger Print to PDF
  const triggerPrint = () => {
    if (window.self !== window.top) {
      triggerToast("Opening system print dialog... Pro-tip: Open this app in a 'New Tab' for the absolute best print result!", "info");
    } else {
      triggerToast("Opening system print dialog... Save as PDF to download your resume!", "success");
    }
    window.print();
  };

  // Apply tailored summary helper
  const applyTailoredSummary = () => {
    if (tailorResult?.tailoredSummary) {
      setResumeData(prev => ({
        ...prev,
        summary: tailorResult.tailoredSummary
      }));
      triggerToast("Tailored Professional Summary applied successfully!", "success");
    }
  };

  // Markdown Generator for Export
  const generateMarkdown = (data: ResumeData): string => {
    let md = `# ${data.personalInfo.fullName || "Resume"}\n`;
    if (data.personalInfo.title) {
      md += `**${data.personalInfo.title}**\n\n`;
    }
    
    // Contacts list
    const contacts: string[] = [];
    if (data.personalInfo.location) contacts.push(`📍 ${data.personalInfo.location}`);
    if (data.personalInfo.email) contacts.push(`✉️ ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contacts.push(`📞 ${data.personalInfo.phone}`);
    if (data.personalInfo.linkedin) contacts.push(`🔗 LinkedIn: ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) contacts.push(`💻 GitHub: ${data.personalInfo.github}`);
    if (data.personalInfo.website) contacts.push(`🌐 Website: ${data.personalInfo.website}`);
    
    if (contacts.length > 0) {
      md += contacts.join(" | ") + "\n\n";
    }
    md += "---\n\n";
    
    // Executive Summary
    if (data.summary) {
      md += `## Professional Summary\n\n${data.summary}\n\n`;
    }
    
    // Skills
    if (data.skills && data.skills.length > 0) {
      md += `## Skills & Core Competencies\n\n`;
      data.skills.forEach(s => {
        md += `* **${s.category}**: ${s.skills.join(", ")}\n`;
      });
      md += `\n`;
    }
    
    // Professional Experience
    if (data.experience && data.experience.length > 0) {
      md += `## Professional Experience\n\n`;
      data.experience.forEach(exp => {
        const dateStr = `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`;
        md += `### ${exp.role} | ${exp.company}\n`;
        md += `*${dateStr} | ${exp.location}*\n\n`;
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach(b => {
            const cleanBullet = b.replace(/\[weak[^\]]*\]/gi, "").trim();
            md += `* ${cleanBullet}\n`;
          });
        }
        md += `\n`;
      });
    }
    
    // Key Projects
    if (data.projects && data.projects.length > 0) {
      md += `## Key Projects\n\n`;
      data.projects.forEach(proj => {
        md += `### ${proj.name}\n`;
        if (proj.url) md += `*URL: ${proj.url}*\n\n`;
        md += `${proj.description}\n\n`;
        if (proj.technologies && proj.technologies.length > 0) {
          md += `*Technologies: ${proj.technologies.join(", ")}*\n\n`;
        }
      });
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      md += `## Education\n\n`;
      data.education.forEach(edu => {
        const dateStr = `${edu.startDate} – ${edu.current ? "Present" : edu.endDate}`;
        md += `### ${edu.degree}\n`;
        md += `**${edu.school}** | *${dateStr} | ${edu.location}*\n\n`;
        if (edu.gpa) md += `*Result/Status: ${edu.gpa}*\n\n`;
        if (edu.description) md += `${edu.description}\n\n`;
      });
    }
    
    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      md += `## Certifications\n\n`;
      data.certifications.forEach(cert => {
        md += `* **${cert.name}** – ${cert.issuer} (${cert.date})\n`;
      });
      md += `\n`;
    }
    
    // Languages
    if (data.languages && data.languages.length > 0) {
      md += `## Languages Spoken\n\n`;
      data.languages.forEach(lang => {
        md += `* **${lang.name}**: ${lang.proficiency}\n`;
      });
      md += `\n`;
    }
    
    return md;
  };

  // Export to JSON file
  const exportToJSON = () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const name = resumeData.personalInfo.fullName || "resume";
      const filename = `${name.toLowerCase().replace(/\s+/g, "_")}_resume.json`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast("Resume exported as JSON successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to export resume as JSON.", "error");
    }
  };

  // Export to Markdown text file
  const exportToMarkdown = () => {
    try {
      const mdContent = generateMarkdown(resumeData);
      const blob = new Blob([mdContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const name = resumeData.personalInfo.fullName || "resume";
      const filename = `${name.toLowerCase().replace(/\s+/g, "_")}_resume.md`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast("Resume exported as Markdown successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to export resume as Markdown.", "error");
    }
  };

  // Trigger file selection for JSON import
  const triggerJsonImport = () => {
    fileInputRef.current?.click();
  };

  // Parse imported JSON file and update resumeData state
  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        if (!parsed.personalInfo || !parsed.personalInfo.fullName) {
          throw new Error("Invalid format: The uploaded JSON does not contain valid personalInfo.");
        }
        
        const validatedData: ResumeData = {
          personalInfo: {
            fullName: parsed.personalInfo.fullName || "",
            title: parsed.personalInfo.title || "",
            email: parsed.personalInfo.email || "",
            phone: parsed.personalInfo.phone || "",
            location: parsed.personalInfo.location || "",
            linkedin: parsed.personalInfo.linkedin || "",
            github: parsed.personalInfo.github || "",
            website: parsed.personalInfo.website || "",
            photoUrl: parsed.personalInfo.photoUrl || ""
          },
          summary: parsed.summary || "",
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          languages: Array.isArray(parsed.languages) ? parsed.languages : []
        };

        setResumeData(validatedData);
        triggerToast("Resume JSON successfully imported!", "success");
      } catch (err: any) {
        console.error(err);
        triggerToast(err.message || "Failed to parse resume JSON. Make sure the file was exported from this builder.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // clear input
  };

  const AVATAR_PRESETS = {
    male: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e2e8f0" rx="20"/><circle cx="50" cy="38" r="16" fill="%23475569"/><path d="M24 78c0-12 10-20 26-20s26 8 26 20v4H24v-4z" fill="%23475569"/><circle cx="50" cy="38" r="13" fill="%23cbd5e1"/><path d="M28 78c0-9 8-15 22-15s22 6 22 15" fill="%2394a3b8"/></svg>`,
    female: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fee2e2" rx="20"/><circle cx="50" cy="38" r="16" fill="%23be185d"/><path d="M24 78c0-12 10-20 26-20s26 8 26 20v4H24v-4z" fill="%23be185d"/><circle cx="50" cy="38" r="13" fill="%23fbcfe8"/><path d="M28 78c0-9 8-15 22-15s22 6 22 15" fill="%23f472b6"/></svg>`,
    creative: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fef3c7" rx="20"/><circle cx="50" cy="38" r="16" fill="%23b45309"/><path d="M24 78c0-12 10-20 26-20s26 8 26 20v4H24v-4z" fill="%23b45309"/><circle cx="50" cy="38" r="13" fill="%23fde68a"/><path d="M28 78c0-9 8-15 22-15s22 6 22 15" fill="%23fbbf24"/></svg>`
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      triggerToast("Please upload a valid image file (PNG/JPEG)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;
        const size = Math.min(width, height);
        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const sourceX = (width - size) / 2;
          const sourceY = (height - size) / 2;
          ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, MAX_WIDTH, MAX_HEIGHT);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          updatePersonalInfo("photoUrl", compressedBase64);
          triggerToast("Profile photo uploaded and optimized successfully!", "success");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // clear input
  };

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(true);
  };

  const handlePhotoDragLeave = () => {
    setIsDraggingPhoto(false);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("Please drop a valid image file", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const sourceX = (img.width - size) / 2;
          const sourceY = (img.height - size) / 2;
          ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, 250, 250);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          updatePersonalInfo("photoUrl", compressedBase64);
          triggerToast("Profile photo dropped and optimized successfully!", "success");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ResizeObserver for photo editor preview workspace to support dynamic scaling on all resolutions
  useEffect(() => {
    if (!isEditingPhoto || !canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      // Ensure a reasonable square bounds between 240px and 450px depending on container/screen size
      const size = Math.max(240, Math.min(450, rect.width));
      setCanvasDimensions({ width: size, height: size });
    };

    updateSize();
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [isEditingPhoto]);

  // Real-time photo editor canvas rendering
  useEffect(() => {
    if (!isEditingPhoto || !editorPhotoSrc) return;
    const canvas = editorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = canvasDimensions.width;
      const logicalHeight = canvasDimensions.height;

      // Update canvas backing store resolution dynamically based on device pixel ratio
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Scale all subsequent drawing operations to use logical CSS coordinates
      ctx.scale(dpr, dpr);

      const width = logicalWidth;
      const height = logicalHeight;

      // Checkered background pattern for transparent images
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, width, height);

      // Visual helper lines for perfect framing
      if (cropShape === "circle") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2 - 4, 0, Math.PI * 2);
        ctx.clip();
      } else if (cropShape === "rounded") {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect?.(4, 4, width - 8, height - 8, 24);
        ctx.clip();
      }

      // Apply transformation (Translate -> Rotate -> Scale)
      ctx.translate(width / 2 + editorPanX, height / 2 + editorPanY);
      ctx.rotate((editorRotation * Math.PI) / 180);
      ctx.scale(editorZoom, editorZoom);

      // Filters
      ctx.filter = `brightness(${editorBrightness}%) contrast(${editorContrast}%) grayscale(${editorGrayscale}%) sepia(${editorSepia}%) blur(${editorBlur}px) saturate(${editorSaturate}%)`;

      // Draw standard cropped source
      const imgWidth = img.width;
      const imgHeight = img.height;
      const size = Math.min(imgWidth, imgHeight);
      const sx = (imgWidth - size) / 2;
      const sy = (imgHeight - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, -width / 2, -height / 2, width, height);
      
      if (cropShape === "circle" || cropShape === "rounded") {
        ctx.restore(); // restore clip
      }

      // Apply sharpening convolution filter on the physical backing store pixels
      if (editorSharpness > 0) {
        try {
          const w = canvas.width;
          const h = canvas.height;
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          const copy = new Uint8ClampedArray(data);
          const factor = editorSharpness / 100; // 0.0 to 1.0 range
          
          const weights = [
             0, -factor,  0,
            -factor, 1 + 4 * factor, -factor,
             0, -factor,  0
          ];
          
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4;
              if (copy[idx + 3] === 0) continue; // skip transparent background
              
              let r = 0, g = 0, b = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const cidx = ((y + ky) * w + (x + kx)) * 4;
                  const wt = weights[(ky + 1) * 3 + (kx + 1)];
                  r += copy[cidx] * wt;
                  g += copy[cidx + 1] * wt;
                  b += copy[cidx + 2] * wt;
                }
              }
              data[idx] = Math.min(255, Math.max(0, r));
              data[idx + 1] = Math.min(255, Math.max(0, g));
              data[idx + 2] = Math.min(255, Math.max(0, b));
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (err) {
          console.warn("Sharpen logic skipped:", err);
        }
      }

      // Restore base transform
      ctx.restore();

      // Overlay framing guides in editor mode
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1.5;
      
      // Draw crosshairs for head alignment
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw crop boundary guideline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (cropShape === "circle") {
        ctx.arc(width / 2, height / 2, width / 2 - 4, 0, Math.PI * 2);
      } else if (cropShape === "rounded") {
        ctx.roundRect?.(4, 4, width - 8, height - 8, 24);
      } else {
        ctx.rect(4, 4, width - 8, height - 8);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };
    img.src = editorPhotoSrc;
  }, [
    isEditingPhoto,
    editorPhotoSrc,
    editorZoom,
    editorRotation,
    editorBrightness,
    editorContrast,
    editorGrayscale,
    editorSepia,
    editorBlur,
    editorSaturate,
    editorSharpness,
    editorPanX,
    editorPanY,
    cropShape,
    canvasDimensions
  ]);

  const openPhotoEditor = () => {
    if (!resumeData.personalInfo.photoUrl) {
      triggerToast("Please upload a photo first!", "error");
      return;
    }
    setEditorPhotoSrc(resumeData.personalInfo.photoUrl);
    setEditorZoom(1.0);
    setEditorRotation(0);
    setEditorBrightness(100);
    setEditorContrast(100);
    setEditorGrayscale(0);
    setEditorSepia(0);
    setEditorBlur(0);
    setEditorSaturate(100);
    setEditorSharpness(0);
    setIsAutoEnhanced(false);
    setEditorPanX(0);
    setEditorPanY(0);
    setCropShape("circle");
    setIsEditingPhoto(true);
  };

  const toggleAutoEnhance = () => {
    if (!isAutoEnhanced) {
      // Apply professional quality auto enhancement parameters
      setEditorBrightness(105);   // Crisp studio brightness
      setEditorContrast(115);     // Deep pro contrast
      setEditorSaturate(108);     // Rich dynamic saturation
      setEditorSharpness(40);     // 3x3 convolution clarity sharpen
      setEditorBlur(0);           // Remove blur
      setIsAutoEnhanced(true);
      triggerToast("✨ Dynamic Picture Quality Enhancer Activated!", "success");
    } else {
      // Revert to original
      setEditorBrightness(100);
      setEditorContrast(100);
      setEditorSaturate(100);
      setEditorSharpness(0);
      setEditorBlur(0);
      setIsAutoEnhanced(false);
      triggerToast("Auto-enhance deactivated.", "info");
    }
  };

  const autoFramePhoto = () => {
    if (!editorPhotoSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Determine crop bounding square
      const size = Math.min(imgWidth, imgHeight);
      const sy = (imgHeight - size) / 2;
      
      // Heuristic for face location:
      // Portrait: face is higher up (approx 35% of total height)
      // Landscape/Square: face is closer to the center vertically (approx 42% of height)
      const faceY = imgHeight * (imgHeight > imgWidth ? 0.35 : 0.42);
      
      // Relative face Y within the source square
      const faceSourceY = faceY - sy;
      
      // Scale mapping from source square to canvas dimensions
      const canvasWidth = canvasDimensions.width;
      const scale = canvasWidth / size;
      
      // To frame a headshot perfectly, we zoom in slightly so the head fills the crop circle nicely.
      // 1.35x zoom for portrait and 1.25x zoom for landscape/square images
      const optimalZoom = imgHeight > imgWidth ? 1.35 : 1.25;
      
      // Calculate pan to align faceSourceY with the canvas center
      // faceSourceY - (size / 2) is the offset of the face from the source center.
      // We multiply by scale and zoom to get the canvas-space pixel offset, then invert it to pan.
      const panY = - (faceSourceY - size / 2) * scale * optimalZoom;
      
      setEditorZoom(optimalZoom);
      setEditorPanX(0); // Face is assumed horizontally centered
      setEditorPanY(panY);
      
      triggerToast("✨ Face centered and auto-framed!", "success");
    };
    img.src = editorPhotoSrc;
  };

  const applyPhotoFilterPreset = (preset: "original" | "bw" | "warm" | "cool" | "vivid" | "slate") => {
    switch (preset) {
      case "bw":
        setEditorBrightness(105);
        setEditorContrast(120);
        setEditorGrayscale(100);
        setEditorSepia(0);
        setEditorSaturate(0);
        setEditorBlur(0);
        break;
      case "warm":
        setEditorBrightness(105);
        setEditorContrast(100);
        setEditorGrayscale(0);
        setEditorSepia(15);
        setEditorSaturate(115);
        setEditorBlur(0);
        break;
      case "cool":
        setEditorBrightness(100);
        setEditorContrast(110);
        setEditorGrayscale(0);
        setEditorSepia(0);
        setEditorSaturate(80);
        setEditorBlur(0);
        break;
      case "vivid":
        setEditorBrightness(105);
        setEditorContrast(115);
        setEditorGrayscale(0);
        setEditorSepia(0);
        setEditorSaturate(140);
        setEditorBlur(0);
        break;
      case "slate":
        setEditorBrightness(95);
        setEditorContrast(125);
        setEditorGrayscale(100);
        setEditorSepia(10);
        setEditorSaturate(0);
        setEditorBlur(0);
        break;
      default:
        setEditorBrightness(100);
        setEditorContrast(100);
        setEditorGrayscale(0);
        setEditorSepia(0);
        setEditorSaturate(100);
        setEditorBlur(0);
        break;
    }
    triggerToast(`Applied ${preset} filter!`, "info");
  };

  const handleApplyPhotoEdits = () => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = 250;
    outputCanvas.height = 250;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, 250, 250);
      ctx.save();

      // Solid background for output JPEGs
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 250, 250);

      // Apply crop masking on output image if requested
      if (cropShape === "circle") {
        ctx.beginPath();
        ctx.arc(125, 125, 125, 0, Math.PI * 2);
        ctx.clip();
      } else if (cropShape === "rounded") {
        ctx.beginPath();
        ctx.roundRect?.(0, 0, 250, 250, 40);
        ctx.clip();
      }

      // Translate and scale to match editor settings
      ctx.translate(125 + editorPanX, 125 + editorPanY);
      ctx.rotate((editorRotation * Math.PI) / 180);
      ctx.scale(editorZoom, editorZoom);

      // Filters
      ctx.filter = `brightness(${editorBrightness}%) contrast(${editorContrast}%) grayscale(${editorGrayscale}%) sepia(${editorSepia}%) blur(${editorBlur}px) saturate(${editorSaturate}%)`;

      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, -125, -125, 250, 250);
      ctx.restore();

      // Apply sharpening convolution filter to the final saved output canvas
      if (editorSharpness > 0) {
        try {
          const imgData = ctx.getImageData(0, 0, 250, 250);
          const data = imgData.data;
          const copy = new Uint8ClampedArray(data);
          const factor = editorSharpness / 100; // 0.0 to 1.0 range
          
          const weights = [
             0, -factor,  0,
            -factor, 1 + 4 * factor, -factor,
             0, -factor,  0
          ];
          
          for (let y = 1; y < 249; y++) {
            for (let x = 1; x < 249; x++) {
              const idx = (y * 250 + x) * 4;
              if (copy[idx + 3] === 0) continue; // skip transparent / masked pixels
              
              let r = 0, g = 0, b = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const cidx = ((y + ky) * 250 + (x + kx)) * 4;
                  const wt = weights[(ky + 1) * 3 + (kx + 1)];
                  r += copy[cidx] * wt;
                  g += copy[cidx + 1] * wt;
                  b += copy[cidx + 2] * wt;
                }
              }
              data[idx] = Math.min(255, Math.max(0, r));
              data[idx + 1] = Math.min(255, Math.max(0, g));
              data[idx + 2] = Math.min(255, Math.max(0, b));
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (err) {
          console.warn("Final sharpen logic skipped:", err);
        }
      }

      const finalBase64 = outputCanvas.toDataURL("image/jpeg", 0.9);
      updatePersonalInfo("photoUrl", finalBase64);
      setIsEditingPhoto(false);
      triggerToast("Photo updated and saved!", "success");
    };
    img.src = editorPhotoSrc;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - editorPanX, y: e.clientY - editorPanY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    setEditorPanX(e.clientX - panStart.x);
    setEditorPanY(e.clientY - panStart.y);
  };

  const handleCanvasMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
    setEditorZoom(prev => Math.max(0.2, Math.min(4.0, prev * zoomFactor)));
  };

  // Identify weak bullets that need attention (contain bracketed comments like "[Weak bullet")
  const findWeakBullets = () => {
    const weakItems: Array<{ expId: string; expRole: string; idx: number; text: string }> = [];
    resumeData.experience.forEach(exp => {
      exp.bullets.forEach((bullet, idx) => {
        if (bullet.toLowerCase().includes("[weak") || bullet.toLowerCase().includes("weak bullet")) {
          weakItems.push({
            expId: exp.id,
            expRole: exp.role,
            idx,
            text: bullet
          });
        }
      });
    });
    return weakItems;
  };

  const weakBullets = findWeakBullets();

  const getFontFamily = (tpl: TemplateType) => {
    switch (tpl) {
      case "serif":
      case "editorial":
        return "'Playfair Display', Georgia, serif";
      case "creative":
        return "'Space Grotesk', var(--font-sans)";
      case "academic":
        return "Georgia, serif";
      default:
        return "var(--font-sans)";
    }
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode) => {
    switch (template) {
      case "minimalist":
        return (
          <h2 className="text-[11px] font-extrabold uppercase tracking-wider mb-2 border-b border-slate-900 pb-0.5 text-slate-900">
            {title}
          </h2>
        );
      case "serif":
        return (
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1 text-slate-900 border-slate-200">
            {title}
          </h2>
        );
      case "editorial":
        return (
          <div className="text-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-center gap-2">
              <span className="text-[10px] text-slate-400">✦</span> {title} <span className="text-[10px] text-slate-400">✦</span>
            </h2>
            <div className="w-12 h-0.5 bg-slate-300 mx-auto mt-1" />
          </div>
        );
      case "creative":
        return (
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2 border-b-2 border-slate-950 pb-1 text-slate-950 font-mono flex items-center gap-1.5">
            <span className="text-[8px] text-white px-1 py-0.5 bg-slate-950 rounded select-none">▶</span> {title}
          </h2>
        );
      case "academic":
        return (
          <div className="text-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-y border-slate-400 py-1">
              {title}
            </h2>
          </div>
        );
      case "bold":
        return (
          <h2 
            className="text-xs font-bold uppercase tracking-wider mb-2 border-l-4 pl-2 py-0.5 flex items-center gap-1.5"
            style={{ 
              color: primaryColor,
              borderLeftColor: primaryColor,
            }}
          >
            {title}
          </h2>
        );
      default: // modern and split
        return (
          <h2 
            className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1 flex items-center gap-1.5"
            style={{ 
              color: primaryColor,
              borderColor: `${primaryColor}35`
            }}
          >
            <span className="print:hidden">{icon}</span> {title}
          </h2>
        );
    }
  };

  const renderHeader = () => {
    const fullName = resumeData.personalInfo.fullName || "Your Full Name";
    const title = resumeData.personalInfo.title || "Developer Portfolio";
    
    switch (template) {
      case "bold":
        return (
          <div 
            className="p-6 rounded-lg text-center text-white mb-5 shadow-sm" 
            style={{ backgroundColor: primaryColor }}
          >
            {showPhoto && resumeData.personalInfo.photoUrl && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={resumeData.personalInfo.photoUrl} 
                  alt={fullName} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <h1 className="text-3xl font-extrabold uppercase tracking-wide">{fullName}</h1>
            <p className="text-sm font-medium text-white/95 uppercase tracking-widest mt-1 font-mono">{title}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs text-white/90 mt-3.5 font-mono">
              {resumeData.personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {resumeData.personalInfo.location}
                </span>
              )}
              {resumeData.personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {resumeData.personalInfo.email}
                </span>
              )}
              {resumeData.personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {resumeData.personalInfo.phone}
                </span>
              )}
              {resumeData.personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" /> {resumeData.personalInfo.linkedin}
                </span>
              )}
              {resumeData.personalInfo.github && (
                <span className="flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" /> {resumeData.personalInfo.github}
                </span>
              )}
              {resumeData.personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {resumeData.personalInfo.website}
                </span>
              )}
            </div>
          </div>
        );

      case "academic":
        return (
          <div className="pb-5 mb-5 border-b-4 border-double border-slate-900 font-serif flex items-center justify-between gap-6">
            <div className="flex-1 text-left">
              <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900">{fullName}</h1>
              <p className="text-sm italic text-slate-700 font-medium mt-1">{title}</p>
              
              <div className="flex flex-wrap justify-start items-center gap-x-3 gap-y-1 text-xs text-slate-800 mt-2.5 font-serif">
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                {(resumeData.personalInfo.location && resumeData.personalInfo.email) && <span>•</span>}
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {(resumeData.personalInfo.email && resumeData.personalInfo.phone) && <span>•</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {(resumeData.personalInfo.phone && resumeData.personalInfo.linkedin) && <span>•</span>}
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                {(resumeData.personalInfo.linkedin && resumeData.personalInfo.github) && <span>•</span>}
                {resumeData.personalInfo.github && <span>{resumeData.personalInfo.github}</span>}
                {(resumeData.personalInfo.github && resumeData.personalInfo.website) && <span>•</span>}
                {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
              </div>
            </div>
            {showPhoto && resumeData.personalInfo.photoUrl && (
              <div className="shrink-0">
                <img 
                  src={resumeData.personalInfo.photoUrl} 
                  alt={fullName} 
                  className="w-20 h-24 rounded border border-slate-400 object-cover p-0.5 bg-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        );

      case "minimalist":
        return (
          <div className="pb-4 mb-4 border-b border-slate-300 flex items-center justify-between gap-6 text-left">
            <div className="flex-1">
              <h1 className="text-2.5xl font-extrabold uppercase tracking-tight text-slate-900">{fullName}</h1>
              <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mt-0.5">{title}</p>
              
              <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2.5 font-mono">
                {resumeData.personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.location}
                  </span>
                )}
                {resumeData.personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.email}
                  </span>
                )}
                {resumeData.personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.phone}
                  </span>
                )}
                {resumeData.personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.linkedin}
                  </span>
                )}
                {resumeData.personalInfo.github && (
                  <span className="flex items-center gap-1">
                    <Github className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.github}
                  </span>
                )}
                {resumeData.personalInfo.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.website}
                  </span>
                )}
              </div>
            </div>
            {showPhoto && resumeData.personalInfo.photoUrl && (
              <div className="shrink-0">
                <img 
                  src={resumeData.personalInfo.photoUrl} 
                  alt={fullName} 
                  className="w-16 h-16 rounded-full object-cover border border-slate-300 bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        );

      case "editorial":
        return (
          <div className="text-center pb-4 mb-4 font-serif">
            {showPhoto && resumeData.personalInfo.photoUrl && (
              <div className="mb-3 flex justify-center">
                <img 
                  src={resumeData.personalInfo.photoUrl} 
                  alt={fullName} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-900/10 p-1 bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <h1 className="text-3xl font-light text-slate-950 italic">{fullName}</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{title}</p>
            
            <div className="py-1.5 border-y border-slate-200 mt-3 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] text-slate-700 italic">
              {resumeData.personalInfo.location && <span>📍 {resumeData.personalInfo.location}</span>}
              {resumeData.personalInfo.email && <span>✉️ {resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>📞 {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.linkedin && <span>🔗 {resumeData.personalInfo.linkedin}</span>}
              {resumeData.personalInfo.github && <span>💻 {resumeData.personalInfo.github}</span>}
              {resumeData.personalInfo.website && <span>🌐 {resumeData.personalInfo.website}</span>}
            </div>
          </div>
        );

      case "creative":
        return (
          <div className="text-left pb-4 mb-4 border-b-2 border-slate-950 font-sans">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {showPhoto && resumeData.personalInfo.photoUrl && (
                  <img 
                    src={resumeData.personalInfo.photoUrl} 
                    alt={fullName} 
                    className="w-[72px] h-[72px] rounded-xl object-cover border-2 border-slate-950 bg-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {fullName}
                  </h1>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1 font-mono">{title}</p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 max-w-sm flex flex-col gap-1 shrink-0">
                {resumeData.personalInfo.location && <div>📍 {resumeData.personalInfo.location}</div>}
                {resumeData.personalInfo.email && <div>✉️ {resumeData.personalInfo.email}</div>}
                {resumeData.personalInfo.phone && <div>📞 {resumeData.personalInfo.phone}</div>}
                {resumeData.personalInfo.website && <div>🌐 {resumeData.personalInfo.website}</div>}
              </div>
            </div>
          </div>
        );

      default: // modern & split
        return (
          <div className="border-b pb-4 mb-4" style={{ borderColor: `${primaryColor}22` }}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              {showPhoto && resumeData.personalInfo.photoUrl && (
                <div className="shrink-0">
                  <img 
                    src={resumeData.personalInfo.photoUrl} 
                    alt={fullName} 
                    className="w-[72px] h-[72px] rounded-full object-cover border bg-white shadow-sm"
                    style={{ borderColor: primaryColor }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 
                  className={`font-bold uppercase tracking-tight text-slate-900 ${
                    template === "serif" ? "text-3xl" : "text-2.5xl"
                  }`}
                  style={{ color: template === "serif" ? "#111827" : primaryColor }}
                >
                  {fullName}
                </h1>
                
                <p className="text-sm font-semibold text-slate-700 tracking-wide mt-1 uppercase">
                  {title}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2.5 font-mono">
                  {resumeData.personalInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.location}
                    </span>
                  )}
                  {resumeData.personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.email}
                    </span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.phone}
                    </span>
                  )}
                  {resumeData.personalInfo.linkedin && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.linkedin}
                    </span>
                  )}
                  {resumeData.personalInfo.github && (
                    <span className="flex items-center gap-1">
                      <Github className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.github}
                    </span>
                  )}
                  {resumeData.personalInfo.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" /> {resumeData.personalInfo.website}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderSummarySection = () => {
    if (!resumeData.summary) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ x: 2 }}
        className="transition-all duration-150 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Executive Summary", <Sparkles className="w-3.5 h-3.5" />)}
        <p className={`text-[12px] text-slate-700 leading-relaxed ${template === "academic" ? "text-justify" : ""}`}>
          {resumeData.summary}
        </p>
      </motion.div>
    );
  };

  const renderSkillsSection = () => {
    if (resumeData.skills.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ x: 2 }}
        className="transition-all duration-150 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Skills & Core Competencies", <Code className="w-3.5 h-3.5" />)}
        {template === "creative" ? (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {resumeData.skills.map((s) => (
              <motion.div 
                layout 
                key={s.id} 
                className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-slate-800 hover:border-slate-400 transition-colors"
              >
                <span className="font-bold">{s.category}:</span> {s.skills.join(", ")}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {resumeData.skills.map((s) => (
              <motion.div 
                layout 
                key={s.id} 
                className="text-[12px] flex items-start gap-1 hover:translate-x-0.5 transition-transform"
              >
                <strong className="text-slate-800 min-w-[120px] inline-block font-semibold">{s.category}:</strong>
                <span className="text-slate-600 flex-1">{s.skills.join(" • ")}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderExperienceSection = () => {
    if (resumeData.experience.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Professional Experience", <Briefcase className="w-3.5 h-3.5" />)}
        <div className="space-y-3.5">
          {resumeData.experience.map((exp) => {
            const hasWeakMark = exp.bullets.some(b => b.toLowerCase().includes("[weak"));
            return (
              <motion.div 
                layout
                key={exp.id} 
                whileHover={{ x: 2 }}
                className="text-[12px] relative group p-1 rounded hover:bg-slate-500/5 transition-all duration-150 print:p-0 print:bg-transparent"
              >
                
                {/* Visual warning for weak bullets */}
                {hasWeakMark && (
                  <div className="absolute -left-4 top-0 h-full w-0.5 bg-amber-500/80 rounded print:hidden" title="Contains weak metrics bullets" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 inline">{exp.role}</h3>
                    <span className="text-slate-400 mx-1.5">|</span>
                    <span className="font-medium text-slate-700">{exp.company}</span>
                  </div>
                  <div className="text-left sm:text-right text-slate-500 font-mono text-[10.5px] shrink-0">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                  </div>
                </div>

                <ul className={`list-disc list-outside ml-4 mt-1 space-y-1 text-slate-700 leading-relaxed text-[11.5px] ${template === "academic" ? "text-justify" : ""}`}>
                  {exp.bullets.map((b, idx) => {
                    const isWeak = b.toLowerCase().includes("[weak") || b.toLowerCase().includes("weak bullet");
                    return (
                      <motion.li 
                        layout
                        key={idx} 
                        className={`transition-all duration-150 hover:pl-0.5 ${
                          isWeak 
                            ? "bg-amber-50 text-amber-900 border-l border-amber-400 pl-1 py-0.5 rounded-r print:bg-white print:text-slate-700 print:border-none print:p-0" 
                            : ""
                        }`}
                      >
                        {b}
                        {isWeak && (
                          <span className="text-[9px] font-bold text-amber-600 ml-1.5 select-none print:hidden uppercase tracking-wide bg-amber-100 px-1 py-0.2 rounded">
                            Action metrics needed!
                          </span>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderProjectsSection = () => {
    if (resumeData.projects.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Key Projects", <FileText className="w-3.5 h-3.5" />)}
        <div className="space-y-3">
          {resumeData.projects.map((proj) => (
            <motion.div 
              layout
              key={proj.id} 
              whileHover={{ x: 2 }}
              className="text-[12px] p-1 rounded hover:bg-slate-500/5 transition-all duration-150 print:p-0 print:bg-transparent"
            >
              <div className="flex justify-between items-start flex-wrap gap-1">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {proj.url && <span className="text-[10px] text-slate-500 font-mono">{proj.url}</span>}
              </div>
              <p className={`text-slate-600 mt-0.5 leading-relaxed text-[11px] ${template === "academic" ? "text-justify" : ""}`}>{proj.description}</p>
              <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">
                Technologies: {proj.technologies.join(", ")}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderEducationSection = () => {
    if (resumeData.education.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Education", <GraduationCap className="w-3.5 h-3.5" />)}
        <div className="space-y-3">
          {resumeData.education.map((edu) => (
            <motion.div 
              layout
              key={edu.id} 
              whileHover={{ x: 2 }}
              className="text-[12px] p-1 rounded hover:bg-slate-500/5 transition-all duration-150 print:p-0 print:bg-transparent"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                <div>
                  <strong className="text-slate-900 font-bold">{edu.degree}</strong>
                  <span className="text-slate-400 mx-1.5">|</span>
                  <span className="text-slate-700">{edu.school}</span>
                </div>
                <span className="text-slate-500 font-mono text-[10.5px] shrink-0">
                  {edu.startDate} – {edu.current ? "Present" : edu.endDate} | {edu.location}
                </span>
              </div>
              {edu.gpa && (
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  Result / Status: {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{edu.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderCertificationsSection = () => {
    if (resumeData.certifications.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Certifications", <Award className="w-3.5 h-3.5" />)}
        <ul className="space-y-1.5 text-[11.5px] text-slate-700">
          {resumeData.certifications.map((cert) => (
            <motion.li 
              layout
              key={cert.id} 
              whileHover={{ x: 2 }}
              className="flex justify-between items-start gap-2 p-1 rounded hover:bg-slate-500/5 transition-all duration-150 print:p-0 print:bg-transparent"
            >
              <span>
                <strong className="font-semibold text-slate-800">{cert.name}</strong> – {cert.issuer}
              </span>
              <span className="text-slate-500 font-mono text-[10px] shrink-0 pl-1">{cert.date}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  };

  const renderLanguagesSection = () => {
    if (resumeData.languages.length === 0) return null;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 p-1.5 rounded hover:bg-slate-500/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-slate-200/40 print:p-0 print:border-none print:bg-transparent"
      >
        {renderSectionHeader("Languages Spoken", <Languages className="w-3.5 h-3.5" />)}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-slate-700">
          {resumeData.languages.map((lang) => (
            <motion.div 
              layout
              key={lang.id} 
              whileHover={{ x: 2 }}
              className="p-1 rounded hover:bg-slate-500/5 transition-all duration-150 print:p-0 print:bg-transparent"
            >
              <strong className="font-semibold text-slate-800">{lang.name}:</strong>{" "}
              <span className="text-slate-600">{lang.proficiency}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200 ${
      theme === "light" ? "light-theme-editor" : ""
    }`}>
      
      {/* Dynamic Header */}
      <header className="bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-40 gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              AI Recruiter-Psychology Resume Suite
            </h1>
            <p className="text-xs text-slate-400">Crafting high-impact, ATS-optimized technical profiles</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleJsonImport}
            accept=".json"
            className="hidden"
          />

          {/* Windows App Installer & Info Trigger */}
          <button
            onClick={() => setShowDesktopModal(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 shadow-lg shadow-blue-500/15 transition duration-150 flex items-center gap-1.5 cursor-pointer relative overflow-hidden group"
            title="Open Windows OS Desktop Application Setup"
          >
            <Laptop className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Windows OS App</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              setSheetBg(newTheme === "dark" ? "black" : "white");
              triggerToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} Mode`, "info");
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition duration-150 flex items-center gap-1.5 cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Auto-save Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 select-none">
            <span className={`w-1.5 h-1.5 rounded-full ${
              saveStatus === "saving" ? "bg-amber-400 animate-pulse" :
              saveStatus === "saved" ? "bg-emerald-500" :
              saveStatus === "error" ? "bg-rose-500 animate-ping" : "bg-slate-500"
            }`} />
            <span className="font-mono text-[10px]">
              {saveStatus === "saving" ? "Saving..." :
               saveStatus === "saved" ? "Saved" :
               saveStatus === "error" ? "Save Error" : "Auto-saved"}
            </span>
          </div>

          <button
            onClick={handleResetToSample}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition duration-150"
            title="Reload initial profile of Wasi Bahadur"
          >
            Reset Wasi's Profile
          </button>

          <button
            onClick={triggerJsonImport}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition duration-150 flex items-center gap-1.5"
            title="Import a previously saved JSON resume"
          >
            <Upload className="w-3.5 h-3.5" />
            Import JSON
          </button>

          <button
            onClick={exportToJSON}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition duration-150 flex items-center gap-1.5"
            title="Export resume data as JSON to save or modify later"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <button
            onClick={exportToMarkdown}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition duration-150 flex items-center gap-1.5"
            title="Export clean markdown text version for easy copy-pasting"
          >
            <FileText className="w-3.5 h-3.5" />
            Export MD
          </button>

          <button
            onClick={runResumeReview}
            disabled={isReviewing}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white flex items-center gap-1.5 transition duration-150 shadow-md shadow-indigo-600/15"
          >
            {isReviewing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
            ATS Scan Resume
          </button>

          <button
            onClick={triggerPrint}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition duration-150 shadow-md shadow-blue-600/15"
          >
            <Download className="w-3.5 h-3.5" />
            Save / Print PDF
          </button>
        </div>
      </header>

      {/* Main Responsive Grid layout */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left column: Resume inputs (5 Cols) */}
        <section className="xl:col-span-4 border-r border-slate-800 flex flex-col overflow-y-auto bg-slate-950/40 no-print">
          
          {/* Section Selector tabs */}
          <div className="sticky top-0 bg-slate-950/90 z-10 px-4 py-3 border-b border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Resume Editor Sections</span>
              {weakBullets.length > 0 && (
                <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 text-[10px] font-bold rounded-full border border-amber-500/20 animate-pulse">
                  {weakBullets.length} Draft Bullet{weakBullets.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {[
                { id: "personal", label: "Contact" },
                { id: "summary", label: "Summary" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
                { id: "skills", label: "Skills" },
                { id: "education", label: "Education" },
                { id: "certs", label: "Certifications" },
                { id: "languages", label: "Languages" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    activeTab === t.id 
                      ? "bg-blue-600 text-white font-semibold" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 flex-1 space-y-6">
            
            {/* PERSONAL INFO PANEL */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4">
                  <h3 className="font-semibold text-sm text-slate-200">Personal & Contact Details</h3>
                  <p className="text-xs text-slate-400">Position this clearly at the absolute top of the sheet.</p>
                </div>

                {/* Photo Upload Section */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-slate-200">Profile Photo</span>
                    </div>
                    {resumeData.personalInfo.photoUrl && (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span className="text-[11px] text-slate-400 font-medium">Show on Resume</span>
                        <button
                          type="button"
                          onClick={() => setShowPhoto(!showPhoto)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            showPhoto ? "bg-blue-600" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              showPhoto ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </label>
                    )}
                  </div>

                  <div
                    onDragOver={handlePhotoDragOver}
                    onDragLeave={handlePhotoDragLeave}
                    onDrop={handlePhotoDrop}
                    onClick={() => photoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition duration-150 flex flex-col items-center justify-center gap-2.5 relative group ${
                      isDraggingPhoto
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                    }`}
                  >
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {resumeData.personalInfo.photoUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <img
                            src={resumeData.personalInfo.photoUrl}
                            alt="Profile Preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50 shadow"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium group-hover:text-blue-400 transition-colors">
                          Click or drag to change photo
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200 transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-300 font-semibold">
                            Drag & drop your photo, or <span className="text-blue-400 underline font-bold">browse</span>
                          </p>
                          <p className="text-[10px] text-slate-500">Supports JPG, PNG (automatically center-cropped & optimized)</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Presets and Clear options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Presets:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePersonalInfo("photoUrl", AVATAR_PRESETS.male);
                            triggerToast("Set male professional avatar preset!", "info");
                          }}
                          className="px-2 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700/50 transition duration-150"
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePersonalInfo("photoUrl", AVATAR_PRESETS.female);
                            triggerToast("Set female professional avatar preset!", "info");
                          }}
                          className="px-2 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700/50 transition duration-150"
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePersonalInfo("photoUrl", AVATAR_PRESETS.creative);
                            triggerToast("Set creative avatar preset!", "info");
                          }}
                          className="px-2 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700/50 transition duration-150"
                        >
                          Creative
                        </button>
                      </div>
                    </div>

                    {resumeData.personalInfo.photoUrl && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPhotoEditor();
                          }}
                          className="px-2.5 py-1 text-[10px] rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition duration-150 flex items-center gap-1 shrink-0"
                        >
                          <Sliders className="w-3 h-3" />
                          Edit Photo
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePersonalInfo("photoUrl", "");
                            triggerToast("Profile photo removed.", "info");
                          }}
                          className="px-2.5 py-1 text-[10px] rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 font-semibold border border-transparent hover:border-red-900/30 transition duration-150 flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Title / Headline</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo("github", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Portfolio Website (Optional)</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    placeholder="e.g. wasibahadur.dev"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* EXECUTIVE SUMMARY PANEL */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4">
                  <h3 className="font-semibold text-sm text-slate-200">Professional Summary</h3>
                  <p className="text-xs text-slate-400">Survival hook for the 6-second scan. Tailor perfectly using AI.</p>
                </div>

                <div className="bg-blue-950/30 border border-blue-900/40 p-3.5 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Optimizer Options</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Target Industry</label>
                      <select
                        value={summaryIndustry}
                        onChange={(e) => setSummaryIndustry(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 text-[11px] rounded p-1 text-slate-300"
                      >
                        <option value="Freelance Python & Data (Upwork/Fiverr)">Freelance Gigs</option>
                        <option value="Junior Data Analyst">Data Analyst Job</option>
                        <option value="BS Computer Science (University CS Admission)">University Admission</option>
                        <option value="General Software Engineering">General Tech Role</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Tone Style</label>
                      <select
                        value={summaryTone}
                        onChange={(e) => setSummaryTone(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 text-[11px] rounded p-1 text-slate-300"
                      >
                        <option value="highly impactful & metric-driven">Metric Heavy</option>
                        <option value="academic & highly motivated">Academic</option>
                        <option value="freelance client-focused">Freelancer Hook</option>
                        <option value="highly professional & precise">Executive Slate</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={optimizeSummary}
                    disabled={isOptimizingSummary}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    {isOptimizingSummary ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    Rewrite Summary with Gemini
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400">Active Profile Summary</label>
                    {(() => {
                      const wCount = getWordCount(resumeData.summary);
                      let statusColor = "text-slate-500";
                      let statusText = "";
                      if (wCount > 0) {
                        if (wCount > 100) {
                          statusColor = "text-amber-500";
                          statusText = "⚠️ Wordy (optimal is 50-90 words)";
                        } else if (wCount < 40) {
                          statusColor = "text-slate-400";
                          statusText = "💡 Too brief (aim for 50-90 words)";
                        } else {
                          statusColor = "text-emerald-400";
                          statusText = "✓ Perfect ATS length!";
                        }
                      }
                      return (
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">{wCount} words</span>
                          <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <textarea
                    rows={6}
                    value={resumeData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Describe your executive technical value proposition..."
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recommended Length: 2-3 sentences (~50-90 words). Align with recruiter-psychology indicators and action verbs.</span>
                </div>
              </div>
            )}

            {/* EXPERIENCE PANEL */}
            {activeTab === "experience" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Work Experience & Gigs</h3>
                    <p className="text-xs text-slate-400">Order from present to past. Use bullet helpers.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                    title="Add job or freelance gig"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Bullet Point AI Generator Quick Section */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI XYZ Bullet Writer</span>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Target Job for Bullets</label>
                    <select
                      value={activeExpForBullet}
                      onChange={(e) => setActiveExpForBullet(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-1.5 text-slate-300"
                    >
                      <option value="">-- Choose Experience Target --</option>
                      {resumeData.experience.map(exp => (
                        <option key={exp.id} value={exp.id}>{exp.role} ({exp.company})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Raw facts / accomplishment ideas</label>
                    <textarea
                      placeholder="e.g. Built python web scraper to grab e-commerce prices. Handled around 20 website catalogs and made it write to csv files. Used request and beautiful soup."
                      value={bulletDraftDescription}
                      onChange={(e) => setBulletDraftDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 leading-relaxed font-mono"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Optional keywords (e.g. BeautifulSoup, CSV)"
                        value={bulletDraftKeywords}
                        onChange={(e) => setBulletDraftKeywords(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-[11px] rounded-lg px-2.5 py-1 text-slate-300"
                      />
                    </div>
                    <button
                      onClick={generateBulletPoints}
                      disabled={isGeneratingBullets || !activeExpForBullet}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      {isGeneratingBullets ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      Generate
                    </button>
                  </div>
                </div>

                {/* List of Experiences */}
                <div className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Role / Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Company / Platform</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">End Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM / Present"
                            disabled={exp.current}
                            value={exp.current ? "Present" : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white disabled:bg-slate-800 disabled:text-slate-500"
                          />
                        </div>
                        <div className="flex items-center mt-4">
                          <input
                            type="checkbox"
                            id={`curr-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                            className="mr-2"
                          />
                          <label htmlFor={`curr-${exp.id}`} className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer">Current</label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>

                      {/* Bullet points for this experience */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Bullet Points (Action verb + tool → metric)</label>
                          <button
                            type="button"
                            onClick={() => addBulletToExperience(exp.id)}
                            className="text-blue-400 text-xs font-semibold hover:text-blue-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, idx) => (
                          <div key={idx} className="space-y-1 bg-slate-900/40 p-1.5 rounded-lg border border-slate-800/60">
                            <div className="flex gap-2">
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) => updateBulletInExperience(exp.id, idx, e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 leading-relaxed font-mono"
                                placeholder="Action verb + tool/tech stack + business/metric result..."
                              />
                              <button
                                type="button"
                                onClick={() => deleteBulletInExperience(exp.id, idx)}
                                className="text-slate-500 hover:text-red-400 self-start mt-1"
                                title="Delete bullet point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            {/* Bullet Word-Count ATS Tracker */}
                            {(() => {
                              const wCount = getWordCount(bullet);
                              let statusColor = "text-slate-500";
                              let statusText = "";
                              if (wCount > 0) {
                                if (wCount > 25) {
                                  statusColor = "text-amber-500";
                                  statusText = "⚠️ Too long (keep 12-25 words for best scanning)";
                                } else if (wCount < 10) {
                                  statusColor = "text-slate-400";
                                  statusText = "💡 Thin (aim for 12-25 words with action & results)";
                                } else {
                                  statusColor = "text-emerald-400";
                                  statusText = "✓ Perfect ATS length!";
                                }
                              }
                              return wCount > 0 ? (
                                <div className="flex justify-between items-center text-[9px] px-1 font-sans">
                                  <span className="text-slate-400 font-mono font-medium">{wCount} words</span>
                                  <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS PANEL */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Personal & Freelance Projects</h3>
                    <p className="text-xs text-slate-400">Essential for freshers. Provide real outcomes.</p>
                  </div>
                  <button
                    onClick={addProject}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Project URL / GitHub</label>
                          <input
                            type="text"
                            value={proj.url}
                            onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Description & Outcome</label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Technologies used (Comma separated)</label>
                        <input
                          type="text"
                          value={
                            rawFieldsState[`proj-tech-${proj.id}`] !== undefined
                              ? rawFieldsState[`proj-tech-${proj.id}`]
                              : proj.technologies.join(", ")
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawFieldsState(prev => ({ ...prev, [`proj-tech-${proj.id}`]: val }));
                            const parsedTech = val.split(",").map(t => t.trim()).filter(Boolean);
                            updateProjectTech(proj.id, parsedTech);
                          }}
                          onBlur={() => {
                            const cleaned = proj.technologies.join(", ");
                            setRawFieldsState(prev => ({ ...prev, [`proj-tech-${proj.id}`]: cleaned }));
                          }}
                          placeholder="Python, Pandas, BeautifulSoup"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS PANEL */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Skills Grouping</h3>
                    <p className="text-xs text-slate-400">Classify skills systematically for F-pattern scan scanning.</p>
                  </div>
                  <button
                    onClick={addSkillCategory}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteSkillCategory(skill.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Skill Group Name</label>
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) => updateSkillCategory(skill.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Skills tags (Comma separated)</label>
                        <textarea
                          rows={2}
                          value={
                            rawFieldsState[`skills-${skill.id}`] !== undefined
                              ? rawFieldsState[`skills-${skill.id}`]
                              : skill.skills.join(", ")
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawFieldsState(prev => ({ ...prev, [`skills-${skill.id}`]: val }));
                            const parsedTags = val.split(",").map(t => t.trim()).filter(Boolean);
                            updateSkillTags(skill.id, parsedTags);
                          }}
                          onBlur={() => {
                            const cleaned = skill.skills.join(", ");
                            setRawFieldsState(prev => ({ ...prev, [`skills-${skill.id}`]: cleaned }));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white leading-normal font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION PANEL */}
            {activeTab === "education" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Education Background</h3>
                    <p className="text-xs text-slate-400">Include your ICS and upcoming BS Computer Science.</p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Degree / Program Name</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">School / Institute</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">End Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM / Present"
                            disabled={edu.current}
                            value={edu.current ? "Present" : edu.endDate}
                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white disabled:bg-slate-800 disabled:text-slate-500"
                          />
                        </div>
                        <div className="flex items-center mt-4">
                          <input
                            type="checkbox"
                            id={`curr-edu-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                            className="mr-2"
                          />
                          <label htmlFor={`curr-edu-${edu.id}`} className="text-[10px] font-bold text-slate-400 uppercase cursor-pointer">Current</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Grade / GPA / Status</label>
                          <input
                            type="text"
                            placeholder="e.g. A Grade / 3.9 GPA"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Achievements & Courses</label>
                        <textarea
                          rows={2}
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS PANEL */}
            {activeTab === "certs" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Certifications</h3>
                    <p className="text-xs text-slate-400">List tech, data, language, and business programs.</p>
                  </div>
                  <button
                    onClick={addCertification}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteCertification(cert.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Cert Name / Course</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Date Earned / Progress</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026-06 or In Progress"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGES PANEL */}
            {activeTab === "languages" && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">Languages Spoken</h3>
                    <p className="text-xs text-slate-400">Specify proficiency (e.g. Native, Fluent, Basic).</p>
                  </div>
                  <button
                    onClick={addLanguage}
                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => deleteLanguage(lang.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Language</label>
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Proficiency</label>
                          <input
                            type="text"
                            placeholder="Native / Fluent / Basic"
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Middle Column: Perfect A4 Interactive Sheet Preview (5 Cols) */}
        <section className="xl:col-span-5 border-r border-slate-800 flex flex-col overflow-y-auto bg-slate-900/40 p-6 min-h-0 print:p-0 print:overflow-visible">
          
          {/* Preset Customization Tool Header */}
          <div className="mb-4 bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur no-print">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sheet Theme:</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as TemplateType)}
                className="bg-slate-900 text-xs font-semibold border border-slate-800 rounded text-slate-200 py-1 px-2 focus:outline-none focus:border-indigo-500/80 transition"
              >
                <option value="modern">✦ Slate Modern</option>
                <option value="minimalist">👔 Corporate Compact</option>
                <option value="serif">🖋️ Executive Serif</option>
                <option value="split">📖 Modern Two-Column</option>
                <option value="creative">🚀 Creative Tech</option>
                <option value="academic">🎓 Academic CV</option>
                <option value="bold">🎨 Bold Header Accent</option>
                <option value="editorial">📖 Warm Editorial</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Color:</span>
                <div className="flex gap-1">
                  {["#2563eb", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#475569"].map(c => (
                    <button
                      key={c}
                      onClick={() => setPrimaryColor(c)}
                      className={`w-3.5 h-3.5 rounded-full border transition ${
                        primaryColor === c ? "ring-1 ring-white scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spacing:</span>
                <select
                  value={spacing}
                  onChange={(e) => setSpacing(e.target.value as any)}
                  className="bg-slate-900 text-[10px] font-semibold border border-slate-800 rounded text-slate-300 py-0.5 px-1"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paper:</span>
                <select
                  value={sheetBg}
                  onChange={(e) => {
                    setSheetBg(e.target.value as "white" | "black");
                    triggerToast(`Paper style set to ${e.target.value === "white" ? "White" : "Black"}`, "info");
                  }}
                  className="bg-slate-900 text-[10px] font-semibold border border-slate-800 rounded text-slate-300 py-0.5 px-1 cursor-pointer"
                >
                  <option value="white">⚪ White</option>
                  <option value="black">⚫ Black</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Print Banner Warning */}
          {showPrintHint && (
            <div className="mb-4 bg-blue-950/40 border border-blue-900/60 p-3 rounded-xl flex items-start gap-2.5 no-print">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-300">
                <span className="font-bold">Pro-tip for Perfect PDF:</span> Click <span className="font-bold underline text-white">Save / Print PDF</span>. In the print layout, enable <span className="font-bold text-white">Background graphics</span> and set margins to <span className="font-bold text-white">Minimum</span> or <span className="font-bold text-white">None</span> to get a flawless, professional one-page output!
              </div>
              <button 
                onClick={() => setShowPrintHint(false)}
                className="text-xs font-semibold text-blue-400 hover:text-white ml-auto cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* THE RESUME CANVAS SHEET */}
          <div className="flex-1 flex justify-center items-start">
            <div 
              id="resume-sheet"
              className={`w-full bg-white text-slate-900 shadow-2xl rounded-sm p-[15mm] transition-all duration-300 print-full text-left ${
                sheetBg === "black" ? "dark-sheet" : ""
              }`}
              style={{
                fontFamily: getFontFamily(template),
                lineHeight: "1.4",
              }}
            >
              {template === "split" ? (
                <>
                  {renderHeader()}
                  
                  <div className="grid grid-cols-12 gap-6 mt-5 pt-3 border-t border-slate-100">
                    {/* Left side: Skills, Certifications, Languages */}
                    <div className="col-span-4 border-r border-slate-200/60 pr-4 space-y-4">
                      {renderSkillsSection()}
                      {renderCertificationsSection()}
                      {renderLanguagesSection()}
                    </div>
                    
                    {/* Right side: Summary, Experience, Projects, Education */}
                    <div className="col-span-8 space-y-4 pl-1">
                      {renderSummarySection()}
                      {renderExperienceSection()}
                      {renderProjectsSection()}
                      {renderEducationSection()}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {renderHeader()}
                  
                  {/* Spacing Variable adjustments */}
                  <div 
                    className="flex flex-col text-left"
                    style={{
                      gap: spacing === "compact" ? "12px" : spacing === "spacious" ? "24px" : "18px"
                    }}
                  >
                    {renderSummarySection()}
                    {renderSkillsSection()}
                    {renderExperienceSection()}
                    {renderProjectsSection()}
                    {renderEducationSection()}
                    
                    {/* TWO COLUMN ROW FOR CERTIFICATIONS & LANGUAGES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderCertificationsSection()}
                      {renderLanguagesSection()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right column: Interactive AI Coach & ATS Scanner (3 Cols) */}
        <section className="xl:col-span-3 border-l border-slate-800 flex flex-col bg-slate-950/20 overflow-y-auto no-print">
          
          {/* Coach Tab Selectors */}
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10">
            <button
              onClick={() => setSidebarTab("ai-coach")}
              className={`py-3 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
                sidebarTab === "ai-coach" 
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5 font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              ATS Evaluation
            </button>
            <button
              onClick={() => setSidebarTab("job-tailor")}
              className={`py-3 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
                sidebarTab === "job-tailor" 
                  ? "border-blue-500 text-blue-400 bg-blue-500/5 font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Target className="w-4 h-4" />
              Job Match Optimizer
            </button>
          </div>

          <div className="p-5 space-y-5">
            
            {/* ATS COACH PANEL */}
            {sidebarTab === "ai-coach" && (
              <div className="space-y-4">
                <div className="text-slate-300">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <FileCheck className="text-indigo-400 w-4 h-4" /> 
                    ATS Engine Scanner
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal mt-1">
                    Analyzes word frequency, impact structure, and action verbs using real Gemini cognitive capabilities.
                  </p>
                </div>

                {!reviewResult && !isReviewing && (
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center space-y-3.5">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">No ATS Scan Generated</p>
                      <p className="text-[10px] text-slate-400">Scan Wasi's details to evaluate performance score.</p>
                    </div>
                    <button
                      onClick={runResumeReview}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Compute Recruiter Score
                    </button>
                  </div>
                )}

                {isReviewing && (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">Analyzing Resume Structure...</p>
                      <p className="text-[10px] text-slate-400">Parsing bullet points, grammar metrics, and keyword distributions.</p>
                    </div>
                  </div>
                )}

                {reviewResult && !isReviewing && (
                  <div className="space-y-4">
                    
                    {/* Radial/Bento score card */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500" />
                      
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Match Score</div>
                      
                      <div className="my-3 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          {/* Circle Background */}
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="38" strokeWidth="6" stroke="#1e293b" fill="transparent" />
                            <circle cx="48" cy="48" r="38" strokeWidth="6" 
                              stroke={reviewResult.score >= 80 ? "#10b981" : reviewResult.score >= 60 ? "#3b82f6" : "#f59e0b"} 
                              strokeDasharray={2 * Math.PI * 38}
                              strokeDashoffset={2 * Math.PI * 38 * (1 - reviewResult.score / 100)}
                              strokeLinecap="round"
                              fill="transparent" 
                            />
                          </svg>
                          <span className="absolute text-xl font-bold font-mono text-white">
                            {reviewResult.score}%
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wide">
                        Rating: {reviewResult.score >= 80 ? "Highly Optimised" : reviewResult.score >= 60 ? "Good Potential" : "Needs Editing"}
                      </div>
                    </div>

                    {/* Strengths List */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Core Strengths Found
                      </span>
                      <ul className="space-y-1 text-slate-300 text-[11px] list-none">
                        {reviewResult.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-normal">
                            <span className="text-emerald-500 text-xs mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Keywords Suggested */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                        <Code className="w-3 h-3" /> Recommended ATS Keywords
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {reviewResult.suggestedKeywords.map((kw, i) => (
                          <span key={i} className="bg-blue-950/60 text-blue-400 border border-blue-900/40 text-[9px] font-semibold px-2 py-0.5 rounded-full font-mono">
                            +{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable Feedback points */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prioritised Adjustments</span>
                      <div className="space-y-2.5">
                        {reviewResult.feedback.map((item, i) => (
                          <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
                            {item.severity === "high" ? (
                              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                            ) : item.severity === "medium" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            ) : (
                              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                                  {item.category}
                                </span>
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                  item.severity === "high" ? "text-red-400" : item.severity === "medium" ? "text-amber-400" : "text-blue-400"
                                }`}>
                                  {item.severity}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-normal">{item.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* JOB MATCH OPTIMIZER PANEL */}
            {sidebarTab === "job-tailor" && (
              <div className="space-y-4">
                <div className="text-slate-300">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Target className="text-blue-400 w-4 h-4" /> 
                    Tailoring & Matching Suite
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal mt-1">
                    Paste an Upwork description, Fiverr brief, or direct Job Ad to cross-reference and customize your profile to match target keywords.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Target Job Posting / Client Brief</label>
                  <textarea
                    placeholder="e.g. Seeking a Freelance Python Developer on Upwork to automate web data extraction. Must be skilled in Pandas, requests, BeautifulSoup, and structured data..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 leading-relaxed font-mono focus:outline-none focus:border-blue-500"
                    rows={6}
                  />
                </div>

                <button
                  onClick={runResumeTailoring}
                  disabled={isTailoring || !jobDescription.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  {isTailoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                  Tailor Profile Using AI
                </button>

                {isTailoring && (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">Matching Keywords & Context...</p>
                      <p className="text-[10px] text-slate-400">Re-ranking summaries and pinpointing gaps.</p>
                    </div>
                  </div>
                )}

                {tailorResult && !isTailoring && (
                  <div className="space-y-4">
                    
                    {/* Score Ring */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Match Percentage</span>
                      <div className="text-3xl font-extrabold text-blue-400 font-mono mt-2 mb-1">
                        {tailorResult.matchScore}%
                      </div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {tailorResult.matchScore >= 85 ? "Excellent Alignment!" : tailorResult.matchScore >= 60 ? "Moderate Alignment - Make adjustments" : "Critical Gaps Present"}
                      </span>
                    </div>

                    {/* Critical Gaps & Keywords */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> High-Value Keywords to Emphasize
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tailorResult.criticalKeywords.map((kw, i) => (
                          <span key={i} className="bg-amber-950/50 text-amber-400 border border-amber-900/30 text-[9px] font-semibold px-2 py-0.5 rounded font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tailored Summary Output */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Tailored Profile Summary
                        </span>
                        <button
                          onClick={applyTailoredSummary}
                          className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition"
                        >
                          Apply Instantly
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">
                        "{tailorResult.tailoredSummary}"
                      </p>
                    </div>

                    {/* Actionable experience modifications */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actionable Experience Changes</span>
                      <div className="space-y-2">
                        {tailorResult.actionableSteps.map((step, i) => (
                          <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-start gap-2 text-slate-300">
                            <span className="text-blue-400 font-bold text-xs mt-0.5">→</span>
                            <p className="text-[11px] leading-normal">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </section>

      </main>
      
      {/* Visual Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-6 py-2 text-center text-[11px] text-slate-500 flex justify-between items-center gap-4 no-print">
        <span>Google AI Studio • Premium Recruiter Suite v1.4</span>
        <span className="font-mono">Current Local System Time: 2026-06-28</span>
      </footer>

      {/* Interactive Photo Editor Modal Overlay */}
      {isEditingPhoto && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 no-print"
          onClick={() => setIsEditingPhoto(false)}
        >
          <div 
            className="bg-slate-950 border border-slate-800/80 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12 max-h-[95vh] text-slate-200 md:h-[580px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: Preview Workspace (5 cols) */}
            <div className="md:col-span-5 bg-slate-900/40 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
              <div className="w-full">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <Crop className="w-4 h-4 text-blue-500" /> Frame Preview
                </h3>
                <p className="text-[11px] text-slate-400">Position the facial area perfectly inside the headshot boundary.</p>
              </div>

              <div className="my-auto py-4">
                <div 
                  ref={canvasContainerRef}
                  className="relative w-full max-w-[280px] aspect-square bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-hidden flex items-center justify-center"
                >
                  <canvas
                    ref={editorCanvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUpOrLeave}
                    onMouseLeave={handleCanvasMouseUpOrLeave}
                    onWheel={handleCanvasWheel}
                    className="cursor-move select-none"
                    style={{
                      width: `${canvasDimensions.width}px`,
                      height: `${canvasDimensions.height}px`
                    }}
                    title="Click and drag to pan, scroll to zoom"
                  />
                </div>
                <p className="text-[10px] text-slate-500 text-center mt-3">
                  💡 <span className="text-slate-400 font-semibold">Click & Drag</span> to reposition • <span className="text-slate-400 font-semibold">Scroll</span> to zoom
                </p>
              </div>

              {/* Quick Actions under Canvas */}
              <div className="flex flex-col gap-2.5 w-full">
                <div className="flex justify-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setEditorRotation(prev => (prev - 90) % 360);
                      triggerToast("Rotated left 90°", "info");
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-850 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 flex items-center justify-center gap-1.5 font-medium transition duration-150"
                  >
                    <RotateCw className="w-3.5 h-3.5 transform -scale-x-100" /> Rotate L
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditorRotation(prev => (prev + 90) % 360);
                      triggerToast("Rotated right 90°", "info");
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-850 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 flex items-center justify-center gap-1.5 font-medium transition duration-150"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Rotate R
                  </button>
                </div>
                <div className="flex justify-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={autoFramePhoto}
                    className="flex-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition duration-150"
                  >
                    ✨ Auto-Frame Face
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditorZoom(1.0);
                      setEditorPanX(0);
                      setEditorPanY(0);
                      setEditorRotation(0);
                      triggerToast("Reset layout framing", "info");
                    }}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 font-medium transition duration-150"
                  >
                    Reset Fit
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Image adjustment controls (7 cols) */}
            <div className="md:col-span-7 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
              <div className="space-y-5">
                {/* Heading */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">Professional Photo Editor</h2>
                    <p className="text-xs text-slate-400">Enhance and format your profile picture for corporate recruitment.</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingPhoto(false)}
                    className="text-slate-400 hover:text-white text-lg font-bold px-1.5"
                  >
                    &times;
                  </button>
                </div>

                {/* Crop shape style selection */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Crop Mask Overlay Shape:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["circle", "rounded", "square"] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setCropShape(shape)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize border transition duration-150 ${
                          cropShape === shape
                            ? "bg-blue-600/15 border-blue-500 text-blue-400"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter presets */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Corporate Filter Presets:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "original", label: "Original" },
                      { id: "bw", label: "Executive B&W" },
                      { id: "warm", label: "Warm Portrait" },
                      { id: "cool", label: "Tech Cool" },
                      { id: "vivid", label: "Vivid Glow" },
                      { id: "slate", label: "Slate Gray" }
                    ].map((filt) => (
                      <button
                        key={filt.id}
                        type="button"
                        onClick={() => applyPhotoFilterPreset(filt.id as any)}
                        className="px-2.5 py-1 text-[11px] rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 font-semibold transition duration-150"
                      >
                        {filt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pic Quality Enhancer Section */}
                <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                      ✨ Pic Quality Enhancer
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Instantly balance lighting, boost contrast, optimize skin saturation, and sharpen details for a high-definition professional look.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAutoEnhance}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition duration-150 shadow-md shrink-0 ${
                      isAutoEnhanced
                        ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/20"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    {isAutoEnhanced ? "★ Active" : "Enhance Quality"}
                  </button>
                </div>

                {/* Custom adjustment sliders */}
                <div className="space-y-4 pt-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" /> Fine Adjustments
                  </label>

                  <div className="space-y-3.5 bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
                    {/* Zoom slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Zoom Scale</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorZoom.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="4.0"
                        step="0.05"
                        value={editorZoom}
                        onChange={(e) => setEditorZoom(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Rotation slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Rotation Angle</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={editorRotation}
                        onChange={(e) => setEditorRotation(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Brightness */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium flex items-center gap-1"><Sun className="w-3 h-3 text-slate-500" /> Brightness</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorBrightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        step="1"
                        value={editorBrightness}
                        onChange={(e) => {
                          setEditorBrightness(parseInt(e.target.value));
                          setIsAutoEnhanced(false);
                        }}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium flex items-center gap-1"><Contrast className="w-3 h-3 text-slate-500" /> Contrast</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorContrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        step="1"
                        value={editorContrast}
                        onChange={(e) => {
                          setEditorContrast(parseInt(e.target.value));
                          setIsAutoEnhanced(false);
                        }}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Saturation / Saturate */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Saturate Intensity</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorSaturate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="1"
                        value={editorSaturate}
                        onChange={(e) => {
                          setEditorSaturate(parseInt(e.target.value));
                          setIsAutoEnhanced(false);
                        }}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Sharpness & Detail Clarity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Sharpness & Detail Clarity</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorSharpness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="2"
                        value={editorSharpness}
                        onChange={(e) => {
                          setEditorSharpness(parseInt(e.target.value));
                          setIsAutoEnhanced(false);
                        }}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Soft Blur */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Soft Blur Focus</span>
                        <span className="font-mono text-blue-400 font-semibold">{editorBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.5"
                        value={editorBlur}
                        onChange={(e) => {
                          setEditorBlur(parseFloat(e.target.value));
                          setIsAutoEnhanced(false);
                        }}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPhoto(false);
                    triggerToast("Photo editing canceled.", "info");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPhotoEdits}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/10 transition duration-150 flex items-center gap-1.5"
                >
                  Apply & Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Windows App Installer & Info Modal */}
      {showDesktopModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 text-left relative text-slate-100">
            
            {/* Close Button */}
            <button
              onClick={() => setShowDesktopModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xl font-bold"
            >
              &times;
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-800/80 pb-4">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/10 shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Windows Operating System Mode 🖥️
                </h2>
                <p className="text-xs text-slate-400">Run Resume Builder as a native Windows desktop app</p>
              </div>
            </div>

            {/* Option 1: Instantly Install via browser (PWA) */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Option 1: Instantly Install Standalone PWA App
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly save this app to your Windows desktop. It will run in its own clean window, launch from your Start Menu, and support offline usage. No downloads needed.
                  </p>
                </div>
                
                {showInstallBtn ? (
                  <button
                    onClick={triggerPwaInstall}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/10 transition shrink-0 cursor-pointer"
                  >
                    Install Standalone
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-2.5 py-1 rounded-full shrink-0">
                    Active & Ready
                  </span>
                )}
              </div>

              {/* Status information or helper to install manually in browser */}
              {!showInstallBtn && (
                <div className="text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800/40">
                  💡 **Already installed or ready**: If the prompt doesn't appear automatically, look for the **Install Icon** (a small monitor or arrow in a square) in your browser's address bar (Chrome or Microsoft Edge) at the top right to save it immediately to your Windows system.
                </div>
              )}
            </div>

            {/* Option 2: Build a native Windows Executable (.exe) file */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Option 2: Build Native Windows Executable (`.exe`)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We have added all necessary scripts and the full **Electron** configuration to the workspace. If you download this code as a ZIP file, you can compile it into a fully native `.exe` installation file for Windows in one click!
              </p>

              {/* Steps */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3 font-sans">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-300 mt-0.5 shrink-0">1</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">Export Project</p>
                    <p className="text-[11px] text-slate-400">Click the settings gear icon in AI Studio and export this app as a **ZIP** file.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-300 mt-0.5 shrink-0">2</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">Install dependencies</p>
                    <p className="text-[11px] text-slate-400">Open your terminal in the extracted folder and run:</p>
                    <div className="bg-slate-950 px-3 py-1.5 rounded font-mono text-[10px] text-blue-400 mt-1 flex items-center justify-between border border-slate-900">
                      <span>npm install</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-300 mt-0.5 shrink-0">3</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">Package Windows App</p>
                    <p className="text-[11px] text-slate-400">Run the build package command to generate the installer executable:</p>
                    <div className="bg-slate-950 px-3 py-1.5 rounded font-mono text-[10px] text-blue-400 mt-1 flex items-center justify-between border border-slate-900">
                      <span>npm run electron:build</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/30 border border-blue-900/30 p-3.5 rounded-xl flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-300 leading-normal">
                  **Windows Executables Generated**: This command compiles a standard `.exe` installer under `dist_electron/Resume Builder Setup 0.0.0.exe` as well as a standalone portable version that opens without installation!
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowDesktopModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition duration-150 cursor-pointer"
              >
                Done
              </button>
              {showInstallBtn && (
                <button
                  type="button"
                  onClick={triggerPwaInstall}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/10 transition duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Install App Now
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Custom Toast Notifications */}
      <div className="fixed bottom-14 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-3 rounded-lg shadow-2xl text-xs font-semibold border flex items-center justify-between gap-3 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/30 text-emerald-400"
                : toast.type === "error"
                ? "bg-slate-900/95 border-red-500/30 text-red-400"
                : "bg-slate-900/95 border-indigo-500/30 text-indigo-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-indigo-500"
              }`} />
              <span className="text-slate-100 font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-500 hover:text-slate-300 transition shrink-0 text-sm leading-none pb-0.5"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
