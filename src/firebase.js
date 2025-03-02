import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCMJiGy4rTEAA6YQfvrfS_QtI8XTbw0J0A",
  authDomain: "finalhealthhub.firebaseapp.com",
  projectId: "finalhealthhub",
  storageBucket: "finalhealthhub.firebasestorage.app",
  messagingSenderId: "448193974966",
  appId: "1:448193974966:web:815ebc759c48bc9df3cc17",
  measurementId: "G-Z74W59QXQM"
};
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db=getFirestore(app)
export default app;

