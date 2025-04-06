import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";


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
      {/* Navbar (Top Section) */}
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/LogoCompact.png" alt="Logo" className="nav-logo" />
          <h1 className="nav-title">Sens<span style={{ color: "red" }}>ai</span></h1>
        </div>
        <div className="nav-links">
          <button onClick={() => router.push("/student-dashboard")}>Dashboard</button>
          <button onClick={() => router.push("/about")}>About</button>
          <button onClick={() => router.push("/settings")}>Settings</button>
          <button onClick={() => router.push("/login")}>Logout</button>
        </div>
      </nav>

      <div className="main-content">
        {/* Left Section: Image and Content */}
        <div className="left-section">
          <img src="/images/blockchain.jpg" alt="Subject" className="subject-image" />
          <div className="subject-info">
            <h2>Blockchain: Understanding the Future</h2>
            <p>
              Dive deep into the world of blockchain technology with this subject. Learn how decentralized systems
              are reshaping industries.
            </p>
          </div>
        </div>

        {/* Right Section: Marks and Feedback */}
        <div className="right-section">
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

        .container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding-top: 7px;
        }

        /* Navbar (Top Section) */
        .navbar {
          width: 95%;
          border: 5px solid black;
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

        .nav-links {
          margin-left: auto;
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

        .main-content {
          display: flex;
          padding: 20px;
          margin-top: 80px; /* to make room for the navbar */
        }

        /* Left Section (Image and Content) */
        .left-section {
          width: 50%;
          margin-right: 20px;
          background-color: #263159; /* Blue color */
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .subject-image {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .subject-info h2 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .subject-info p {
          font-size: 16px;
          color: #fff;
        }

       /* Right Section (Marks and Feedback) */
.right-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
  background-color: #263159;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: auto; 
}


        .page-title {
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 20px;
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
