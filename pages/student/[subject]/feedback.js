import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function FeedbackPage() {
  const router = useRouter();
  const { registerNo } = router.query;

  const [studentName, setStudentName] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !registerNo) return;
    fetchStudentFeedback();
  }, [router.isReady, registerNo]);

  const fetchStudentFeedback = async () => {
    try {
      const q = query(
        collection(db, "students"),
        where("registerNo", "==", registerNo)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();

        setStudentName(docData.name);

        const scores = {
          UT1: parseInt(docData.UT1 || "0"),
          CAT1: parseInt(docData.CAT1 || "0"),
          UT2: parseInt(docData.UT2 || "0"),
          CAT2: parseInt(docData.CAT2 || "0"),
        };

        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: docData.name, scores }),
        });

        const json = await response.json();
        const feedbackArray = Object.entries(json.feedback).map(
          ([exam, feedback]) => ({
            exam,
            feedback,
          })
        );

        setFeedbacks(feedbackArray);
      } else {
        console.warn("No student found with given registerNo.");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }

    setLoading(false);
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
          <button className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="glass-box">
        <h1 className="title">Feedback Report</h1>
        {studentName && (
          <h2 className="subtitle" style={{ marginBottom: "-5px" }}>
            Student: <span className="highlight">{studentName}</span>
          </h2>
        )}
        <h2 className="subtitle" style={{ marginBottom: "30px" }}>
          Reg No: <span className="highlight">{registerNo}</span>
        </h2>

        {loading ? (
          <p className="loading-text">Fetching feedback...</p>
        ) : (
          <ul className="feedback-list">
            {feedbacks.map(({ exam, feedback }, index) => (
              <li key={index} className="feedback-card">
                <h2 className="exam-title">{exam}</h2>
                <p className="exam-feedback">{feedback}</p>
              </li>
            ))}
          </ul>
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
          font-family: 'Roboto', sans-serif;
        }

        .container {
          background: #2AB3B1;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          
        }

        .glass-box {
          background:#251749;
          margin-top: 70px;
          border-radius: 15px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 700px;
          color: #333333;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 28px;
          margin-bottom: 10px;
          color: #333;
          text-align: center;
          color:#ffffff
        }

        .subtitle {
          text-align: center;
          font-size: 18px;
          color: #666;
        }

        .highlight {
          color: #007bff;
        }

        .loading-text {
          text-align: center;
          font-size: 16px;
          color: #888;
        }

        .feedback-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feedback-card {
          background: #f9f9f9;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .feedback-card:hover {
          background: #e7f1ff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
        }

        .exam-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #007bff;
        }

        .exam-feedback {
          color: #444;
        }

        @media (max-width: 600px) {
          .glass-box {
            padding: 20px;
          }

          .title {
            font-size: 24px;
          }

          .subtitle {
            font-size: 16px;
          }

          .feedback-card {
            padding: 15px;
          }
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
      `}</style>
    </div>
  );
}
