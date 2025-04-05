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
      {/* Left Section (Title & Image) */}
      <div className="left-section">
        <h1 className="title">Feedback Panel</h1>
        <img src="/feedback-image.jpg" alt="Feedback" className="teacher-image" />
      </div>

      {/* Right Section (Student List) */}
      <div className="right-section">
        <p className="subtitle">Students of Class {className}</p>
        <div className="class-grid">
          {loading ? (
            <p>Loading students...</p>
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
            <p>No students found in this class.</p>
          )}
        </div>
      </div>

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

        .class-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
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

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            height: auto;
          }

          .left-section,
          .right-section {
            width: 100%;
            text-align: center;
          }

          .teacher-image {
            width: 60%;
          }

          .class-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
