import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getStoredToken, signInWithGoogle, signOutWithGoogle } from "../services/auth";

interface AuthContextType {
  token: string | null;
  user: { uid: string; email: string | null } | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
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
      // Firebase user info would come from onAuthStateChanged listener
      // For now, just set token presence
    }
    setLoading(false);
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

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: Boolean(token), loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}