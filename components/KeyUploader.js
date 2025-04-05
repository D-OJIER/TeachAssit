"use client";
import { useState } from "react";

export default function KeyUpload({ onExtract }) {
  const [response, setResponse] = useState("");

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64PDF = reader.result.split(",")[1];

      const res = await fetch("/api/keyAnalyser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf: base64PDF }),
      });

      const data = await res.json();
      setResponse(data.response || data.error);
      onExtract && onExtract(data.response); // Send extracted key back to parent
    };
  };

  return (
    <>
      <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
    </>
  );
}
