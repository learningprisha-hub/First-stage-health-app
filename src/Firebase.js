import { initializeApp } from "firebase/app";
import {getAuth,setPersistence, browserLocalPersistence} from "firebase/auth"
import { getDatabase } from 'firebase/database'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log(Boolean(import.meta.env.VITE_FIREBASE_API_KEY))
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
setPersistence(auth, browserLocalPersistence).catch((e) => console.warn('Persistence not set', e))
export const db = firebaseConfig.databaseURL ? getDatabase(app) : null
export default app