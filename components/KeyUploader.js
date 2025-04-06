"use client";
import { useState } from "react";

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

        .loader4 {
          position: relative;
          width: 150px;
          height: 20px;
          top: 45%;
          top: -webkit-calc(80% - 10px);
          top: calc(50% - 10px);
          left: 25%;
          left: -webkit-calc(50% - 75px);
          left: calc(50% - 75px);

          background-color: rgba(32, 89, 223, 0.574); /* subtle background for both modes */
          border-radius: 5px;
          overflow: hidden;
        }

        .loader4:before {
          content: "";
          position: absolute;
          background-color: rgba(13, 57, 234, 0.8); /* light loader bar */
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
          color: #fff;  /* white text works well over dark bg */
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
          0% { width: 0px; }
          70% { width: 100%; opacity: 1; }
          90% { opacity: 0; width: 100%; }
          100% { opacity: 0; width: 0px; }
        }

      `}</style>
    </>
  );
}
