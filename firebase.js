
// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJTQWuu6CZrhfqY6lsyLIS6p6VFM1GmTA",
  authDomain: "fouraethiopia-e175e.firebaseapp.com",
  databaseURL: "https://fouraethiopia-e175e-default-rtdb.firebaseio.com",
  projectId: "fouraethiopia-e175e",
  storageBucket: "fouraethiopia-e175e.appspot.com",
  messagingSenderId: "634683882169",
  appId: "1:634683882169:web:aBcDeFgHiJkLmNoPqRsTuV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
