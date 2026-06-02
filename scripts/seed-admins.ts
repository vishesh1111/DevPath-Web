import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const admins = [
    {
        name: "Aditya Patil",
        email: "ap8548328@gmail.com",
        role: "Community Head & Founder",
        photoURL: "", // TODO: Add photo URL
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Aditya Akolkar",
        email: "aditya.akolkar@example.com", // Placeholder
        role: "Technical Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Pranav Khaire",
        email: "pranav.khaire@example.com", // Placeholder
        role: "Content Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Dev Mukherjee",
        email: "dev.mukherjee@example.com", // Placeholder
        role: "Partnerships Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    }
];

async function seedAdmins() {
    try {
        // Login as Super Admin to have write access
        console.log("Logging in as Super Admin...");
        await signInWithEmailAndPassword(auth, process.env.SUPER_ADMIN_EMAIL as string, process.env.SUPER_ADMIN_PASSWORD as string);
        console.log("Logged in successfully.");

        for (const admin of admins) {
            console.log(`Seeding admin: ${admin.name}`);
            // Use email as ID (sanitized) or auto-id. Using email for easier lookup/auth mapping if needed.
            // But for public profile, maybe auto-id is safer? 
            // User said "Create Collection for Them... where the Name of Admin...".
            // Let's use a sanitized email or just a unique ID.
            // Actually, using the email as the document ID makes it easy to check "is this user an admin?"
            // But we need to be careful about PII.
            // Let's use the email as the ID for now as it's a unique identifier provided.
            await setDoc(doc(db, "admins", admin.email), admin);
        }
        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admins:", error);
        process.exit(1);
    }
}

seedAdmins();
