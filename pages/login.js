import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "teacher") {
          router.push("/teacher-dashboard");
        } else if (userData.role === "student") {
          router.push("/student-dashboard");
        }
      } else {
        console.error("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="mb-2 p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-2 p-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </div>
  );
}
