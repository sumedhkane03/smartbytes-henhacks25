import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
 getAuth,
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signOut,
} from "firebase/auth";


const firebaseConfig = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
 messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
 appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);


export const signUp = async (email: string, password: string) => {
 try {
   if (!email || !password) {
     return { user: null, error: "Email and password are required" };
   }
   const userCredential = await createUserWithEmailAndPassword(
     auth,
     email,
     password
   );
   return { user: userCredential.user, error: null };
 } catch (error: unknown) {
   if (error instanceof Error) {
     return { user: null, error: error.message };
   }
   return { user: null, error: "An unknown error occurred" };
 }
};


export const signIn = async (email: string, password: string) => {
 try {
   if (!email || !password) {
     return { user: null, error: "Email and password are required" };
   }
   const userCredential = await signInWithEmailAndPassword(
     auth,
     email,
     password
   );
   return { user: userCredential.user, error: null };
 } catch (error: unknown) {
   if (error instanceof Error) {
     return { user: null, error: error.message };
   }
   return { user: null, error: "An unknown error occurred" };
 }
};


export const logOut = async () => {
 try {
   await signOut(auth);
   return { error: null };
 } catch (error: unknown) {
   if (error instanceof Error) {
     return { error: error.message };
   }
   return { error: "An unknown error occurred" };
 }
};