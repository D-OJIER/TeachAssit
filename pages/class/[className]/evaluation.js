import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import PDFUpload from "@/components/PdfUploader";
import KeyUpload from "@/components/KeyUploader";

export default function GradingEvaluationPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState("UT1");
  const router = useRouter();
  const { className } = router.query;
  const [keyData, setKeyData] = useState(null);

  const defaultKey = "Refer to net";

  useEffect(() => {
    if (router.isReady && className) {
      fetchStudents(className);
    }
  }, [router.isReady, className]);

  const fetchStudents = async (className) => {
    try {
      const q = query(collection(db, "students"), where("class", "==", className));
      const snapshot = await getDocs(q);
      setStudents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          mark: "",
          showMarks: false,
        }))
      );
    } catch (err) {
      setError("Failed to fetch students");
    }
    setLoading(false);
  };

  const updateDatabase = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      [selectedField]: student.mark,
      [`${selectedField}_breakdown`]: student.breakdown,
    });
    alert("Saved to database");
  };

  return (
    <div className="container">
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

      <h1 className="heading">
        Evaluation - <span className="className">{className}</span>
      </h1>

      <div className="uploadContainer">
        <KeyUpload
          onExtract={(data) => {
            setKeyData(data);
            console.log("Key Data:", data);
          }}
        />
        <div className="keyInfo">
          <p className="label">Upload Answer Key:</p>
          <p className="desc">The model answer sheet will be used for evaluating student submissions.</p>
          <p className="status">
            {keyData ? (
              <span className="active">✅ Uploaded Key Active</span>
            ) : (
              <span className="default">⚠️ Default Key Active: "Referring Internet"</span>
            )}
          </p>
        </div>
      </div>

      <div className="fieldSelector">
        <label>Select Evaluation Field:</label>
        <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
          <option value="UT1">UT1</option>
          <option value="CAT1">CAT1</option>
          <option value="UT2">UT2</option>
          <option value="CAT2">CAT2</option>
        </select>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Name</th>
                <th>Upload</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.registerNo}</td>
                  <td>{student.name}</td>
                  <td>
                    <PDFUpload
                      keyData={keyData || defaultKey}
                      onResult={({ total, breakdown }) => {
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.id === student.id
                              ? { ...s, mark: total, breakdown, showMarks: true }
                              : s
                          )
                        );
                      }}
                    />
                  </td>
                  <td>
                    {student.showMarks && (
                      <div className="marksBlock">
                        <span className="marks">{student.mark}</span>
                        <div className="actions">
                          <button className="saveBtn" onClick={() => updateDatabase(student.id)}>Save</button>
                          <button
                            className="viewBtn"
                            onClick={() =>
                              router.push(`/class/${className}/evaluation/${student.id}?field=${selectedField}`)
                            }
                          >
                            View/Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`

      :global(body, html) {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
          
        .container {
          min-height: 100vh;
          padding: 2rem;
          background: #2AB3B1;
          color: #263159;
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

        .heading {
          font-size: 2.2rem;
          font-weight: bold;
          margin-top:4rem;
          margin-bottom: 1.5rem;
        }
        .className {
          color: aliceblue;
        }
        .uploadContainer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: #e5e7fb;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .keyInfo {
          font-size: 0.95rem;
        }
        .label {
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        .desc {
          font-size: 0.85rem;
        }
        .status {
          margin-top: 0.6rem;
          font-weight: 600;
        }
        .active {
          color: green;
        }
        .default {
          color: #b45309;
        }
        .fieldSelector {
          margin-bottom: 1.5rem;
        }
        .fieldSelector label {
          font-weight: 600;
          margin-right: 0.5rem;
        }
        .fieldSelector select {
          padding: 0.3rem 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          background:#e5e7fb;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        th {
          background: #493D9E;
          color: white;
          padding: 0.75rem;
          border: 2px solid #ddd;
          font-size: 0.9rem;
        }
        td {
          padding: 0.75rem;
          border: 1px solid #eee;
          text-align: center;
        }
        tr:hover {
          background: #f6f6ff;
        }
        .marksBlock {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .marks {
          font-weight: bold;
          font-size: 1.2rem;
          color: green;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .saveBtn,
        .viewBtn {
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          border: none;
          color: white;
          cursor: pointer;
        }
        .saveBtn {
          background: #495579;
        }
        .saveBtn:hover {
          background: #263159;
        }
        .viewBtn {
          background: #251749;
        }
        .viewBtn:hover {
          background: #3a2667;
        }
        .error {
          color: red;
        }
        @media (min-width: 640px) {
          .uploadContainer {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
