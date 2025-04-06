import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function MarksPage() {
  const router = useRouter();
  const { registerNo, subject } = router.query;

  const [studentName, setStudentName] = useState("");
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !registerNo) return;
    fetchStudentMarks();
  }, [router.isReady, registerNo]);

  const fetchStudentMarks = async () => {
    try {
      const q = query(
        collection(db, "students"),
        where("registerNo", "==", registerNo)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setStudentName(docData.name);

        setMarks({
          UT1: docData.UT1 || "N/A",
          CAT1: docData.CAT1 || "N/A",
          UT2: docData.UT2 || "N/A",
          CAT2: docData.CAT2 || "N/A",
        });
      } else {
        console.warn("No student found with given registerNo.");
      }
    } catch (err) {
      console.error("Error fetching marks:", err);
    }

    setLoading(false);
  };

  const handleViewBreakdown = (exam) => {
    router.push({
      pathname: `/student/${subject}/marks-breakdown`,
      query: { registerNo, exam },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Marks Report</h1>

      {studentName && (
        <h2 className="text-lg text-gray-700 mb-4">
          Student: <span className="font-semibold">{studentName}</span>
        </h2>
      )}

      {loading ? (
        <p>Loading marks...</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(marks).map(([exam, mark]) => (
            <li key={exam} className="bg-gray-100 p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{exam}</h4>
                  <p>Marks Obtained: {mark}</p>
                </div>
                <button
                  onClick={() => handleViewBreakdown(exam)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Breakdown
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
