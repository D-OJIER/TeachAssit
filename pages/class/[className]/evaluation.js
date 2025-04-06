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

  const defaultKey = "Refer to net";

  useEffect(() => {
    if (router.isReady && className) {
      fetchStudents(className);
    }
  }, [router.isReady, className]);

  const fetchStudents = async (className) => {
    try {
      const q = query(collection(db, "students"), where("class", "==", className));
      const snapshot = await getDocs(q);
      setStudents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          mark: "",
          showMarks: false,
        }))
      );
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-800">
        Evaluation - {className}
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 bg-indigo-50 rounded-xl shadow">
        <div>
          <KeyUpload
            onExtract={(data) => {
              setKeyData(data);
              console.log("Key Data:", data);
            }}
          />
        </div>
        <div className="text-sm text-gray-700">
          <p><span className="font-medium">Upload Answer Key:</span> Upload the model answer sheet here. The uploaded key will be used for automatic evaluation of all student answer sheets.</p>
          <p className="mt-1">
            {keyData ? (
              <span className="text-green-600">✅ Using <b>Uploaded Key</b></span>
            ) : (
              <span className="text-gray-500">⚠️ Using <b>Default Key</b> — "Refer to net"</span>
            )}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Select Field:</label>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="p-2 border rounded shadow-sm"
        >
          <option value="UT1">UT1</option>
          <option value="CAT1">CAT1</option>
          <option value="UT2">UT2</option>
          <option value="CAT2">CAT2</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Reg No</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Upload</th>
                <th className="px-4 py-2 border">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center border-t">
                  <td className="px-4 py-2 border">{student.registerNo}</td>
                  <td className="px-4 py-2 border">{student.name}</td>
                  <td className="px-4 py-2 border">
                    <PDFUpload
                      keyData={keyData || defaultKey}
                      onResult={({ total, breakdown }) => {
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.id === student.id
                              ? { ...s, mark: total, breakdown, showMarks: true }
                              : s
                          )
                        );
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    {student.showMarks && (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-700 font-medium">{student.mark}</span>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            onClick={() => updateDatabase(student.id)}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-800"
                            onClick={() =>
                              router.push(
                                `/class/${className}/evaluation/${student.id}?field=${selectedField}`
                              )
                            }
                          >
                            View/Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
