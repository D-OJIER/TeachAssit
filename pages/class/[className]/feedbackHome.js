import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function FeedbackPage() {
  const router = useRouter();
  const { className } = router.query;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && className) {
      fetchStudents();
    }
  }, [router.isReady, className]);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "students"), where("class", "==", className));
      const snapshot = await getDocs(q);
      const studentList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
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

      {/* Left Section (Title, Description, Image, Icons) */}
      <div className="left-section">
        <h1 className="title">Feedback Panel</h1>
        <p className="tagline">"Empowering educators, one student at a time."</p>
        <p className="description">
          Use this panel to access feedback tools, select students, and guide academic success.
        </p>
        <img src="/images/feedback.jpeg" alt="Feedback" className="teacher-image" />
        
      </div>

      {/* Right Section (Student List) */}
      <div className="right-section">
        <p className="subtitle">Students of Class {className}</p>
        <div className="class-grid">
          {loading ? (
            <p className="loading-text">Loading students...</p>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <button
                key={index}
                className="class-button"
                onClick={() =>
                  router.push(`/class/${encodeURIComponent(className)}/feedback/${student.id}`)
                }
              >
                {student.name} ({student.registerNo})
              </button>
            ))
          ) : (
            <p className="loading-text">No students found in this class.</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #251749, #263159);
          color: #FFFBEB;
          overflow: hidden;
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

        .left-section {
          flex: 1;
          display: flex;
          margin-top:70px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.05);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .title {
          font-size: 36px;
          font-weight: 700;
          color: #FFFBEB;
          margin-bottom: 15px;
          text-shadow: 1px 1px 8px #495579;
        }

        .tagline {
          font-style: italic;
          font-size: 18px;
          color: #FFFBEB;
          margin-bottom: 15px;
          text-align: center;
          max-width: 300px;
        }

        .description {
          font-size: 15px;
          color: #FFFBEB;
          opacity: 0.85;
          text-align: center;
          margin-bottom: 25px;
          max-width: 320px;
          line-height: 1.5;
        }

        .teacher-image {
          width: 80%;
          max-width: 320px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .icons {
          display: flex;
          gap: 20px;
          margin-top: 25px;
        }

        .decor-icon {
          width: 36px;
          height: 36px;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
        }

        .right-section {
          margin-top: 70px;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 40px 20px;
          background: #2AB3B1;
          backdrop-filter: blur(10px);
          align-items: center;
          overflow-y: auto;
        }

        .subtitle {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 25px;
          text-align: center;
          color: #FFFBEB;
          text-shadow: 1px 1px 4px #263159;
        }

        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          width: 100%;
          max-width: 600px;
        }

        .class-button {
          background: #FFFBEB;
          color: #263159;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 600;
          border: 4px solid black;
          font-size: 15px;
          transition: 0.3s ease-in-out;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 251, 235, 0.2);
        }

        .class-button:hover {
          background: #263159;
          color: #FFFBEB;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 251, 235, 0.3);
        }

        .loading-text {
          color: #FFFBEB;
          font-size: 16px;
          text-align: center;
          width: 100%;
          padding-top: 20px;
        }

        :global(body, html) {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left-section,
          .right-section {
            width: 100%;
            padding: 30px 20px;
          }

          .class-grid {
            grid-template-columns: 1fr;
          }

          .teacher-image {
            width: 70%;
          }

          .icons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
