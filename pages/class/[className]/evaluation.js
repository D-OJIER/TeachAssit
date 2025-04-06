import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import PDFUpload from "@/components/PdfUploader";
import KeyUpload from "@/components/KeyUploader";
export default function GradingEvaluationPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState("UT1");
  const router = useRouter();
  const { className } = router.query;
  const [keyData, setKeyData] = useState(null);

  const defaultKey = 'Refer to net and chack for atmost accuracy'; // fallback key when no upload

  useEffect(() => {
    if (router.isReady && className) {
      fetchStudents(className);
    }
  }, [router.isReady, className]);

  const fetchStudents = async (className) => {
    try {
      const q = query(collection(db, "students"), where("class", "==", className));
      const snapshot = await getDocs(q);
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), mark: "", showMarks: false })));
    } catch (err) {
      setError("Failed to fetch students");
    }
    setLoading(false);
  };

  const updateDatabase = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      [selectedField]: student.mark,
      [`${selectedField}_breakdown`]: student.breakdown,
    });
    alert("Saved to database");
  };

  return (
    <div className="container p-4">
      <h1 className="text-xl font-bold">Evaluation - {className}</h1>

      <KeyUpload onExtract={(data) => { setKeyData(data); console.log("Key Data:", data); }} />

      <div className="mt-2 text-sm">
        {keyData ? (
          <span className="text-green-600">Using <b>Uploaded Key</b></span>
        ) : (
          <span className="text-gray-500">Using <b>Default Key</b></span>
        )}
      </div>

      <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
        <option value="UT1">UT1</option>
        <option value="CAT1">CAT1</option>
        <option value="UT2">UT2</option>
        <option value="CAT2">CAT2</option>
      </select>

      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <table className="mt-4 w-full border">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Upload</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.registerNo}</td>
                <td>{student.name}</td>
                <td>
                  <PDFUpload keyData={keyData || defaultKey} onResult={({ total, breakdown }) => {
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id ? { ...s, mark: total, breakdown, showMarks: true } : s
                      )
                    );
                  }} />
                </td>
                <td>
                  {student.showMarks && (
                    <div>
                      <p>{student.mark}</p>
                      <button onClick={() => updateDatabase(student.id)}>Save</button>
                      <button onClick={() => router.push(`/class/${className}/evaluation/${student.id}?field=${selectedField}`)}>View/Edit</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
