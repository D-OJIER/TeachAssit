import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { pdf, keyData } = req.body;

    if (!pdf || !keyData) {
      return res.status(400).json({ error: "PDF data and keyData are required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: pdf,
          mimeType: "application/pdf",
        },
      },
      `Here is the answer key for grading: ${keyData}.
Compare the student's answers with this key. Grade each question out of 10 based on accuracy, relevance, and content.
Return output ONLY in format: Q - M 
Example: 1 - 7, 2 - 8, 3 - 10`
    ]);

    const responseText = result?.response?.text?.() || "No response received";

    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
