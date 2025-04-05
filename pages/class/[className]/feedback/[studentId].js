import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function StudentFeedbackPage() {
  const router = useRouter();
  const { className, studentId } = router.query;

  const [feedbacks, setFeedbacks] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      loadStudentData();
    }
  }, [router.isReady]);

  const loadStudentData = async () => {
    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setStudentName(data.name);

      const scores = {
        UT1: parseInt(data.UT1 || "0"),
        CAT1: parseInt(data.CAT1 || "0"),
        UT2: parseInt(data.UT2 || "0"),
        CAT2: parseInt(data.CAT2 || "0"),
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, scores }),
      });

      const json = await res.json();
      const feedbacksArray = Object.entries(json.feedback).map(([exam, feedback]) => ({
        exam,
        feedback,
      }));

      setFeedbacks(feedbacksArray);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Feedback Report</h1>
      {studentName && (
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Student: <span className="font-semibold">{studentName}</span>
        </h2>
      )}

      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(({ exam, feedback }, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded shadow">
              <h2 className="font-semibold">{exam}</h2>
              <p>{feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
