import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, scores } = req.body;

    if (!name || !scores || typeof scores !== "object") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const prompt = `
You are a teacher evaluating the performance of the student "${name}", who has received the following exam scores:
${Object.entries(scores).map(([exam, mark]) => `${exam}: ${mark}`).join("\n")}

Write teacher-style feedback for each exam (UT1, CAT1, UT2, CAT2):
- Speak directly to the student using "I noticed", "You have", "You should", etc.
- Mention what they did well and what they need to improve.
- Feedback should be about 3–4 lines per exam.

At the end, include a general summary feedback (4–5 lines) commenting on the overall performance across all exams — again, in the teacher's voice.

Format your output exactly like:
UT1: feedback text
CAT1: feedback text
UT2: feedback text
CAT2: feedback text
Overall: general feedback text
`;


    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text?.() || "No feedback generated.";

    const feedbackMap = {};
    const lines = responseText.split("\n").filter(Boolean);
    for (const line of lines) {
      const [exam, ...msg] = line.split(":");
      if (exam && msg.length > 0) {
        feedbackMap[exam.trim()] = msg.join(":").trim();
      }
    }

    res.status(200).json({ feedback: feedbackMap });
  } catch (error) {
    console.error("Gemini Feedback API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
