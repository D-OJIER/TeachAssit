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
    if (studentId) fetchStudentMarks();
  }, [studentId]);

  const fetchStudentMarks = async () => {
    try {
      const studentRef = doc(db, "students", studentId);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setMarks(data[`${field}_breakdown`] || []);  // ✅ Fetch question-wise breakdown
        setTotal(data[field] || 0);  // ✅ Fetch total marks
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
        [`${field}_marks`]: marks,
        [field]: newTotal,
      });
      setTotal(newTotal);
      alert("Marks updated successfully!");
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Marks for {field}</h1>
      <h2>Total: {total}</h2>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
        {marks.length > 0 ? (
          marks.map((q, index) => (
            <tr key={index}>
              <td>{q.question}</td>
              <td>
                <input
                  type="number"
                  value={q.marks}
                  onChange={(e) => {
                    const newMarks = [...marks];
                    newMarks[index].marks = e.target.value;
                    setMarks(newMarks);
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">No marks available</td>
          </tr>
        )}
      </tbody>

      </table>
      <button onClick={updateMarks}>Save Changes</button>
    </div>
  );
}
