import { useRouter } from "next/router";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded mt-4"
    >
      Logout
    </button>
  );
}
