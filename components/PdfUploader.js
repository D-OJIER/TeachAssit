"use client";
import { useState } from "react";

export default function PDFUpload() {
    const [response, setResponse] = useState("");

    const handlePDFUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64PDF = reader.result.split(",")[1]; // Extract Base64 data

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdf: base64PDF }),
            });

            const data = await res.json();
            setResponse(data.response || data.error);
        };
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
            <p>Response: {response}</p>
        </div>
    );
}
