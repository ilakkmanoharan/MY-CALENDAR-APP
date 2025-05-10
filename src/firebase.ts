// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Removed unused import for getAnalytics
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXExXJ4qyaeiYQ0c3ZzzY5DQzMb3eof2Q",
  authDomain: "mycalendar-f3c69.firebaseapp.com",
  projectId: "mycalendar-f3c69",
  storageBucket: "mycalendar-f3c69.firebasestorage.app",
  messagingSenderId: "1056036721943",
  appId: "1:1056036721943:web:566c403af5ca931e641352",
  measurementId: "G-FJ9SD6CNC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Removed as it is unused

// 🔑 Auth
export const auth = getAuth(app);

// 🗃️ Firestore
export const db = getFirestore(app);

// 📦 Storage (for profile pictures)
export const storage = getStorage(app);