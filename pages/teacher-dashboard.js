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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <p>Select a class to manage:</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {classes.map((className, index) => (
          <button
            key={index}
            className="p-4 bg-blue-500 text-white rounded"
            onClick={() => router.push(`/class/${encodeURIComponent(className)}`)}
          >
            {className}
          </button>
        ))}
      </div>
    </div>
  );
}
