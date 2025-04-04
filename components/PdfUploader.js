"use client";
import { useState } from "react";

export default function PDFUpload({ onResult }) {
  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64PDF = reader.result.split(",")[1];

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf: base64PDF }),
      });

      const data = await res.json();
      const parsed = parseResponse(data.response || "");
      const total = parsed.reduce((sum, item) => sum + parseInt(item.marks, 10), 0);

      onResult({ total, breakdown: parsed });
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

  return <input type="file" accept="application/pdf" onChange={handlePDFUpload} />;
}