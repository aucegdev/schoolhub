import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

export async function signInWithGoogle(): Promise<{ uid: string; email: string | null }> {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured. Add VITE_FIREBASE_* variables to your frontend environment.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();
  localStorage.setItem("token", token);

  return {
    uid: result.user.uid,
    email: result.user.email,
  };
}

export async function signOutWithGoogle(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }

  localStorage.removeItem("token");
}
