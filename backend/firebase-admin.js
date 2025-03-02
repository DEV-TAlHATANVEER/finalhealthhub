import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(new URL("./serviceAccountKey.json", import.meta.url))
);

// Initialize Firebase Admin once
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
