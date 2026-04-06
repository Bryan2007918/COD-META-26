import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZQH7fbt_PHXQpJU_mk6bgBING7g0eOPw",
  authDomain: "cod-meta-26.firebaseapp.com",
  projectId: "cod-meta-26",
  storageBucket: "cod-meta-26.firebasestorage.app",
  messagingSenderId: "224615162333",
  appId: "1:224615162333:web:fb49037c4fbd8c1cc9d634"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { getStorage } from "firebase/storage";
export const storage = getStorage(app);
