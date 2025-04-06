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

          // ✅ Fetch student name from students collection using registerNo
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
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Student Dashboard
        </h1>

        {studentName && (
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            👋 Welcome, <strong>{studentName}</strong>
          </p>
        )}

        <p>Select a subject to view more details:</p>

        {subjects.length === 0 ? (
          <p>No subjects found.</p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  padding: "10px 20px",
                  margin: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <LogoutButton />
        </div>
      </div>
    </ProtectedRoute>
  );
}
