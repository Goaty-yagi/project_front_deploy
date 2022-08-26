
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// import { getFirestore }from "firebase/firestore"
// const { initializeApp } = require("firebase/app");
// const { getAuth } = require("firebase/auth")


console.log("IN_FIREBASE")


const firebaseConfig = {
  apiKey: "AIzaSyBcHl8FsxGlKZv88X9W7vBajVKkisPGerQ",
  authDomain: "ga-project-98eb1.firebaseapp.com",
  projectId: "ga-project-98eb1",
  storageBucket: "ga-project-98eb1.appspot.com",
  messagingSenderId: "350480645534",
  appId: "1:350480645534:web:826de817b8902c4405ea8f",
  measurementId: "G-3Z61DVQBTL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
// const db = getFirestore(firebaseApp)