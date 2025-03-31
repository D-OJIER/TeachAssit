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

    const parseResponse = (responseText) => {
        if (!responseText) return [];
        
        // Split by question number pattern (e.g., "1 - ", "2 - ")
        const pairs = responseText.match(/\d+ - \d+(\s*\([^)]*\))?/g) || [];
        
        return pairs.map(pair => {
            const [question, marksPart] = pair.split(' - ');
            // Extract just the numeric marks, ignoring any comments in parentheses
            const marks = marksPart.match(/\d+/)[0];
            return {
                question: question,
                marks: marks,
                comment: marksPart.match(/\(([^)]+)\)/)?.[1] || ''
            };
        });
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
            <div className="mt-4">
                {response && (
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Question No.</th>
                                <th className="border p-2">Marks Obtained</th>
                                <th className="border p-2">Max Marks</th>
                                <th className="border p-2">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parseResponse(response).map((item, index) => (
                                <tr key={index} className={item.comment ? 'bg-yellow-50' : ''}>
                                    <td className="border p-2">{item.question}</td>
                                    <td className="border p-2">{item.marks}</td>
                                    <td className="border p-2">10</td>
                                    <td className="border p-2 text-red-500">{item.comment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
