import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getStoredToken, signInWithGoogle, signOutWithGoogle } from "../services/auth";
import { auth } from "../config/firebase";

const SUPER_ADMIN_EMAIL = "kathirkalidass005@gmail.com";

interface AuthContextType {
  token: string | null;
  user: { uid: string; email: string | null } | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isSuperAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setToken(stored);
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const nextToken = await firebaseUser.getIdToken();
      localStorage.setItem("token", nextToken);
      setToken(nextToken);
      setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login() {
    const result = await signInWithGoogle();
    setToken(getStoredToken());
    setUser({ uid: result.uid, email: result.email });
  }

  async function logout() {
    await signOutWithGoogle();
    setToken(null);
    setUser(null);
  }

  const isSuperAdmin = user?.email?.trim().toLowerCase() === SUPER_ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: Boolean(token), isSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}