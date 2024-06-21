import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaaaaaaaaaatC-Vnm8bbbbbbbQ",
  authDomain: "waiter-app-2-5201c.firebaseapp.com",
  projectId: "waiter-app-2-5201c",
  storageBucket: "waiter-app-2-5201c.appspot.com",
  messagingSenderId: "1022914558766",
  appId: "1:1022914558766:web:f243b682ab4254efea58bf",
  measurementId: "G-VB2JGQCWW4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);