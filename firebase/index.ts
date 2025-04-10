import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";
import { getFirestore } from "firebase/firestore";

const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);
export const auth = getAuth();
export const db = getFirestore(firebase);

export default firebase;
