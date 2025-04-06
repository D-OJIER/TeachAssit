import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function FeedbackPage() {
  const router = useRouter();
  const { registerNo } = router.query; // using registerNo

  const [studentName, setStudentName] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !registerNo) return;
    fetchStudentFeedback();
  }, [router.isReady, registerNo]);

  const fetchStudentFeedback = async () => {
    try {
      const q = query(
        collection(db, "students"),
        where("registerNo", "==", registerNo)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();

        setStudentName(docData.name);

        const scores = {
          UT1: parseInt(docData.UT1 || "0"),
          CAT1: parseInt(docData.CAT1 || "0"),
          UT2: parseInt(docData.UT2 || "0"),
          CAT2: parseInt(docData.CAT2 || "0"),
        };

        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: docData.name, scores }),
        });

        const json = await response.json();
        const feedbackArray = Object.entries(json.feedback).map(
          ([exam, feedback]) => ({
            exam,
            feedback,
          })
        );

        setFeedbacks(feedbackArray);
      } else {
        console.warn("No student found with given registerNo.");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Feedback Report</h1>
      {studentName && (
        <h2 className="text-lg text-gray-700 mb-4">
          Student: <span className="font-semibold">{studentName}</span>
        </h2>
      )}
      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(({ exam, feedback }, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded shadow">
              <h4 className="font-semibold">{exam}</h4>
              <p>{feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
