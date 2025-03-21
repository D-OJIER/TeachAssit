import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function GradingEvaluationPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { className } = router.query;

  useEffect(() => {
    if (router.isReady && className) {
      fetchStudents(className);
    }
  }, [router.isReady, className]);

  const fetchStudents = async (className) => {
    setLoading(true);
    setError(null);
    try {
      const studentsQuery = query(collection(db, "students"), where("class", "==", className));
      const snapshot = await getDocs(studentsQuery);
      setStudents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          selectedFile: null,
          extractedText: "",
        }))
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch student data.");
    }
    setLoading(false);
  };

  const handleFileSelect = (event, studentId) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, selectedFile: file, extractedText: "" } : s))
    );
  };

  const extractTextFromPDF = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(student.selectedFile);

    reader.onloadend = async function () {
      let base64Data = reader.result.split(",")[1];  // Extract base64 content
      console.log("Base64 Data:", base64Data.slice(0, 100)); // Log first 100 chars
  
      try {
          const response = await fetch("/api/extract-text", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ base64: base64Data }),
          });
  
          if (!response.ok) {
              throw new Error("Failed to extract text");
          }
  
          const data = await response.json();
          console.log("Extracted Text:", data.text);
      } catch (error) {
          console.error("Error extracting text:", error);
      }
  };
  
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Grading & Evaluation - {className}</h1>
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length > 0 ? (
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Register No</th>
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Upload File</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border p-2">{student.registerNo}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileSelect(e, student.id)}
                  />
                  {student.selectedFile && (
                    <button
                      onClick={() => extractTextFromPDF(student.id)}
                      className="bg-blue-500 text-white p-2 rounded mt-2"
                    >
                      Extract Text
                    </button>
                  )}
                  {student.extractedText && (
                    <p className="mt-2 p-2 bg-gray-100 border">{student.extractedText}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="mt-4">No students found.</p>
      )}
    </div>
  );
}
