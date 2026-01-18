import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Load multiple API keys from .env
const API_KEYS = [];
let keyIndex = 1;
while (process.env[`GEMINI_API_KEY_${keyIndex}`]) {
  API_KEYS.push(process.env[`GEMINI_API_KEY_${keyIndex}`]);
  keyIndex++;
}

// Fallback to single key if no numbered keys found
if (API_KEYS.length === 0 && process.env.GEMINI_API_KEY) {
  API_KEYS.push(process.env.GEMINI_API_KEY);
}

console.log(`🔑 Loaded ${API_KEYS.length} Gemini API Key(s)`);
API_KEYS.forEach((key, idx) => {
  console.log(`   Key ${idx + 1}: ${key.substring(0, 10)}...${key.substring(key.length - 4)}`);
});

// --------------------------------------------------
// Helper: Try multiple API keys with automatic fallback
// --------------------------------------------------
async function tryMultipleKeys(requestFn) {
  const keysToTry = [...API_KEYS]; // Start with env keys

  let lastError = null;

  for (let i = 0; i < keysToTry.length; i++) {
    const apiKey = keysToTry[i];
    console.log(`🔑 Trying API Key ${i + 1}/${keysToTry.length}...`);

    try {
      const result = await requestFn(apiKey);

      // Check if result has error from Gemini
      if (result.error) {
        console.log(`❌ Key ${i + 1} failed: ${result.error.message || result.error}`);
        lastError = result.error;
        continue; // Try next key
      }

      console.log(`✅ Key ${i + 1} succeeded!`);
      return { success: true, data: result, keyIndex: i + 1 };

    } catch (err) {
      console.log(`❌ Key ${i + 1} error: ${err.message}`);
      lastError = err;
      continue; // Try next key
    }
  }

  // All keys failed
  return {
    success: false,
    error: lastError?.message || lastError || "All API keys failed",
    allKeysFailed: true
  };
}

// --------------------------------------------------
// API: Generate Interview Questions (Gemini Powered)
// --------------------------------------------------
app.post("/api/generate-questions", async (req, res) => {
  const { jobTitle, difficulty = "All", numQuestions = 5, language = "English", apiKey, modelName = "gemini-1.5-pro", cvText = null } = req.body;

  console.log(`\n📥 Request received: ${jobTitle}, ${difficulty}, ${numQuestions} questions, Model: ${modelName}, CV: ${cvText ? 'Yes' : 'No'}`);

  // Build prompt with or without CV content
  let prompt = `
You are an AI interview generator.

Generate EXACTLY ${numQuestions} interview questions for the role: **${jobTitle}**.

Difficulty level: **${difficulty}**
Language: **${language}**
`;

  // Add CV-specific instructions if CV is provided
  if (cvText && cvText.trim()) {
    prompt += `
**CANDIDATE CV/RESUME:**
${cvText.substring(0, 3000)}

IMPORTANT: Based on the candidate's CV above, generate PERSONALIZED interview questions that:
- Relate to their specific experiences, projects, and skills mentioned in the CV
- Probe deeper into their claimed expertise areas
- Ask about technologies, frameworks, and methodologies they listed
- Challenge them on the projects they mentioned
- Assess if their experience matches the ${jobTitle} role requirements
`;
  }

  prompt += `
IMPORTANT: For each question, provide:
1. "q": The interview question ${cvText ? '(personalized to their CV)' : '(general for the role)'}
2. "keywords": 5-8 important keywords that should appear in a good answer (comma-separated)
3. "diff": Difficulty level (Easy, Medium, or Hard)

Return the output ONLY in raw JSON format:
{
  "questions": [
    {
      "q": "Describe your experience with Python decorators",
      "keywords": "decorator, function, wrapper, @, modify, behavior",
      "diff": "Medium"
    },
    {
      "q": "What is the difference between list and tuple in Python?",
      "keywords": "list, tuple, mutable, immutable, memory, performance",
      "diff": "Easy"
    }
  ]
}

Do not add any commentary, markdown, backticks, or extra text. Only return the JSON.
  `;

  // Function to call Gemini with a specific API key
  const callGemini = async (keyToUse) => {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${keyToUse}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiRes.json();
    console.log("📤 Gemini raw response:", JSON.stringify(data, null, 2));

    // Check for Gemini API errors
    if (data.error) {
      return { error: data.error };
    }

    // Extract response text safely
    let raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.inlineData ||
      "{}";

    if (!raw) raw = "{}";

    // Clean Gemini failures: ```json ... ```
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    console.log("🔍 Extracted text:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log("✅ Parsed successfully:", parsed);
    } catch (err) {
      console.log("❌ Failed to parse Gemini JSON:");
      console.log(raw);
      return { error: { message: "Failed to parse response" } };
    }

    return parsed;
  };

  try {
    // If user provided their own API key, use only that
    if (apiKey) {
      console.log("🔑 Using user-provided API key");
      const result = await callGemini(apiKey);

      if (result.error) {
        return res.json({
          error: result.error.message,
          questions: [],
          fallbackAvailable: true
        });
      }

      return res.json({
        questions: result.questions || [],
        usedKey: "user-provided"
      });
    }

    // Otherwise, try multiple keys from .env with automatic fallback
    const result = await tryMultipleKeys(callGemini);

    if (!result.success) {
      console.log("❌ All API keys failed, frontend will use local dataset");
      return res.json({
        error: result.error,
        questions: [],
        allKeysFailed: true
      });
    }

    console.log(`📊 Returning ${result.data.questions?.length || 0} questions to frontend\n`);

    return res.json({
      questions: result.data.questions || [],
      usedKey: result.keyIndex
    });

  } catch (err) {
    console.error("🔥 Gemini API Server Error:", err);
    return res.json({
      error: "Gemini request failed",
      questions: [],
      allKeysFailed: true
    });
  }
});

// --------------------------------------------------
// API: List Available Models
// --------------------------------------------------
app.post("/api/list-models", async (req, res) => {
  const { apiKey } = req.body;
  const activeApiKey = apiKey || GEMINI_API_KEY;

  if (!activeApiKey) {
    return res.status(400).json({
      error: "No API key provided",
      models: []
    });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${activeApiKey}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );

    const data = await geminiRes.json();
    console.log("📋 Available models:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.json({
        error: data.error.message,
        models: []
      });
    }

    // Extract model names that support generateContent
    const models = (data.models || [])
      .filter(model =>
        model.supportedGenerationMethods &&
        model.supportedGenerationMethods.includes('generateContent')
      )
      .map(model => ({
        name: model.name.replace('models/', ''),
        displayName: model.displayName,
        description: model.description
      }));

    return res.json({ models });
  } catch (err) {
    console.error("🔥 Error listing models:", err);
    return res.status(500).json({
      error: "Failed to list models",
      models: []
    });
  }
});

// --------------------------------------------------
// API: Parse CV (PDF/DOCX/TXT)
// --------------------------------------------------
app.post("/api/parse-cv", upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    let text = '';

    console.log(`📄 Parsing CV: ${file.originalname}, Type: ${file.mimetype}`);

    // Parse based on file type
    if (file.mimetype === 'application/pdf') {
      // Parse PDF
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.originalname.endsWith('.docx')) {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else if (file.mimetype === 'application/msword' || file.originalname.endsWith('.doc')) {
      // DOC files are harder to parse, return error for now
      return res.status(400).json({
        error: "Old .doc format not supported. Please convert to .docx or use PDF/TXT"
      });
    } else {
      return res.status(400).json({
        error: "Unsupported file format. Please use PDF, DOCX, or TXT"
      });
    }

    console.log(`✅ CV parsed successfully, ${text.length} characters`);

    return res.json({
      text: text.trim(),
      filename: file.originalname,
      size: file.size
    });

  } catch (err) {
    console.error("🔥 Error parsing CV:", err);
    return res.status(500).json({
      error: "Failed to parse CV file"
    });
  }
});

app.listen(4000, () => console.log("🚀 Gemini backend running on port 4000"));
