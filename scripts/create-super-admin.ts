
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('../service-account-key.json');

initializeApp({
    credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

async function createSuperAdmin() {
    if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
        console.error("Error: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD environment variables are not configured.");
        return;
    }
    console.log(`Creating/Updating Super Admin: ${SUPER_ADMIN_EMAIL}...`);

    try {
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(SUPER_ADMIN_EMAIL);
            console.log("User exists. Updating password...");
            await auth.updateUser(userRecord.uid, {
                password: SUPER_ADMIN_PASSWORD,
                emailVerified: true,
                displayName: "Super Admin"
            });
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                console.log("User not found. Creating new user...");
                userRecord = await auth.createUser({
                    email: SUPER_ADMIN_EMAIL,
                    password: SUPER_ADMIN_PASSWORD,
                    emailVerified: true,
                    displayName: "Super Admin"
                });
            } else {
                throw error;
            }
        }

        // Set Custom Claims
        await auth.setCustomUserClaims(userRecord.uid, { super_admin: true, role: 'admin' });
        console.log("Set custom claims: { super_admin: true, role: 'admin' }");

        // Create/Update Admin Document in Firestore
        await db.collection('admins').doc(SUPER_ADMIN_EMAIL).set({
            uid: userRecord.uid,
            email: SUPER_ADMIN_EMAIL,
            name: "Super Admin",
            role: "admin",
            isSuperAdmin: true,
            createdAt: new Date().toISOString()
        }, { merge: true });

        console.log("Successfully setup Super Admin!");

    } catch (error) {
        console.error("Error creating Super Admin:", error);
    }
}

createSuperAdmin();
