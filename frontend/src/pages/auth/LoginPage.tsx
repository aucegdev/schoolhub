import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100 p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">SchoolHub</p>
          <h1 className="text-3xl font-bold text-slate-900 text-center">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2 text-center max-w-xs">
            Sign in with your Google account to access the admin portal
          </p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          Firebase sign-in enabled for local and Azure deployments.
          <br />
          Configure <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono text-[10px]">VITE_FIREBASE_*</code> env vars to activate.
        </p>
      </div>
    </div>
  );
}
