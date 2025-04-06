"use client";
import { useState } from "react";

export default function PDFUpload({ keyData, onResult }) {
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(""); // ✅ new state

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name); // ✅ save name
    setUploading(true);

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

      setUploading(false);
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
        <>
          <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
          {fileName && <p className="file-name">Uploaded: {fileName}</p>} {/* ✅ filename */}
        </>
      )}

      <style jsx>{`
        .file-name {
          font-size: 14px;
          color: #333;
          margin-top: 6px;
          font-weight: 500;
        }

        .loader4 {
          position: relative;
          width: 150px;
          height: 20px;
          top: calc(50% - 10px);
          left: calc(50% - 75px);
          border-radius: 5px;
          overflow: hidden;
          background-color: rgba(4, 42, 255, 0.703);
        }

        .loader4:before {
          content: "";
          position: absolute;
          background-color: rgba(13, 57, 234, 0.8);
          top: 0;
          left: 0;
          height: 20px;
          width: 0;
          z-index: 0;
          opacity: 1;
          transform-origin: 100% 0%;
          animation: loader4 2s ease-in-out infinite;
        }

        .loader4:after {
          content: "LOADING ...";
          color: #fff;
          font-family: Lato, "Helvetica Neue", sans-serif;
          font-weight: 300;
          font-size: 14px;
          position: absolute;
          width: 100%;
          height: 20px;
          line-height: 20px;
          left: 0;
          top: 0;
          text-align: center;
          letter-spacing: 1px;
        }

        @keyframes loader4 {
          0% {
            width: 0px;
          }
          70% {
            width: 100%;
            opacity: 1;
          }
          90% {
            opacity: 0;
            width: 100%;
          }
          100% {
            opacity: 0;
            width: 0px;
          }
        }
      `}</style>
    </>
  );
}
