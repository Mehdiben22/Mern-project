// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    //We are using vite for the firebase api key so we will use import.meta.env
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4bfca.firebaseapp.com",
  projectId: "mern-blog-4bfca",
  storageBucket: "mern-blog-4bfca.appspot.com",
  messagingSenderId: "104009756933",
  appId: "1:104009756933:web:0f6bea1e68b5820c35076c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);