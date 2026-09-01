import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Quote,
} from "lucide-react";
import { EDUCATIONAL_QUOTES } from "../../utils/quotes";

export interface DashboardConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  quoteIndex: number;
  featuredModules: string[];
  widgetOrder: string[];
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  heroTitle: "Empowering Next-Generation Leaders Through Digital Excellence",
  heroSubtitle: "SchoolHub provides a modern, unified platform for academic management, student tracking, examinations, and seamless communication.",
  announcement: "🎉 Admissions open for Academic Year 2026-2027! Register for campus tour and entrance assessment.",
  quoteIndex: 0,
  featuredModules: ["students", "attendance", "exams", "timetable", "fees"],
  widgetOrder: ["announcement", "stats", "features", "quote", "admissions"],
};

export default function SchoolHome() {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD_CONFIG);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Load config from localStorage if available
    const saved = localStorage.getItem("schoolhub_dashboard_config_v1");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }

    // Simulate smooth loading transition
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % EDUCATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = EDUCATIONAL_QUOTES[quoteIndex] || EDUCATIONAL_QUOTES[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-xl font-bold tracking-wide animate-pulse">Loading SchoolHub Portal...</div>
        <div className="mt-4 max-w-md italic text-slate-400 text-sm animate-fade-in">
          "{currentQuote.quote}" — <span className="text-indigo-400 font-semibold">{currentQuote.author}</span>
        </div>
      </div>
    );
  }

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "announcement":
        return config.announcement ? (
          <div key="announcement" className="bg-gradient-to-r from-amber-500 to-indigo-600 text-white px-4 py-3 text-center text-sm font-medium shadow-md animate-fade-in">
            <span className="inline-block mr-2 font-bold bg-white/20 px-2 py-0.5 rounded text-xs">NOTICE</span>
            {config.announcement}
          </div>
        ) : null;

      case "stats":
        return (
          <div key="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Enrolled Students", count: "1,250+", icon: Users, color: "from-blue-500 to-indigo-600" },
                { label: "Expert Faculty", count: "85+", icon: GraduationCap, color: "from-purple-500 to-pink-600" },
                { label: "Academic Courses", count: "40+", icon: BookOpen, color: "from-emerald-500 to-teal-600" },
                { label: "Board Pass Rate", count: "99.4%", icon: Award, color: "from-amber-500 to-orange-600" },
              ].map((st, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <st.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800">{st.count}</div>
                  <div className="text-sm font-medium text-slate-500 mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "features":
        return (
          <div key="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">Institutional Excellence</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-3">Smart Management Modules</h2>
              <p className="text-slate-500 text-sm mt-2">Integrated tools designed for administrators, teachers, students, and parents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Student Directory & Admissions", desc: "Complete digital records, class assignments, and guardian information.", icon: Users, badge: "P0 Core" },
                { title: "Attendance & Monitoring", desc: "Real-time daily attendance tracking with automated summary analytics.", icon: CheckCircle2, badge: "Live Tracking" },
                { title: "Exams & Result Publishing", desc: "Unit test, midterm, and final exam scheduling with instant evaluation.", icon: Award, badge: "Academic" },
                { title: "Timetable & Scheduling", desc: "Conflict-free weekly schedule builder for teachers and classes.", icon: Clock, badge: "Automation" },
                { title: "Fee & Billing Operations", desc: "Structure management, digital receipts, and payment status tracking.", icon: Sparkles, badge: "Finance" },
                { title: "Role-Based Security", desc: "JWT and Firebase-backed stateless access for Administrators and Faculty.", icon: ShieldCheck, badge: "Enterprise" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-lg transition space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{item.badge}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "quote":
        return (
          <div key="quote" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <Quote className="w-24 h-24 absolute -right-6 -bottom-6 text-white/5" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Thought of the Day</span>
                <p className="text-xl md:text-2xl font-serif italic text-slate-100">"{currentQuote.quote}"</p>
                <div className="text-sm font-semibold text-indigo-300">— {currentQuote.author}</div>
              </div>
            </div>
          </div>
        );

      case "admissions":
        return (
          <div key="admissions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
            <div className="bg-indigo-600 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl font-extrabold">Ready to Experience SchoolHub?</h2>
                <p className="text-indigo-100 text-sm max-w-xl">Sign in to your account or access administrative tools to manage school operations efficiently.</p>
              </div>
              <Link
                to="/login"
                className="bg-white text-indigo-700 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl shadow-lg transition flex items-center gap-2 whitespace-nowrap"
              >
                Access Portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">SchoolHub</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <LogIn className="w-4 h-4" /> Portal Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official School Management Hub
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            {config.heroTitle}
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition flex items-center gap-2"
            >
              Admin & Staff Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Widget Order Rendering */}
      {config.widgetOrder.map((widgetId) => renderWidget(widgetId))}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="font-bold text-white text-lg">SchoolHub — Smart School Management System</div>
          <p className="text-xs text-slate-500">Continuous Integration & Deployment Ready • Powered by React, Node, Express, Prisma & Docker</p>
        </div>
      </footer>
    </div>
  );
}
