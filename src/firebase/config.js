// Firebase Configuration — Meeran92 Portal
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9a9alnbR0CcIBYCObeU41BSA6vaXcjHs",
  authDomain: "meeran92-39c48.firebaseapp.com",
  projectId: "meeran92-39c48",
  storageBucket: "meeran92-39c48.firebasestorage.app",
  messagingSenderId: "42865400089",
  appId: "1:42865400089:web:b4a4303907ad9cdadf4d88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
