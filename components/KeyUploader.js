"use client";
import { useState } from "react";
import "./keyLoader.css"; // loader3 styles

export default function KeyUpload({ onExtract }) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

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
      onExtract && onExtract(data.response);

      setLoading(false);
    };
  };

  return (
    <>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handlePDFUpload}
        disabled={loading}
      />

      {/* your animated loader */}
      {loading && (
        <div className="loader4"></div>
      )}
    </>
  );
}
