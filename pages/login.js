
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
        } else {
          router.push("/student-dashboard");
        }
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="form-wrapper">
          <div className="logo-brand centered">
            <img src="/images/invenos.png" alt="Logo" className="logo large" />
            <h1 className="brand-name large">
              Sens<span className="ai">ai</span>
            </h1>
          </div>

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
            LOG IN
          </button>
        </div>
      </div>

      <div className="right-section">
        <div className="info-box">
          <img src="/images/login-bg.png" alt="AI Assistant" className="illustration" />
          <h2 className="headline">Empowering Teachers with AI</h2>
          <p className="description">
            Evaluate student progress, assign grades, and provide personalized feedback effortlessly using our smart assistant platform powered by artificial intelligence.
          </p>
        </div>
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
        }

        .container {
          display: flex;
          height: 100vh;
          background-color: #f8f9fa;
        }

        .left-section {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
        }

        .form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }

        .centered {
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        .logo {
          height: 50px;
          margin-bottom: 10px;
        }

        .logo.large {
          height: 80px;
        }

        .brand-name {
          font-size: 32px;
          font-weight: 700;
          color: #2E2E2E;
        }

        .brand-name.large {
          font-size: 42px;
        }

        .brand-name .ai {
          color: #FF6B6B;
          
        }

        .role-selection {
          display: flex;
          background: #E0E0E0;
          padding: 12px;
          border-radius: 12px;
          margin: 30px 0;
        }

        .role-button {
          flex: 1;
          padding: 12px;
          border: none;
          background: #ffffff;
          color: #233D4D;
          font-weight: bold;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .role-button.active {
          background: #2AB3B1;
          color: #ffffff;
          transform: scale(1.05);
        }

        .label {
          font-size: 14px;
          font-weight: bold;
          color: #2E2E2E;
          margin-bottom: 5px;
        }

        .input-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 15px;
          color: #2E2E2E;
        }

        .forgot-password {
          font-size: 13px;
          color: #6C757D;
          margin-bottom: 20px;
          cursor: pointer;
          text-align: right;
        }

        .login-button {
          width: 100%;
          background-color: #2AB3B1;
          color: white;
          border: none;
          padding: 12px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .login-button:hover {
          background-color: #239f9d;
        }

        .right-section {
          width: 50%;
          background-color: #239f9d;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          text-align: center;
        }

        .info-box {
          max-width: 500px;
        }

        .illustration {
          width: 100%;
          max-height: 280px;
          object-fit: contain;
          margin-bottom: 25px;
        }

        .headline {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .description {
          font-size: 16px;
          line-height: 1.5;
          color: #f0f0f0;
        }

        @media (max-width: 900px) {
          .container {
            flex-direction: column;
          }

          .left-section,
          .right-section {
            width: 100%;
            height: auto;
          }

          .form-wrapper {
            max-width: 90%;
          }

          .brand-name.large {
            font-size: 34px;
          }

          .logo.large {
            height: 60px;
          }

          .headline {
            font-size: 22px;
          }

          .description {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
