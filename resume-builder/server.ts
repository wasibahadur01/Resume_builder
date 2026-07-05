import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Middleware
app.use(express.json());

// API Endpoints
app.post("/api/ai/optimize-summary", async (req, res) => {
  try {
    const { summary, tone = "professional", industry = "General" } = req.body;
    if (!summary || typeof summary !== "string") {
      res.status(400).json({ error: "Missing or invalid 'summary' in request body." });
      return;
    }

    const systemInstruction = "You are an expert resume writer and career coach.";
    const prompt = `Rewrite the following professional summary to make it highly impactful, clear, and professional. 
Tone: ${tone}
Target Industry: ${industry}
Keep it concise, strictly between 2 to 4 sentences. Focus on value propositions, action-oriented descriptions, and avoid fluff or generic clichés.

Original summary to rewrite:
"${summary}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ optimizedSummary: response.text?.trim() });
  } catch (error: any) {
    console.error("Error optimizing summary:", error);
    res.status(500).json({ error: error.message || "Failed to optimize summary using AI." });
  }
});

app.post("/api/ai/generate-bullet-points", async (req, res) => {
  try {
    const { role, company, description, keywords = [] } = req.body;
    if (!role || !description) {
      res.status(400).json({ error: "Missing 'role' or 'description' in request body." });
      return;
    }

    const keywordPrompt = keywords.length > 0 ? `Incorporate some of these keywords naturally if relevant: ${keywords.join(", ")}.` : "";
    const prompt = `Write 3 to 4 strong, professional, action-oriented resume bullet points for the following role:
Role: ${role}
Company: ${company || "Unspecified"}
Raw description / achievements:
"${description}"

Instructions:
1. Start each bullet with a strong action verb (e.g., "Led", "Engineered", "Optimized", "Architected").
2. Focus on accomplishments rather than just duties.
3. Where possible, formulate bullets using the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
4. ${keywordPrompt}
5. Keep each bullet point brief and professional. Avoid filler words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite executive CV writer. Output ONLY the list of 3-4 bullet points, each starting with a bullet marker '• '.",
        temperature: 0.7,
      }
    });

    const bulletsText = response.text || "";
    const bullets = bulletsText
      .split("\n")
      .map(line => line.replace(/^[•\s-*]+\s*/, "").trim())
      .filter(line => line.length > 0);

    res.json({ bullets });
  } catch (error: any) {
    console.error("Error generating bullet points:", error);
    res.status(500).json({ error: error.message || "Failed to generate bullet points." });
  }
});

app.post("/api/ai/review-resume", async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume) {
      res.status(400).json({ error: "Missing 'resume' object in request body." });
      return;
    }

    const prompt = `Analyze this professional resume profile and provide detailed, constructive, actionable feedback, along with scoring:

Resume Data:
${JSON.stringify(resume, null, 2)}

Please evaluate the following aspects:
- Overall impact and readability
- Action verb usage and results-oriented bullet points
- Missing typical skills or profile enhancements
- Formatting, structure, and spacing quality

Provide the evaluation strictly structured as JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an automated Applicant Tracking System (ATS) scanner and senior tech recruiter.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Overall resume strength score from 0 to 100."
            },
            feedback: {
              type: Type.ARRAY,
              description: "Actionable critical feedback issues.",
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "e.g., Summary, Experience, Skills, Impact, Structure" },
                  message: { type: Type.STRING, description: "Specific advice or issue found" },
                  severity: { type: Type.STRING, description: "high, medium, or low" }
                },
                required: ["category", "message", "severity"]
              }
            },
            strengths: {
              type: Type.ARRAY,
              description: "Key strengths highlighted in this resume.",
              items: { type: Type.STRING }
            },
            suggestedKeywords: {
              type: Type.ARRAY,
              description: "ATS keywords that should be added based on this person's background.",
              items: { type: Type.STRING }
            }
          },
          required: ["score", "feedback", "strengths", "suggestedKeywords"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error reviewing resume:", error);
    res.status(500).json({ error: error.message || "Failed to review resume." });
  }
});

app.post("/api/ai/tailor-resume", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
      res.status(400).json({ error: "Missing 'resume' or 'jobDescription' in request body." });
      return;
    }

    const prompt = `Analyze this resume against the following job description, and tailor/adjust the resume to match the job requirements:

Job Description:
"${jobDescription}"

Current Resume:
${JSON.stringify(resume, null, 2)}

Instructions:
1. Provide highly targeted suggestions on how to improve this resume to fit this exact job (e.g., which skills to emphasize, which achievements to add).
2. Generate an tailored Professional Summary specifically optimized for this job description.
3. Identify 5-8 crucial keywords or technologies from the job description that are missing or should be highlighted.
4. Provide the result strictly in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an ATS optimization algorithm and job matching assistant.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.INTEGER,
              description: "Estimate of ATS job match match percentage (0-100)."
            },
            tailoredSummary: {
              type: Type.STRING,
              description: "A tailored version of the professional summary matching the job's core expectations."
            },
            criticalKeywords: {
              type: Type.ARRAY,
              description: "List of critical keywords from the job description to include.",
              items: { type: Type.STRING }
            },
            actionableSteps: {
              type: Type.ARRAY,
              description: "Bullet points detailing exact edits the candidate should make to experience descriptions.",
              items: { type: Type.STRING }
            }
          },
          required: ["matchScore", "tailoredSummary", "criticalKeywords", "actionableSteps"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error tailoring resume:", error);
    res.status(500).json({ error: error.message || "Failed to tailor resume." });
  }
});

// Vite Middleware for integration in development, static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
