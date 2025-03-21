import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ClassStudentsPage() {
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
      console.log("🔍 Fetching students for:", className);

      const studentsQuery = query(
        collection(db, "students"),
        where("class", "==", className) // Exact match
      );

      const snapshot = await getDocs(studentsQuery);

      if (snapshot.empty) {
        console.warn("⚠️ No students found for this class.");
      }

      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      setError("Failed to fetch student data.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Class: {className}</h1>

      {loading && <p className="text-blue-500 mt-4">Loading students...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && !error && students.length > 0 ? (
        <div className="mt-4">
          {/* Student Table */}
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-3">Register No</th>
                <th className="border p-3">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center bg-gray-100 odd:bg-white">
                  <td className="border p-3">{student.registerNo}</td>
                  <td className="border p-3">{student.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              onClick={() => router.push(`/class/${encodeURIComponent(className)}/evaluation`)}
            >
              Evaluation & Grading
            </button>

            <button
              className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
              onClick={() => router.push(`/class/${encodeURIComponent(className)}/feedback`)}
            >
              Feedback Generation
            </button>
          </div>
        </div>
      ) : (
        !loading && <p className="mt-4 text-gray-600">No students found.</p>
      )}
    </div>
  );
}
