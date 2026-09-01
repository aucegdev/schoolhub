import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Google login failed", error);
      alert(error instanceof Error ? error.message : "Google login failed. Please check Firebase configuration.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        padding: 28,
      }}>
        <div style={{ marginBottom: 18 }}>
          <p style={{ margin: 0, color: "#0f172a", fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700 }}>
            SchoolHub
          </p>
          <h1 style={{ margin: "10px 0 8px", fontSize: 32, color: "#0f172a" }}>Welcome back</h1>
          <p style={{ margin: 0, color: "#475569", fontSize: 15 }}>
            Use Google login to access the admin portal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            border: "1px solid #dbeafe",
            background: "#111827",
            color: "#ffffff",
            borderRadius: 12,
            padding: "14px 18px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <div style={{ marginTop: 16, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
          Firebase sign-in is enabled for local and Azure deployments when the proper <code>VITE_FIREBASE_*</code> values are configured.
        </div>
      </div>
    </div>
  );
}
