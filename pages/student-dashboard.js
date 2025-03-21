import ProtectedRoute from "../components/ProtectedRoute";
import LogoutButton from "../components/LogoutButton";

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRole="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p>View your grades and feedback from teachers.</p>
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}
