// ==========================================================================
// CODEORBIT — FIRESTORE DATABASE SERVICE
// Manages collections for Users, Skill Swaps, Projects, and Discussions
// ==========================================================================

import { 
    db, 
    isFirebaseConfigured,
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "./firebase-config.js";

/**
 * 1. Skill Swap Proposals (Reciprocal Barter)
 */
export async function createSkillSwap(swapData) {
    if (!isFirebaseConfigured) {
        const swaps = JSON.parse(localStorage.getItem("csepSentSwaps") || "[]");
        const newSwap = {
            id: "local-swap-" + Date.now(),
            ...swapData,
            status: "pending",
            createdAt: new Date().toISOString()
        };
        swaps.push(newSwap);
        localStorage.setItem("csepSentSwaps", JSON.stringify(swaps));
        return newSwap;
    }

    const docRef = await addDoc(collection(db, "swaps"), {
        ...swapData,
        status: "pending",
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...swapData };
}

export async function getSkillSwaps(userId) {
    if (!isFirebaseConfigured) {
        return JSON.parse(localStorage.getItem("csepSentSwaps") || "[]");
    }

    try {
        const q = query(collection(db, "swaps"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("Firestore swaps query fallback:", e);
        return JSON.parse(localStorage.getItem("csepSentSwaps") || "[]");
    }
}

/**
 * 2. Collaboration Projects
 */
export async function createProject(projectData) {
    if (!isFirebaseConfigured) {
        const projects = JSON.parse(localStorage.getItem("csepProjects") || "[]");
        const newProj = {
            id: "local-proj-" + Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
        projects.unshift(newProj);
        localStorage.setItem("csepProjects", JSON.stringify(projects));
        return newProj;
    }

    const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...projectData };
}

export async function getProjects() {
    if (!isFirebaseConfigured) {
        return JSON.parse(localStorage.getItem("csepProjects") || "[]");
    }

    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("Firestore projects query fallback:", e);
        return JSON.parse(localStorage.getItem("csepProjects") || "[]");
    }
}

/**
 * 3. Community Discussions
 */
export async function createDiscussion(discussionData) {
    if (!isFirebaseConfigured) {
        const discussions = JSON.parse(localStorage.getItem("csepDiscussions") || "[]");
        const newDisc = {
            id: "local-disc-" + Date.now(),
            ...discussionData,
            repliesCount: 0,
            createdAt: new Date().toISOString()
        };
        discussions.unshift(newDisc);
        localStorage.setItem("csepDiscussions", JSON.stringify(discussions));
        return newDisc;
    }

    const docRef = await addDoc(collection(db, "discussions"), {
        ...discussionData,
        repliesCount: 0,
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...discussionData };
}

export async function getDiscussions() {
    if (!isFirebaseConfigured) {
        return JSON.parse(localStorage.getItem("csepDiscussions") || "[]");
    }

    try {
        const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("Firestore discussions query fallback:", e);
        return JSON.parse(localStorage.getItem("csepDiscussions") || "[]");
    }
}
