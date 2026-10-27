import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { signOutWithGoogle } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getPreviewUserId, listPreviewUsers, setPreviewUserId, type PreviewUser } from "../../services/devPreview";
import NotificationCenter from "./NotificationCenter";
import {
  LayoutDashboard, GraduationCap, Users, School, BookOpen,
  CalendarDays, ClipboardList, CreditCard, FileText, Settings,
  Bus, MessageSquare, Megaphone, CalendarPlus, Globe,
  ChevronRight, LogOut, ChevronDown, UserRound,
} from "lucide-react";

const SIDEBAR_NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Academics",
    items: [
      { to: "/admin/students", label: "Students", icon: GraduationCap },
      { to: "/admin/teachers", label: "Teachers", icon: Users },
      { to: "/admin/classes", label: "Classes & Sections", icon: School },
      { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
      { to: "/admin/attendance", label: "Attendance", icon: ClipboardList },
      { to: "/admin/exams", label: "Examinations", icon: FileText },
      { to: "/admin/timetable", label: "Timetable", icon: CalendarDays },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/admin/fees", label: "Fees & Billing", icon: CreditCard },
      { to: "/admin/transport", label: "Transport", icon: Bus },
      { to: "/admin/notices", label: "Notices", icon: Megaphone },
      { to: "/admin/events", label: "Events", icon: CalendarPlus },
      { to: "/admin/communication", label: "Communication", icon: MessageSquare },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/reports", label: "Reports", icon: FileText },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [previewUsers, setPreviewUsers] = useState<PreviewUser[]>([]);
  const [previewUserId, setPreviewUserIdState] = useState<string | null>(getPreviewUserId());
  const isDevelopmentPreview = import.meta.env.DEV && isSuperAdmin;
  const previewUser = previewUsers.find((preview) => preview.id === previewUserId);

  useEffect(() => {
    if (!isDevelopmentPreview) return;

    listPreviewUsers()
      .then(setPreviewUsers)
      .catch((error) => console.error("Unable to load development preview users", error));
  }, [isDevelopmentPreview]);

  const handlePreviewChange = (nextUserId: string) => {
    const nextPreviewUserId = nextUserId || null;
    setPreviewUserId(nextPreviewUserId);
    setPreviewUserIdState(nextPreviewUserId);
    setProfileOpen(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    await signOutWithGoogle();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/80">
      {/* Sidebar */}
      <aside className="sidebar-enhanced w-64 h-full bg-slate-900 text-slate-300 flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight tracking-tight">SchoolHub</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation groups */}
        <nav className="flex-1 px-3 pb-2 space-y-5">
          {SIDEBAR_NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/admin/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-slate-300"}`} />
                          <span className="truncate">{item.label}</span>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-300" />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Public portal link */}
        <div className="px-3 pb-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-150"
          >
            <Globe className="w-4 h-4" />
            <span>Public Portal</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 h-full overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
          <div className="flex items-center justify-between px-6 lg:px-8 h-14">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Admin Workspace
              </span>
              {isSuperAdmin && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Super admin
                </span>
              )}
              {user?.email && <span className="hidden text-xs text-slate-500 sm:inline">{user.email}</span>}
            </div>
            <div className="relative flex items-center gap-3">
              <NotificationCenter />
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm hover:border-slate-300"
              >
                <UserRound className="h-4 w-4 text-slate-500" />
                <span className="hidden max-w-40 truncate text-xs font-medium text-slate-700 sm:inline">{previewUser?.email ?? user?.email ?? "Account"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 z-40 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl" role="menu">
                  <div className="mb-3 border-b border-slate-100 pb-3">
                    <p className="text-xs font-semibold text-slate-900">Signed in as</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{user?.email ?? "Unknown account"}</p>
                  </div>
                  {isDevelopmentPreview ? (
                    <label className="block text-xs font-semibold text-slate-600">
                      Switch user
                      <select
                        value={previewUserId ?? ""}
                        onChange={(event) => handlePreviewChange(event.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-500"
                      >
                        <option value="">My super-admin account</option>
                        {previewUsers.map((preview) => (
                          <option key={preview.id} value={preview.id}>
                            {preview.role} · {preview.email}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="text-xs leading-5 text-slate-500">User switching is available only in development.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
