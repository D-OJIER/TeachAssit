import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

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
        where("class", "==", className)
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

  const handleInputChange = (id, field, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const updateDatabase = async () => {
    try {
      await Promise.all(
        students.map(async (student) => {
          const studentRef = doc(db, "students", student.id);
          await updateDoc(studentRef, {
            UT1: student.UT1 || "",
            CAT1: student.CAT1 || "",
            UT2: student.UT2 || "", // New Column
            CAT2: student.CAT2 || "" // New Column
          });
        })
      );
      console.log("✅ Data updated successfully");
    } catch (error) {
      console.error("❌ Error updating data:", error);
    }
  };

  return (
    <div className="page-container">
      
      <div className="container">
        <h1 className="title">Class: {className}</h1>

        {loading && <p className="loading-text">Loading students...</p>}
        {error && <p className="error-text">{error}</p>}

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

        {!loading && !error && students.length > 0 ? (
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Register No</th>
                  <th>Student Name</th>
                  <th>UT1</th>
                  <th>CAT1</th>
                  <th>UT2</th> {/* New Column */}
                  <th>CAT2</th> {/* New Column */}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "row-light" : "row-dark"}>
                    <td>{student.registerNo}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="text"
                        value={student.UT1 || ""}
                        onChange={(e) => handleInputChange(student.id, "UT1", e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.CAT1 || ""}
                        onChange={(e) => handleInputChange(student.id, "CAT1", e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.UT2 || ""}
                        onChange={(e) => handleInputChange(student.id, "UT2", e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.CAT2 || ""}
                        onChange={(e) => handleInputChange(student.id, "CAT2", e.target.value)}
                        className="input-field"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="no-data-text">No students found.</p>
        )}

        <div className="button-container">
          <button
            className="action-button evaluation"
            onClick={async () => {
              await updateDatabase();
              router.push(`/class/${encodeURIComponent(className)}/evaluation`);
            }}
          >
            Evaluation & Grading
          </button>
          <button
            className="action-button feedback"
            onClick={async () => {
              await updateDatabase();
              router.push(`/class/${encodeURIComponent(className)}/feedbackHome`);
            }}
          >
            Feedback Generation
          </button>
        </div>
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
          border:5px solid black;
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
          background-color: #2AB3B1; /* Full Page Background */
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top:50px;
        }

        .container {
          padding: 20px;
          text-align: center;
          background-color: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          border:5px solid black;
          margin-top:70px;
        }

        .title {
          font-size: 32px;
          font-weight: 900;
          color: #333;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .loading-text {
          color: blue;
          font-size: 18px;
        }

        .error-text {
          color: red;
          font-size: 18px;
        }

        .no-data-text {
          color: #666;
          font-size: 18px;
        }

        .table-container {
          overflow-x: auto;
          margin-top: 20px;
        }

        .students-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ccc;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .students-table th {
          background-color:rgb(25, 50, 143);
          color: white;
          padding: 12px;
          font-size: 18px;
          font-weight: bold;
          border: 1px solid #ccc;
        }

        .students-table td {
          padding: 10px;
          border: 1px solid #ccc;
          text-align: center;
        }

        .row-light {
          background-color:rgb(255, 255, 255);
        }

        .row-dark {
          background-color: #ffffff;
        }

        .students-table tr:hover {
          background-color: #e0e0e0;
          transition: background 0.3s;
        }

        .input-field {
          width: 90%;
          padding: 8px;
          border: 1px solid #999;
          border-radius: 5px;
          font-size: 14px;
        }

        .button-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .action-button {
          padding: 12px 20px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .evaluation {
          background-color: rgb(25, 50, 143);
          color: white;
        }

        .evaluation:hover {
          background-color: #5a32a3;
        }

        .feedback {
          background-color: rgb(25, 50, 143);
          color: white;
        }

        .feedback:hover {
          background-color: #5a32a3;
        }
      `}</style>
    </div>
  );
}
