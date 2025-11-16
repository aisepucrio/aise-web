/* === SIMPLE FIRESTORE REPOSITORY === */
import { db } from "./firebaseAdmin";

const COLLECTION = "siteContent";

function resolveKey(key: string) {
  const parts = key.split("/").filter(Boolean);

  if (parts.length >= 2) {
    const collection = parts[0];
    const filename = parts[parts.length - 1];
    const docId = filename.replace(/\.json$/i, "");
    return { collection, docId };
  }

  return { collection: COLLECTION, docId: key.replace(/\.json$/i, "") };
}

export type JsonValue = any;

export async function getJsonByKey(key: string): Promise<JsonValue | null> {
  const { collection, docId } = resolveKey(key);
  const docRef = db.collection(collection).doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const data = snap.data();
  return (data as any)?.payload ?? null;
}

export async function setJsonByKey(key: string, payload: JsonValue): Promise<void> {
  const { collection, docId } = resolveKey(key);
  const docRef = db.collection(collection).doc(docId);
  await docRef.set({ payload, updatedAt: new Date().toISOString() }, { merge: true });
}
