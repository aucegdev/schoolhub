import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

function buildFirebaseConfig() {
  const env = (key: string) => import.meta.env?.[key] || "";

  const raw: Record<string, string> = {
    VITE_FIREBASE_API_KEY: env("VITE_FIREBASE_API_KEY"),
    VITE_FIREBASE_AUTH_DOMAIN: env("VITE_FIREBASE_AUTH_DOMAIN"),
    VITE_FIREBASE_PROJECT_ID: env("VITE_FIREBASE_PROJECT_ID"),
    VITE_FIREBASE_STORAGE_BUCKET: env("VITE_FIREBASE_STORAGE_BUCKET"),
    VITE_FIREBASE_MESSAGING_SENDER_ID: env("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    VITE_FIREBASE_APP_ID: env("VITE_FIREBASE_APP_ID"),
    VITE_FIREBASE_MEASUREMENT_ID: env("VITE_FIREBASE_MEASUREMENT_ID"),
  };

  const firebaseConfig = {
    apiKey: raw.VITE_FIREBASE_API_KEY,
    authDomain: raw.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: raw.VITE_FIREBASE_PROJECT_ID,
    storageBucket: raw.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: raw.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: raw.VITE_FIREBASE_APP_ID,
    measurementId: raw.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const hasFirebaseConfig = Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

  return { firebaseConfig, hasFirebaseConfig, raw };
}

const { firebaseConfig, hasFirebaseConfig } = buildFirebaseConfig();

export const firebaseApp =
  hasFirebaseConfig && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0] ?? null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = auth ? new GoogleAuthProvider() : null;
