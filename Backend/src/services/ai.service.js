// ai.service.js
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

// ---- Gemini client ----
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ---- Schemas ----
const interviewReportSchema = z.object({
  title: z.string().min(1).default("Interview Report"),
  matchScore: z.number().min(0).max(100).default(0),
  technicalQuestions: z.array(
    z.object({
      question: z.string().min(1),
      intention: z.string().min(1),
      answer: z.string().min(1) 
    })
  ).min(1),
  behavioralQuestions: z.array(
    z.object({
      question: z.string().min(1),
      intention: z.string().min(1),
      answer: z.string().min(1),
    })
  ).min(1),
  skillGaps: z.array(
    z.object({
      skill: z.string().min(1),
      severity: z.enum(["low", "medium", "high"]),
    })
  ).default([]),
  preparationPlan: z.array(
    z.object({
      day: z.number().int().min(1),
      focus: z.string().min(1),
      tasks: z.array(z.string().min(1)).min(1),
    })
  ).default([]),
});

const resumePdfSchema = z.object({
  html: z.string().min(1),
});

// ---- Helpers ----

function extractResponseText(response) {
  if (!response) return "";
  if (typeof response.text === "function") return response.text();
  if (typeof response.text === "string") return response.text;
  try {
    return response.candidates[0].content.parts[0].text;
  } catch (e) {
    return "";
  }
}

function safeJsonParse(text) {
  try {
    const cleanText = text.replace(/```json|```/g, "").trim();
    return { ok: true, value: JSON.parse(cleanText) };
  } catch (e) {
    return { ok: false, error: e };
  }
}

/**
 * THE REPAIR ENGINE (Final Edition)
 */
function repairAiResponse(data) {
  const repaired = { ...data };

  // FIX: Catch British spelling or generic "questions" key
  if (repaired.behaviouralQuestions && !repaired.behavioralQuestions) {
    repaired.behavioralQuestions = repaired.behaviouralQuestions;
  }
  if (repaired.behaviourQuestions && !repaired.behavioralQuestions) {
    repaired.behavioralQuestions = repaired.behaviourQuestions;
  }
  if (Array.isArray(repaired.questions) && (!repaired.technicalQuestions || repaired.technicalQuestions.length === 0)) {
    repaired.technicalQuestions = repaired.questions;
  }

  const fixQ = (arr, fallbackQ) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [{
        question: fallbackQ,
        intention: "Evaluate communication and expertise.",
        answer: "To be determined during interview."
      }];
    }
    return arr.map(item => {
      if (typeof item === 'string') {
        return { 
          question: item.replace(/question:|intention:|answer:/gi, "").trim(), 
          intention: "Evaluate competency", 
          answer: "Assessment required" 
        };
      }
      return item;
    });
  };

  repaired.technicalQuestions = fixQ(repaired.technicalQuestions, "Explain your experience with Full-Stack development.");
  repaired.behavioralQuestions = fixQ(repaired.behavioralQuestions, "Tell me about a time you solved a complex bug.");

  // Repair Skill Gaps
 if (Array.isArray(repaired.skillGaps) && repaired.skillGaps.length > 0) {
  repaired.skillGaps = repaired.skillGaps.map(item => {
    if (typeof item === 'string') {
      return { 
        skill: item.replace(/^skill:\s*/i, "").trim(), 
        severity: "medium" 
      };
    }
    return {
      skill: item.skill ? item.skill.replace(/^skill:\s*/i, "").trim() : "General Skill",
      severity: item.severity ? item.severity.replace(/^severity:\s*/i, "").toLowerCase().trim() : "medium"
    };
  });
} else {
  // Always keep a fallback so Zod .min(1) doesn't crash the request
  repaired.skillGaps = [{ skill: "General technical stack review", severity: "low" }];
}

  // Repair Prep Plan
  if (Array.isArray(repaired.preparationPlan)) {
    repaired.preparationPlan = repaired.preparationPlan.map((item, idx) => (typeof item === 'string' 
      ? { day: idx + 1, focus: item, tasks: ["Review this topic"] } : item));
  } else {
    repaired.preparationPlan = [{ day: 1, focus: "Project Review", tasks: ["Review resume projects"] }];
  }

  // FIX: Match Score stripping
  if (repaired.matchScore !== undefined && typeof repaired.matchScore !== 'number') {
    repaired.matchScore = parseInt(String(repaired.matchScore).replace(/[^0-9]/g, "")) || 0;
  }

  return repaired;
}

// ---- Main functions ----

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  if (!resume || !selfDescription || !jobDescription) {
    throw new Error("Missing inputs");
  }

  const prompt = `
    ACT AS AN EXPERT TECHNICAL RECRUITER.
    Generate a JSON interview report. Use ONLY these keys exactly:
    "title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan".

    RULES:
    1. matchScore MUST be a number between 1 and 100.
    2. technicalQuestions and behavioralQuestions MUST be arrays of objects.
    3. skillGaps MUST be an array of objects with "skill" and "severity".
    4. DO NOT use the key "behaviourQuestions" (use behavioralQuestions).

    DATA:
    Resume: ${resume}
    Job: ${jobDescription}
    Self:${selfDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  const text = extractResponseText(response);
  const parsed = safeJsonParse(text);
  if (!parsed.ok) throw new Error("AI JSON Parse Failed");

  const cleanedData = repairAiResponse(parsed.value);

  const validated = interviewReportSchema.safeParse(cleanedData);
  if (!validated.success) {
    console.error("ZOD FAILED:", JSON.stringify(validated.error.format(), null, 2));
    throw new Error("Validation Error");
  }

  return validated.data;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, jobDescription }) {
  const prompt = `Return JSON { "html": "string" } for a resume. Data: ${resume}`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });
  const parsed = safeJsonParse(extractResponseText(response));
  return await generatePdfFromHtml(parsed.value.html);
}

module.exports = { generateInterviewReport, generateResumePdf };