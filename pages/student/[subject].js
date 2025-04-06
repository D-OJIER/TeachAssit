import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function SubjectPage() {
  const router = useRouter();
  const { subject, registerNo } = router.query;

  const [studentName, setStudentName] = useState("");

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
    <div className="subject-container">
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/invenos.png" alt="Logo" className="nav-logo" />
          <h1 className="nav-title">Sens<span style={{ color: "red" }}>ai</span></h1>
        </div>
        <div className="nav-links">
          <button onClick={() => router.push("/student-dashboard")}>Dashboard</button>
          <button onClick={() => router.push("/about")}>About</button>
          <button onClick={() => router.push("/settings")}>Settings</button>
        </div>
      </nav>

      <div className="content">
        <h2 className="page-title">Subject: {subject}</h2>
        {studentName && (
          <h3 className="student-name">Student: {studentName}</h3>
        )}
        <div className="button-group">
          <button onClick={handleViewMarks} className="nav-button green">View Marks</button>
          <button onClick={handleViewFeedback} className="nav-button blue">View Feedback</button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');

        * {
          font-family: 'Roboto Condensed', sans-serif;
        }

        :global(html, body) {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #2AB3B1;
          color: white;
        }

        .subject-container {
          min-height: 100vh;
          padding-top: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .navbar {
          width: 100%;
          height: 70px;
          background-color: #233D4D;
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

        .content {
          text-align: center;
          margin-top: 40px;
          max-width: 600px;
        }

        .page-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .student-name {
          font-size: 24px;
          margin-bottom: 30px;
          color: #fffde7;
        }

        .button-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-button {
          padding: 16px 32px;
          font-size: 20px;
          font-weight: bold;
          border: 4px solid black;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .nav-button:hover {
          transform: scale(1.05);
        }

        .green {
          background-color: #00C851;
          color: white;
        }

        .green:hover {
          background-color: #007E33;
        }

        .blue {
          background-color: #33b5e5;
          color: white;
        }

        .blue:hover {
          background-color: #0099cc;
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 28px;
          }

          .student-name {
            font-size: 20px;
          }

          .nav-button {
            padding: 12px 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
