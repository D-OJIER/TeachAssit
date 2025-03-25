import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeacherData = async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setClasses(userDoc.data().classes || []);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTeacherData(user);
      } else {
        router.push("/login"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      {/* Left Section (Title & Image) */}
      <div className="left-section">
        <h1 className="title">Teacher Dashboard</h1>
        <img src="/teacher-image.jpg" alt="Teacher" className="teacher-image" />
      </div>

      {/* Right Section (Class Buttons) */}
      <div className="right-section">
        <p className="subtitle">Select a class to manage:</p>
        <div className="class-grid">
          {classes.map((className, index) => (
            <button
              key={index}
              className="class-button"
              onClick={() => router.push(`/class/${encodeURIComponent(className)}`)}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .container {
          display: flex;
          height: 97vh;
          background-color: #f5f5f5;
        }

        .left-section {
          width: 50%;
          flex: 1;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .teacher-image {
          width: 80%;
          max-width: 300px;
          border-radius: 10px;
        }

        .right-section {
          width: 50%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #a7a2c3;
          padding: 20px;
        }

        .subtitle {
          font-size: 18px;
          color: white;
          margin-bottom: 15px;
          font-weight: bold;
        }

        /* Class Buttons Grid */
        .class-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 2 columns */
          gap: 10px;
          width: 80%;
        }

        .class-button {
          width: 100%;
          background: white;
          color: black;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
          text-align: center;
        }

        .class-button:hover {
          background: #217dbb;
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            flex-direction: column; /* Stack sections vertically */
            height: auto;
          }

          .left-section, .right-section {
            width: 100%; /* Full width */
            text-align: center;
          }

          .teacher-image {
            width: 60%;
          }

          .class-grid {
            grid-template-columns: repeat(1, 1fr); /* Single column layout on small screens */
          }
        }
      `}</style>
    </div>
  );
}
