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

        const normalizedMarks = rawMarks.map((q) => ({
          ...q,
          feedback: q.feedback || q.comment || "",
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
        [`${field}_breakdown`]: marks,
        [field]: newTotal,
      });
      setTotal(newTotal);
      alert("Marks updated successfully!");
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/invenos.png" alt="Logo" className="nav-logo" />
          <h1 className="nav-title">Sens<span style={{ color: "red" }}>ai</span></h1>
        </div>
        <div className="nav-links">
          <button onClick={() => router.push("/teacher-dashboard")}>Schedule</button>
          <button onClick={() => router.push("/history")}>About us</button>
          <button onClick={() => router.push("/settings")}>Settings</button>
          <button className="logout-btn">Logout</button>
        </div>
      </nav>
      <div className="content-box">
        <h1>Edit Marks for {field}</h1>
        <h2>Total: {total}</h2>

        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Marks</th>
              <th>Feedback</th>
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
                  <td>
                    <span>{q.feedback || ""}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No marks available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={updateMarks}>Save Changes</button>
      </div>

      <style jsx>{`
      :global(body, html) {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
         .navbar {
          width: 100%;
          height: 70px;
          background-color: #493D9E;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          position: fixed;
          border: 5px solid black;
          top: 0;
          left: 0;
          z-index: 10;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .nav-left {
          display: flex;
          align-items: center;
        }

        .nav-logo {
          height: 40px;
          width: 40px;
          margin-right: 10px;
        }

        .nav-title {
          font-size: 26px;
          font-weight: bold;
          color: black;
          margin-top:8px;
          letter-spacing: 1px;
        }

        .nav-links button {
          margin-left: 15px;
          background: transparent;
          border: none;
          color: #fffbeb;
          font-size: 16px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .nav-links button:hover {
          color: #f9d923;
        }

        .logout-btn {
          border: 1px solid #fffbeb;
          padding: 6px 12px;
          border-radius: 6px;
          margin-right: 35px;
        }

        .page-container {
          min-height: 100vh;
          background-color: #2AB3B1;
          display: flex;
          margin-top:70px;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          box-sizing: border-box;
        }

        .content-box {
          background-color:#251749;
          color: white;
          padding: 2rem;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        h1 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        h2 {
          margin-bottom: 1.5rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          color: black;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 0.75rem;
          text-align: left;
        }

        input[type="number"] {
          width: 60px;
          padding: 0.3rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          background-color: #495579;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color:rgb(22, 25, 35);
        }
      `}</style>
    </div>
  );
}
