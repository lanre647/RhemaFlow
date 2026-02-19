import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ── Uploads directory ──
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Multer config ──
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

// Allowed audio & video extensions
const AUDIO_EXT = [".mp3", ".m4a", ".wav", ".webm", ".ogg", ".aac", ".flac"];
const VIDEO_EXT = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv"];
const ALLOWED_EXT = [...new Set([...AUDIO_EXT, ...VIDEO_EXT])];

// ── Gemini client ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ── In-memory transcript store (replace with DB later) ──
const transcripts = new Map();

// ── Health check ──
app.get("/", (_, res) => res.json({ status: "ok", message: "RhemaFlows API running" }));

// ── Helper: wrap multer so errors become JSON responses ──
function handleUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("audio")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ── Upload & transcribe ──
app.post("/api/transcribe", async (req, res) => {
  try {
    await handleUpload(req, res);
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    // Validate file extension
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: `Unsupported file type (${ext}). Use MP3, M4A, WAV, MP4, MOV, or WEBM.` });
    }
    const isVideo = VIDEO_EXT.includes(ext);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured. Add your key to backend/.env" });
    }

    const { title, speaker, tags } = req.body;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Read file as base64 for Gemini
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString("base64");

    // Use Gemini to transcribe the audio/video
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const mediaType = isVideo ? "video" : "audio";
    const transcribeResult = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      {
        text: `You are a professional transcription service. Transcribe this ${mediaType} file completely and accurately.

Rules:
- Transcribe every spoken word faithfully
- Add proper punctuation and paragraphing
- If you can identify different speakers, label them (e.g., "Speaker 1:", "Pastor:", etc.)
- Add approximate timestamps every 30-60 seconds in the format [MM:SS]
- Preserve the natural flow and emphasis of the speech
- Do NOT summarize — transcribe the full content
${isVideo ? "- If there is text visible on screen (slides, titles, scripture references), note them in [brackets]\n" : ""}
Return the transcription as plain text with timestamps and speaker labels.`,
      },
    ]);

    const transcript = transcribeResult.response.text();

    // Store transcript
    const id = Date.now().toString();
    const transcriptData = {
      id,
      title: title || req.file.originalname.replace(/\.[^/.]+$/, ""),
      speaker: speaker || "Unknown",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: "—",
      transcript,
      quotes: [],
      status: "completed",
      filePath,
      createdAt: new Date().toISOString(),
    };

    transcripts.set(id, transcriptData);

    res.json({ id, message: "Transcription complete", transcript: transcriptData });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: err.message || "Transcription failed" });
  }
});

// ── Get all transcripts ──
app.get("/api/transcripts", (_, res) => {
  const list = Array.from(transcripts.values())
    .map(({ id, title, speaker, tags, date, duration, status, quotes, createdAt }) => ({
      id, title, speaker, tags, date, duration, status, quotes, createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// ── Get single transcript ──
app.get("/api/transcripts/:id", (req, res) => {
  const t = transcripts.get(req.params.id);
  if (!t) return res.status(404).json({ error: "Transcript not found" });
  res.json(t);
});

// ── Extract quotes with Gemini ──
app.post("/api/transcripts/:id/extract-quotes", async (req, res) => {
  try {
    const t = transcripts.get(req.params.id);
    if (!t) return res.status(404).json({ error: "Transcript not found" });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        text: `You are an expert at identifying powerful, meaningful, and shareable quotes from sermons and teachings.

Analyze this transcript and extract the most impactful quotes:

"""
${t.transcript}
"""

Rules:
- Extract 5-15 of the most powerful, memorable, and shareable quotes
- Each quote should be a complete thought that stands on its own
- Include the approximate timestamp if available
- Categorize each quote with relevant themes (e.g., faith, hope, love, prayer, perseverance)
- Rate each quote's impact from 1-5 (5 = most powerful)

Return ONLY valid JSON in this exact format (no markdown, no code fences):
[
  {
    "text": "The exact quote text",
    "timestamp": "MM:SS",
    "speaker": "Speaker name if known",
    "themes": ["theme1", "theme2"],
    "impact": 4
  }
]`,
      },
    ]);

    let quotesText = result.response.text().trim();
    // Strip markdown code fences if present
    quotesText = quotesText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    const quotes = JSON.parse(quotesText);
    t.quotes = quotes;
    transcripts.set(t.id, t);

    res.json({ quotes });
  } catch (err) {
    console.error("Quote extraction error:", err);
    res.status(500).json({ error: err.message || "Quote extraction failed" });
  }
});

// ── Delete transcript ──
app.delete("/api/transcripts/:id", (req, res) => {
  const t = transcripts.get(req.params.id);
  if (!t) return res.status(404).json({ error: "Transcript not found" });

  // Delete audio file
  if (t.filePath && fs.existsSync(t.filePath)) {
    fs.unlinkSync(t.filePath);
  }
  transcripts.delete(req.params.id);
  res.json({ message: "Deleted" });
});

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`RhemaFlows API running on port ${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
    console.warn("⚠️  GEMINI_API_KEY not set! Add your key to backend/.env");
    console.warn("   Get one at: https://aistudio.google.com/apikey");
  }
});