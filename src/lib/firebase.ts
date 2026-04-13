import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLS_X5Rfai3MB7qDF3tYguuKYN8ZCoqEw",
  authDomain: "custody-calendar-18f39.firebaseapp.com",
  projectId: "custody-calendar-18f39",
  storageBucket: "custody-calendar-18f39.firebasestorage.app",
  messagingSenderId: "536673483397",
  appId: "1:536673483397:web:783908f5272e223fa207ec",
  measurementId: "G-KD9GQVVC8X",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
