import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function GradingEvaluationPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState("UT1");
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
          mark: "",
          showMarks: false
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
      prev.map((s) => (s.id === studentId ? { ...s, selectedFile: file, extractedText: "", showMarks: true } : s))
    );
  };

  const extractTextFromPDF = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(student.selectedFile);

    reader.onloadend = async function () {
      let base64Data = reader.result.split(",")[1];
      console.log("Base64 Data:", base64Data.slice(0, 100));
  
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
          
          setStudents((prev) =>
            prev.map((s) =>
              s.id === studentId ? { ...s, extractedText: data.text, mark: data.text, showMarks: true } : s
            )
          );
      } catch (error) {
          console.error("Error extracting text:", error);
      }
    };
  };

  const updateDatabase = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    try {
      const studentRef = doc(db, "students", student.id);
      await updateDoc(studentRef, {
        [selectedField]: student.mark || ""
      });
      console.log("✅ Data updated successfully");
    } catch (error) {
      console.error("❌ Error updating data:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grading & Evaluation - {className}</h1>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="UT1">UT1</option>
          <option value="CAT1">CAT1</option>
        </select>
      </div>
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length > 0 ? (
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Register No</th>
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Upload File</th>
              <th className="border p-2" style={{ display: 'none' }}>Marks</th>
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
                </td>
                {student.showMarks && (
                  <td className="border p-2">
                    <input
                      type="text"
                      value={student.mark || ""}
                      onChange={(e) => setStudents((prev) =>
                        prev.map((s) => (s.id === student.id ? { ...s, mark: e.target.value } : s))
                      )}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={() => updateDatabase(student.id)}
                      className="bg-green-500 text-white p-2 rounded mt-2"
                    >
                      Save
                    </button>
                  </td>
                )}
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