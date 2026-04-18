import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDJFE9-JFX6lZZwevUsSeSvGkb6CtqrN50",
  authDomain: "beverageshop-c532a.firebaseapp.com",
  projectId: "beverageshop-c532a",
  storageBucket: "beverageshop-c532a.firebasestorage.app",
  messagingSenderId: "738444831589",
  appId: "1:738444831589:web:7019c9275578bf32060f8c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app)  
export default db

