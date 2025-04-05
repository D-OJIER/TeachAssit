import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function StudentEvaluationPage() {
  const router = useRouter();
  const { className, studentId, field } = router.query;

  const [marks, setMarks] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (studentId && field) fetchStudentMarks();
  }, [studentId, field]);

  const fetchStudentMarks = async () => {
    try {
      const studentRef = doc(db, "students", studentId);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
  
        const rawMarks = data[`${field}_breakdown`] || [];
  
        // Normalize to ensure every item has `feedback`
        const normalizedMarks = rawMarks.map((q) => ({
          ...q,
          feedback: q.feedback || q.comment || "", // fallback to comment if feedback is missing
        }));
  
        setMarks(normalizedMarks);
        setTotal(data[field] || 0);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };
  

  const updateMarks = async () => {
    try {
      const newTotal = marks.reduce((acc, q) => acc + Number(q.marks), 0);
      const studentRef = doc(db, "students", studentId);
      await updateDoc(studentRef, {
        [`${field}_breakdown`]: marks,  // Store breakdown with feedback
        [field]: newTotal,
      });
      setTotal(newTotal);
      alert("Marks updated successfully!");
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-xl font-bold mb-2">Edit Marks for {field}</h1>
      <h2 className="mb-4">Total: {total}</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Question</th>
            <th className="border p-2">Marks</th>
            <th className="border p-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
  {marks.length > 0 ? (
    marks.map((q, index) => (
      <tr key={index}>
        <td className="border p-2">{q.question}</td>
        <td className="border p-2">
          <input
            type="number"
            className="w-16 border px-1"
            value={q.marks}
            onChange={(e) => {
              const newMarks = [...marks];
              newMarks[index].marks = e.target.value;
              setMarks(newMarks);
            }}
          />
        </td>
        <td className="border p-2">
            <span className="block px-2">{q.feedback || ""}</span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="p-2 text-center">No marks available</td>
    </tr>
  )}
</tbody>

      </table>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={updateMarks}
      >
        Save Changes
      </button>
    </div>
  );
}
