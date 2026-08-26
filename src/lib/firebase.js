import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5gRlQulDNkubs6kfJ_dPKzQIlVKFMc48",
  authDomain: "game-companion-a3557.firebaseapp.com",
  projectId: "game-companion-a3557",
  storageBucket: "game-companion-a3557.firebasestorage.app",
  messagingSenderId: "384951711898",
  appId: "1:384951711898:web:6776057fe256b8de3a0723",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;