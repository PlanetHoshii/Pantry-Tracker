// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADPDjHyUjZQXU8ukExAsbZ0qQ2LC6u-7g",
  authDomain: "inventory-management-hoshi.firebaseapp.com",
  projectId: "inventory-management-hoshi",
  storageBucket: "inventory-management-hoshi.appspot.com",
  messagingSenderId: "225508141625",
  appId: "1:225508141625:web:95ed965320ada002a5fbe8",
  measurementId: "G-C43STC8R70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}