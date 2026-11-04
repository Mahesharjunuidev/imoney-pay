import type { RequestData } from "./voice-form-utils";

export type VoiceRecord = {
  id: string;
  createdAt: string;
  answers: RequestData;
  transcript: string[];
  audio: Blob | null;
  captions: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("voice-form-records", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("requests", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Browser storage is unavailable."));
    request.onblocked = () => reject(new Error("Browser storage is blocked by another tab."));
  });
}

export async function loadVoiceRecords(): Promise<VoiceRecord[]> {
  const database = await openDatabase();
  try {
    return await new Promise<VoiceRecord[]>((resolve, reject) => {
      const transaction = database.transaction("requests", "readonly");
      const request = transaction.objectStore("requests").getAll();
      transaction.oncomplete = () => resolve((request.result as VoiceRecord[]).sort((first, second) => second.createdAt.localeCompare(first.createdAt)));
      transaction.onabort = () => reject(transaction.error ?? new Error("Could not load saved requests."));
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not load saved requests."));
    });
  } finally {
    database.close();
  }
}

export async function saveVoiceRecord(record: VoiceRecord): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("requests", "readwrite");
      transaction.objectStore("requests").put(record);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error("Could not save this request."));
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not save this request."));
    });
  } finally {
    database.close();
  }
}

export async function deleteVoiceRecord(id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("requests", "readwrite");
      transaction.objectStore("requests").delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error("Could not delete this request."));
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not delete this request."));
    });
  } finally {
    database.close();
  }
}