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
          setBreakdown([{ question: "Info", marks: data || "No breakdown available" }]);
        }
      }
    } catch (err) {
      console.error("Error fetching breakdown:", err);
    }

    setLoading(false);
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
        <h1>{exam} Breakdown</h1>
        {studentName && (
          <h2>Student: {studentName}</h2>
        )}

        {loading ? (
          <p>Loading breakdown...</p>
        ) : breakdown.length === 0 ? (
          <p>No breakdown available.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Marks</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.question}</td>
                    <td>{item.marks}</td>
                    <td>{item.comment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');

  * {
    font-family: 'Roboto Condensed', sans-serif;
  }
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
          top: 0;
          left: 0;
          z-index: 10;
          border: 5px solid black;
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
          margin-top: 8px;
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
          color: #251749;
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
          justify-content: center;
          align-items: center;
          padding: 2rem;
          margin-top: 70px;
        }

        .content-box {
          background-color: #251749;
          color: white;
          padding: 2rem;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border-radius:2%;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        h2 {
          margin-bottom: 1.5rem;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-top: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          color: black;
          border-radius: 10px;
          overflow: hidden;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 0.75rem;
          text-align: left;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
