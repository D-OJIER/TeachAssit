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
          height: 100vh;
          background: linear-gradient(to right, #f8f9fc, #e4e4f5);
          font-family: 'Segoe UI', sans-serif;
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
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          color: #2c2c54;
          margin-bottom: 20px;
        }

        .teacher-image {
          width: 85%;
          max-width: 320px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .right-section {
          width: 50%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 40px 20px;
          background-color: #a7a2c3;
          overflow-y: auto;
        }

        .subtitle {
          font-size: 22px;
          font-weight: 600;
          color: white;
          margin-bottom: 25px;
        }

        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 15px;
          width: 100%;
          max-width: 600px;
        }

        .class-button {
          background: white;
          color: #333;
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .class-button:hover {
          background-color: #263159;
          color: white;
          transform: translateY(-2px);
        }

        .loading-text {
          color: white;
          font-size: 16px;
          text-align: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left-section,
          .right-section {
            width: 100%;
            padding: 30px 15px;
          }

          .teacher-image {
            width: 65%;
          }

          .class-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
