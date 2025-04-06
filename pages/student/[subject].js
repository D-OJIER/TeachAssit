import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import LogoutButton from "@/components/LogoutButton";


export default function SubjectPage() {
  const router = useRouter();
  const { registerNo, subject } = router.query;

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
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo-circle">
            <img src="/images/LogoCompact.PNG" alt="Logo" className="nav-logo" />
          </div>
          <h1 className="nav-title">Sens<span style={{ color: "red" }}>ai</span></h1>
        </div>
        <div className="nav-links">
          <button onClick={() => router.push("/teacher-dashboard")}>Schedule</button>
          <button onClick={() => router.push("/history")}>About us</button>
          <button onClick={() => router.push("/settings")}>Settings</button>
          <button className="logout-btn" >Logout</button>
        </div>
      </nav>

      <h2 className="page-title">Subject: Blockchain</h2>
      {studentName && <h3 className="student-name">Welcome, {studentName}!</h3>}

      <div className="button-group">
        <button onClick={handleViewMarks} className="class-button" style={{ animationDelay: "0s" }}>
          View Marks
        </button>
        <button onClick={handleViewFeedback} className="class-button" style={{ animationDelay: "0.1s" }}>
          View Feedback
        </button>
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

        .container {
          min-height: 100vh;
          padding-top: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .logo-circle {
          height: 45px;
          width: 45px;
          background: #fffbeb;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
        }

        .nav-logo {
          height: 38px;
          width: 35px;
          margin-left:4px;
          margin-bottom:3px;
          
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
          color: #251749;
        }

        .logout-btn {
          border: 1px solid #fffbeb;
          padding: 6px 12px;
          border-radius: 6px;
          margin-right: 35px;
        }

        .page-title {
          font-size: 38px;
          font-weight: 700;
          margin-top: 20px;
          margin-bottom: 10px;
          text-align: center;
        }

        .student-name {
          font-size: 24px;
          margin-bottom: 30px;
          color: #fffde7;
        }

        .button-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }

        .class-button {
          padding: 40px;
          background: #fffbeb;
          color: #263159;
          font-weight: 700;
          font-size: 24px;
          border: 5px solid black;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        .class-button:hover {
          background: white;
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 28px;
          }

          .student-name {
            font-size: 20px;
          }

          .class-button {
            padding: 24px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
