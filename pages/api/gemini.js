import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { pdf } = req.body; // No need to use req.json() in Next.js API routes

        if (!pdf) {
            return res.status(400).json({ error: "PDF data is required" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

        const result = await model.generateContent([
            {
                inlineData: {
                    data: pdf, // Base64 encoded PDF
                    mimeType: "application/pdf",
                },
            },
            "Give only the content in text",
        ]);

        const responseText = result?.response?.text?.() || "No response received";

        res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: error.message });
    }
}
