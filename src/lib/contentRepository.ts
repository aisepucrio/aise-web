/* === SIMPLE FIRESTORE REPOSITORY === */
import { db } from "./firebaseAdmin";

const COLLECTION = "siteContent";

export type JsonValue = any;

export async function getJsonByKey(key: string): Promise<JsonValue | null> {
  const docRef = db.collection(COLLECTION).doc(key);
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const data = snap.data();
  return (data as any)?.payload ?? null;
}

export async function setJsonByKey(
  key: string,
  payload: JsonValue
): Promise<void> {
  const docRef = db.collection(COLLECTION).doc(key);
  await docRef.set(
    { payload, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}
