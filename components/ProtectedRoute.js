import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Show a loader while checking auth
  }

  return user ? children : null;
};

export default ProtectedRoute;
