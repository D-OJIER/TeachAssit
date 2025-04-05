import { useState } from "react";
import PDFUpload from "@/components/PdfUploader";
import KeyUpload from "@/components/KeyUploader";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [keyData, setKeyData] = useState(null); // Store extracted key here

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>

      <button
        onClick={() => router.push("/login?role=teacher")}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Login as Teacher
      </button>

      <button
        onClick={() => router.push("/login?role=student")}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Login as Student
      </button>

      <KeyUpload onExtract={(data) => { setKeyData(data); console.log("Key Data:", data); }} /> {/* Pass setter to KeyUploader */}
      <PDFUpload keyData={keyData} /> {/* Pass key data to PdfUploader */}
    </div>
  );
}
