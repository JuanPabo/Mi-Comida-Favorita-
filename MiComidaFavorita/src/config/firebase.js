import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPiY27j9KqUT0TG2jvFFuUow0WJlAjs4Y",
  authDomain: "mi-comida-favorita-ad3ed.firebaseapp.com",
  projectId: "mi-comida-favorita-ad3ed",
  storageBucket: "mi-comida-favorita-ad3ed.firebasestorage.app",
  messagingSenderId: "928803579215",
  appId: "1:928803579215:web:8d6358b34161e4b0d1113a",
  measurementId: "G-W13HQ3Q4NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);