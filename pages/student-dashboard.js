import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";
import ProtectedRoute from "../components/ProtectedRoute";
import LogoutButton from "../components/LogoutButton";

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const subjectNames = Array.isArray(userData.subjects) ? userData.subjects : [];

          setSubjects(subjectNames);

          const studentQuery = query(
            collection(db, "students"),
            where("registerNo", "==", userData.registerNo)
          );
          const studentSnap = await getDocs(studentQuery);
          if (!studentSnap.empty) {
            const studentDoc = studentSnap.docs[0].data();
            setStudentName(studentDoc.name || "");
          }
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStudentData(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubjectClick = (subject) => {
    const user = auth.currentUser;
    const ref = doc(db, "users", user.uid);

    getDoc(ref).then((docSnap) => {
      if (docSnap.exists()) {
        const { registerNo } = docSnap.data();
        router.push({
          pathname: `/student/subject`,
          query: { subject, registerNo },
        });
      }
    });
  };

  return (
    <ProtectedRoute allowedRole="student">
      <div className="container">
        <nav className="navbar">
          <div className="nav-left">
            <img src="/images/invenos.png" alt="Logo" className="nav-logo" />
            <h1 className="nav-title">Sens<span style={{ color: "red" }}>ai</span></h1>
          </div>
          <div className="nav-links">
            <button onClick={() => router.push("/student-dashboard")}>Dashboard</button>
            <button onClick={() => router.push("/about")}>About</button>
            <button onClick={() => router.push("/settings")}>Settings</button>
            <button className="logout-btn"><LogoutButton /></button>
          </div>
        </nav>

        <h2 className="welcome">Welcome, {studentName || "Student"}!</h2>
        <p className="desc">Select a subject to continue.</p>

        <div className="class-grid">
          {subjects.map((subject, index) => (
            <button
              key={index}
              className="class-button"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSubjectClick(subject)}
            >
              {subject}
            </button>
          ))}
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
            font-family: 'Poppins', sans-serif;
          }

          .container {
            min-height: 83.9vh;
            color: white;
            padding-top: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
          }

          .navbar {
            width: 95%;
            height: 70px;
            background-color: #233D4D;
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
          border: 1px solidrgb(182, 221, 226);
          padding: 6px 12px;
          border-radius: 6px;
          margin-right: auto;
        }

          .welcome {
            font-size: 38px;
            font-weight: 700;
            margin-top: 60px;
            margin-bottom: 10px;
          }

          .desc {
            font-size: 18px;
            opacity: 0.9;
            max-width: 500px;
            margin-bottom: 40px;
            text-align: center;
          }

          .class-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            width: 100%;
            max-width: 1100px;
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
            .nav-title {
              font-size: 20px;
            }

            .nav-links button {
              margin-left: 10px;
              font-size: 14px;
            }

            .welcome {
              font-size: 28px;
            }

            .desc {
              font-size: 16px;
            }

            .class-button {
              padding: 24px;
              font-size: 20px;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
