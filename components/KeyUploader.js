"use client";
import { useState } from "react";
import "./keyLoader.css"; // loader4 styles

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
        className="styled-input"
      />

      {loading && <div className="loader4"></div>}

      <style jsx>{`
        .styled-input {
          padding: 10px 16px;
          background-color: #493D9E;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .styled-input:hover {
          background-color: #263159;
        }

        .styled-input:disabled {
          background-color: #a8a8a8;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
