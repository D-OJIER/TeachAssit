"use client";
import { useState } from "react";
import "./loader.css"; // Assuming your loader3 css is here

export default function PDFUpload({ keyData, onResult }) {
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);  // Show loader

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64PDF = reader.result.split(",")[1];

      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdf: base64PDF, keyData }),
        });

        const data = await res.json();
        setResponse(data.response || data.error);

        const parsed = parseResponse(data.response || "");
        const total = parsed.reduce((sum, item) => sum + parseInt(item.marks, 10), 0);

        onResult && onResult({ total, breakdown: parsed });
      } catch (err) {
        console.error("Error uploading:", err);
      }

      setUploading(false);  // Hide loader
    };
  };

  const parseResponse = (responseText) => {
    if (!responseText) return [];
    const pairs = responseText.match(/\d+ - \d+(\s*\([^)]*\))?/g) || [];
    return pairs.map((pair) => {
      const [question, marksPart] = pair.split(" - ");
      const marks = marksPart.match(/\d+/)[0];
      return {
        question: question,
        marks: marks,
        comment: marksPart.match(/\(([^)]+)\)/)?.[1] || "",
      };
    });
  };

  return (
    <>
      {uploading ? (
        <div className="loader4"></div>
      ) : (
        <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
      )}
    </>
  );
}
