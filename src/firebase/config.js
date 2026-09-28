import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmEydZimF4FZMLpOIag105OgKhmL0acQE",
  authDomain: "e-shop-cb883.firebaseapp.com",
  projectId: "e-shop-cb883",
  storageBucket: "e-shop-cb883.firebasestorage.app",
  messagingSenderId: "334743868922",
  appId: "1:334743868922:web:48b0310ca4e06210a1c043",
  measurementId: "G-YYSEPKRHFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication and Firestore database instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;