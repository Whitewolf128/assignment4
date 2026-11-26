import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
// You'll need to replace this with your actual service account file name
import serviceAccount from "../assignment4-7c706-firebase-adminsdk-fbsvc-cf1d974000.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const auth: Auth = getAuth();
// get a reference to the firestore database
const db: Firestore = getFirestore();

export { db, auth };
