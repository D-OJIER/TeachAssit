import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function MarksBreakdownPage() {
  const router = useRouter();
  const { registerNo, exam } = router.query;

  const [studentName, setStudentName] = useState("");
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !registerNo || !exam) return;
    fetchBreakdown();
  }, [router.isReady, registerNo, exam]);

  const fetchBreakdown = async () => {
    try {
      const q = query(
        collection(db, "students"),
        where("registerNo", "==", registerNo)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const studentData = snapshot.docs[0].data();
        setStudentName(studentData.name || "");

        const field = `${exam}_breakdown`;
        const data = studentData[field];

        if (Array.isArray(data)) {
          setBreakdown(data);
        } else if (typeof data === "object") {
          setBreakdown(Object.entries(data).map(([question, details]) => ({
            question,
            ...details,
          })));
        } else {
          // fallback if it's a string
          setBreakdown([{ question: "Info", marks: data || "No breakdown available" }]);
        }
      }
    } catch (err) {
      console.error("Error fetching breakdown:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{exam} Breakdown</h1>
      {studentName && (
        <p className="mb-4 text-gray-700">Student: <strong>{studentName}</strong></p>
      )}

      {loading ? (
        <p>Loading breakdown...</p>
      ) : breakdown.length === 0 ? (
        <p>No breakdown available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left p-3">Question</th>
                <th className="text-left p-3">Marks</th>
                <th className="text-left p-3">Comment</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{item.question}</td>
                  <td className="p-3">{item.marks}</td>
                  <td className="p-3">{item.comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
