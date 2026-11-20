// ==========================================================================
// CODEORBIT — FIREBASE AUTHENTICATION SERVICE
// Supports Google Sign-In, Email/Password, User Provisioning & Session Sync
// ==========================================================================

import { 
    auth, 
    db, 
    googleProvider, 
    isFirebaseConfigured,
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp 
} from "./firebase-config.js";

/**
 * 1. Google Sign-In (Firebase Popup)
 */
export async function signInWithGoogle() {
    if (!isFirebaseConfigured) {
        console.log("ℹ️ Demo Mode: Simulating Google Sign-In with Khushi Verma account.");
        const demoUser = {
            uid: "demo-google-uid-khushi",
            name: "Khushi Verma",
            email: "khushi.verma@college.edu",
            photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            college: "Vidya University",
            course: "Computer Science Engineering",
            year: "3rd Year",
            skill: "Web Development",
            bio: "Passionate about web development, product design and building student-focused solutions."
        };
        localStorage.setItem("currentStudent", JSON.stringify(demoUser));
        localStorage.setItem("csepAuthType", "google");
        return { user: demoUser };
    }

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        let studentData = {
            uid: user.uid,
            name: user.displayName || "Student",
            email: user.email,
            photoURL: user.photoURL,
            college: "Vidya University",
            course: "Computer Science Engineering",
            year: "3rd Year",
            skill: "Web Development",
            bio: "College student exploring and sharing skills on CodeOrbit.",
            skillsShared: 1,
            skillsLearned: 0
        };

        // Provision/Update student profile in Firestore 'users' collection (safe sync)
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    ...studentData,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                });
            } else {
                studentData = { ...studentData, ...userSnap.data() };
                await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            }
        } catch (dbErr) {
            console.warn("ℹ️ Firestore profile sync notice (ensure Cloud Firestore is created in Firebase Console):", dbErr.message);
        }

        localStorage.setItem("currentStudent", JSON.stringify(studentData));
        localStorage.setItem("csepAuthType", "google");
        return { user: studentData };
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        let msg = error.message;
        if (error.code === "auth/popup-closed-by-user") {
            msg = "Sign-in popup was closed before completing.";
        } else if (error.code === "auth/unauthorized-domain") {
            msg = "This domain (e.g. localhost) is not authorized in Firebase Console -> Authentication -> Settings -> Authorized Domains.";
        } else if (error.code === "auth/operation-not-allowed") {
            msg = "Google Provider is disabled. Enable Google under Firebase Console -> Authentication -> Sign-in method.";
        }
        throw new Error(msg);
    }
}

/**
 * 2. Email & Password Registration
 */
export async function registerWithEmail(email, password, profileData) {
    if (!isFirebaseConfigured) {
        console.log("ℹ️ Demo Mode: Simulating Registration for", profileData.name);
        const student = {
            uid: "demo-uid-" + Date.now(),
            name: profileData.name,
            email: email,
            phone: profileData.phone,
            college: profileData.college,
            course: profileData.course,
            year: profileData.year,
            skill: profileData.skill,
            bio: profileData.bio || `Passionate student of ${profileData.course} at ${profileData.college}.`
        };

        let existing = JSON.parse(localStorage.getItem("csepStudents") || "[]");
        existing.push(student);
        localStorage.setItem("csepStudents", JSON.stringify(existing));
        localStorage.setItem("currentStudent", JSON.stringify(student));
        localStorage.setItem("csepAuthType", "email");
        return { user: student };
    }

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        const studentData = {
            uid: user.uid,
            name: profileData.name,
            email: email,
            phone: profileData.phone,
            college: profileData.college,
            course: profileData.course,
            year: profileData.year,
            skill: profileData.skill,
            bio: `Passionate student of ${profileData.course} at ${profileData.college}, exploring and sharing skills in ${profileData.skill}.`,
            createdAt: serverTimestamp()
        };

        // Save in Cloud Firestore users collection (resilient)
        try {
            await setDoc(doc(db, "users", user.uid), studentData);
        } catch (dbErr) {
            console.warn("ℹ️ Firestore profile save notice:", dbErr.message);
        }

        localStorage.setItem("currentStudent", JSON.stringify(studentData));
        localStorage.setItem("csepAuthType", "email");
        return { user: studentData };
    } catch (error) {
        console.error("Registration Error:", error);
        let msg = error.message;
        if (error.code === "auth/email-already-in-use") {
            msg = "This email is already registered. Please log in instead.";
        } else if (error.code === "auth/weak-password") {
            msg = "Password should be at least 6 characters.";
        } else if (error.code === "auth/invalid-email") {
            msg = "Please enter a valid email address.";
        } else if (error.code === "auth/operation-not-allowed") {
            msg = "Email/Password sign-in is disabled in Firebase Console -> Authentication -> Sign-in method.";
        }
        throw new Error(msg);
    }
}

/**
 * 3. Email & Password Login
 */
export async function loginWithEmail(email, password) {
    if (!isFirebaseConfigured) {
        let students = JSON.parse(localStorage.getItem("csepStudents") || "[]");
        const found = students.find(s => s.email.toLowerCase() === email.toLowerCase());

        const student = found || {
            uid: "demo-uid-khushi",
            name: "Khushi Verma",
            email: email,
            college: "Vidya University",
            course: "Computer Science Engineering",
            year: "3rd Year",
            skill: "Web Development"
        };

        localStorage.setItem("currentStudent", JSON.stringify(student));
        localStorage.setItem("csepAuthType", "email");
        return { user: student };
    }

    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        let studentData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split("@")[0]
        };

        // Fetch Firestore profile (resilient)
        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) {
                studentData = { ...studentData, ...userSnap.data() };
            }
        } catch (dbErr) {
            console.warn("ℹ️ Firestore profile fetch notice:", dbErr.message);
        }

        localStorage.setItem("currentStudent", JSON.stringify(studentData));
        localStorage.setItem("csepAuthType", "email");
        return { user: studentData };
    } catch (error) {
        console.error("Login Error:", error);
        let msg = error.message;
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
            msg = "Incorrect email or password. Please verify your credentials.";
        } else if (error.code === "auth/invalid-email") {
            msg = "Please enter a valid email address.";
        }
        throw new Error(msg);
    }
}

/**
 * 4. Sign Out
 */
export async function logoutUser() {
    try {
        if (isFirebaseConfigured && auth) {
            await signOut(auth);
        }
    } catch (e) {
        console.warn("SignOut notice:", e);
    }
    localStorage.removeItem("currentStudent");
    localStorage.removeItem("csepAuthType");
    window.location.href = "login.html";
}

/**
 * 5. Global Auth State Observer
 */
export function initAuthState(callback) {
    // Check cached profile first for instant UI response
    let cached = null;
    try {
        cached = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        cached = null;
    }

    if (cached) {
        callback(cached);
    }

    if (isFirebaseConfigured && auth) {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userSnap = await getDoc(doc(db, "users", user.uid));
                const studentData = userSnap.exists() ? userSnap.data() : {
                    uid: user.uid,
                    name: user.displayName || "Student",
                    email: user.email,
                    photoURL: user.photoURL
                };
                localStorage.setItem("currentStudent", JSON.stringify(studentData));
                callback(studentData);
            } else {
                callback(null);
            }
        });
    }
}
