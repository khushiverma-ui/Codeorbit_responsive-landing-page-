// ==========================================================================
// CODEORBIT — GOOGLE FIREBASE CONFIGURATION & BACKEND BASE
// Modern Firebase v10 Modular SDK Initialization (Auth & Cloud Firestore)
// ==========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * --------------------------------------------------------------------------
 * FIREBASE PROJECT CREDENTIALS
 * Replace these placeholder values with your project settings from:
 * https://console.firebase.google.com/ -> Project Settings -> General -> Web App
 * --------------------------------------------------------------------------
 */
export const firebaseConfig = {
    apiKey: "AIzaSyCSZHWpZvcDRN4QdsrIvIMsBhU0v4M_caQ",
    authDomain: "codeorbit-e6557.firebaseapp.com",
    projectId: "codeorbit-e6557",
    storageBucket: "codeorbit-e6557.firebasestorage.app",
    messagingSenderId: "487347614003",
    appId: "1:487347614003:web:d5199ee75db9fadfb58e46",
    measurementId: "G-H0ELH8RSGQ"
};

// Detect if real Firebase credentials are provided
export const isFirebaseConfigured = !firebaseConfig.apiKey.includes("DemoPlaceholder");

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    console.log("🔥 [CodeOrbit] Firebase Base initialized successfully!");
} catch (error) {
    console.warn("⚠️ [CodeOrbit] Firebase initialized in fallback mode:", error.message);
}

export { 
    app, 
    auth, 
    db, 
    googleProvider,
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
};
