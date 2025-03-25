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
    <div className="container">
      <div className="header">
        <h1>Grading & Evaluation - {className}</h1>
        <select className="dropdown" value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
          <option value="UT1">UT1</option>
          <option value="CAT1">CAT1</option>
          <option value="UT2">UT2</option>
          <option value="CAT2">CAT2</option>
        </select>
      </div>
      {loading && <p className="loading-text">Loading students...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && students.length > 0 ? (
        <table className="students-table">
          <thead>
            <tr>
              <th>Register No</th>
              <th>Student Name</th>
              <th>Upload File</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.registerNo}</td>
                <td>{student.name}</td>
                <td>
                  <input type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e, student.id)} />
                  {student.selectedFile && (
                    <button onClick={() => extractTextFromPDF(student.id)} className="extract-btn">
                      Extract Text
                    </button>
                  )}
                </td>
                {student.showMarks && (
                  <td>
                    <input
                      type="text"
                      value={student.mark || ""}
                      onChange={(e) =>
                        setStudents((prev) =>
                          prev.map((s) => (s.id === student.id ? { ...s, mark: e.target.value } : s))
                        )
                      }
                      className="input-field"
                    />
                    <button onClick={() => updateDatabase(student.id)} className="save-btn">
                      Save
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-data-text">No students found.</p>
      )}

<style jsx>{`
  .container {
    padding: 20px;
    background-color: #a7a2c3;
    text-align: center;
    min-height: 100vh;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  h1 {
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
  }

  .loading-text {
    color: blue;
    font-size: 18px;
  }

  .error-text {
    color: red;
    font-size: 18px;
  }

  .students-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 2px 2px 10px rgba(255, 255, 255, 0.1);
  }

  .students-table th {
    background-color: #f5f5f5;
    color: black;
    padding: 12px;
    font-size: 20px;
    border: 1px solid #ccc;
  }

  .students-table td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  .input-field {
    padding: 8px;
    width: 80%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .extract-btn {
    background-color: #a7a2c3;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
  }

  .save-btn {
    background-color: #a7a2c3;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
  }
    .dropdown {
    margin-left: auto;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`}</style>
    </div>
  );
}
