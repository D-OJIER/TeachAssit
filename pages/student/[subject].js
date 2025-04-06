import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function SubjectPage() {
  const router = useRouter();
  const { subject, registerNo } = router.query;

  const [studentName, setStudentName] = useState("");

  // Fetch student name
  useEffect(() => {
    const fetchStudentName = async () => {
      if (!router.isReady || !registerNo) return;

      try {
        const studentRef = doc(db, "students", registerNo);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          setStudentName(studentData.name || "");
        }
      } catch (err) {
        console.error("Failed to fetch student name:", err);
      }
    };

    fetchStudentName();
  }, [router.isReady, registerNo]);

  const handleViewFeedback = () => {
    router.push({
      pathname: `/student/${subject}/feedback`,
      query: { registerNo },
    });
  };

  const handleViewMarks = () => {
    router.push({
      pathname: `/student/${subject}/marks`,
      query: { registerNo },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
  Subject: Blockchain
</h1>


      {studentName && (
        <h2 className="text-lg font-medium mb-6 text-gray-700">
          Student: {studentName}
        </h2>
      )}

      <div className="space-x-4">
        <button
          onClick={handleViewMarks}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Marks
        </button>
        <button
          onClick={handleViewFeedback}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Feedback
        </button>
      </div>
    </div>
  );
}
