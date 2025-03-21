import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

const firebaseConfig = {
    apiKey: "AIzaSyC8NE5HoDPEK01IncDZD7Clq-7-ukCTM60",
    authDomain: "assisti-61c49.firebaseapp.com",
    projectId: "assisti-61c49",
    storageBucket: "assisti-61c49.appspot.com", // ✅ Correct storage bucket
    messagingSenderId: "1006693692360",
    appId: "1:1006693692360:web:e768a2f185cf4bb207c6fd",
    measurementId: "G-QCV2H6Y8VE"
};

// ✅ Prevent multiple Firebase instances
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Ensure Firebase Storage is initialized

export { auth, signInWithEmailAndPassword, db, storage };
