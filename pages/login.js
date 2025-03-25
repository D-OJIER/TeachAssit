import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    <div className="container">
    
      <div className="left-section">
        <div className="form-container">
      
          <div className="role-selection">
            <button
              className={`role-button ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              className={`role-button ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
            >
              Teacher
            </button>
          </div>

          <label className="label">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <p className="forgot-password">Forgot Password?</p>

          <button onClick={handleLogin} className="login-button">
            LOG-IN
          </button>
        </div>
      </div>

      {/* Right Section (Background with Image) */}
      <div className="right-section">
        <img src="................" alt="ADD NECCESARY PIC" className="background-image" />
      </div>

      
        <style jsx>{`
    .container {
      display: flex;
      height: 97vh;
    }

    /* Left Side (Form) */
    .left-section {
      width: 50%;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .form-container {
      width: 80%;
      max-width: 400px;
    }

    /* Role Selection (Increased Size & Padding) */
    .role-selection {
      display: flex;
      width: 100%;
      background: #e8e3d8;
      padding: 15px; /* Increased padding */
      border-radius: 12px;
      margin-bottom: 25px;
    }

    .role-button {
      flex: 1;
      padding: 15px; /* Increased button padding */
      border: none;
      background: white;
      cursor: pointer;
      font-size: 18px; /* Increased font size */
      font-weight: bold;
      border-radius: 8px;
      transition: background 0.3s, transform 0.2s;
    }

    .role-button.active {
      background: #8e8ba3;
      color: white;
      transform: scale(1.05);
    }

    .label {
      display: block;
      font-size: 16px;
      font-weight: bold;
      color: black;
      margin-bottom: 5px;
    }

    .input-field {
      width: 100%;
      padding: 12px;
      border: 1px solid gray;
      border-radius: 5px;
      margin-bottom: 18px;
      font-size: 16px;
      outline: none;
    }

    .forgot-password {
      font-size: 14px;
      color: black;
      cursor: pointer;
      text-align: left;
      margin-bottom: 15px;
    }

    .login-button {
      width: 100%;
      background: #e8e3d8;
      color: black;
      padding: 12px;
      border: none;
      border-radius: 22px;
      font-size: 20px; /* Slightly increased button size */
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    .login-button:hover {
      background: #d6c7b0;
    }

    /* Right Side (Background + Image) */
    .right-section {
      width: 50%;
      background-color: #a7a2c3;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .background-image {
      width: 80%;
      height: auto;
      max-height: 80%;
      object-fit: contain;
    }

    /* Responsive Design */
    @media (max-width: 900px) {
      .container {
        flex-direction: column;
      }

      .left-section,
      .right-section {
        width: 100%;
        height: 50vh;
      }

      .right-section {
        padding: 20px;
      }

      .background-image {
        width: 60%;
      }

      .role-button {
        font-size: 16px; /* Adjust size for smaller screens */
        padding: 12px;
      }
    }
  `}</style>
    </div>
  );
}
