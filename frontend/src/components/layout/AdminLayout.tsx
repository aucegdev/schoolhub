import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { signOutWithGoogle } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getPreviewUserId, listPreviewUsers, setPreviewUserId, type PreviewUser } from "../../services/devPreview";
import NotificationCenter from "./NotificationCenter";
import {
  LayoutDashboard, GraduationCap, Users, School, BookOpen,
  CalendarDays, ClipboardList, CreditCard, FileText, Settings,
  Bus, MessageSquare, Megaphone, CalendarPlus, Globe,
  ChevronRight, LogOut, Menu, X as CloseIcon,ChevronDown, UserRound,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false); }, []);
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

  const NavContent = () => (
    <>
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
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/80">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex sidebar-enhanced w-64 h-full bg-slate-900 text-slate-300 flex-col shrink-0 overflow-y-auto">
        {NavContent()}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-slate-900 text-slate-300 flex flex-col overflow-y-auto animate-slide-in-left">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <School className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-white font-bold text-base">SchoolHub</h1>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            {NavContent()}
          </aside>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 h-full overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left section */}
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                className="-ml-2 rounded-lg p-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">
                Admin Workspace
              </span>

              {isSuperAdmin && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Super admin
                </span>
              )}

              {user?.email && (
                <span className="hidden max-w-48 truncate text-xs text-slate-500 md:inline">
                  {user.email}
                </span>
              )}
            </div>

            {/* Right section */}
            <div className="flex shrink-0 items-center gap-3">
              <NotificationCenter />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  aria-controls="admin-profile-menu"
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-slate-300"
                >
                  <UserRound className="h-4 w-4 text-slate-500" />

                  <span className="hidden max-w-40 truncate text-xs font-medium text-slate-700 sm:inline">
                    {previewUser?.email ?? user?.email ?? "Account"}
                  </span>

                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    id="admin-profile-menu"
                    role="menu"
                    className="absolute right-0 top-11 z-40 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                  >
                    <div className="mb-3 border-b border-slate-100 pb-3">
                      <p className="text-xs font-semibold text-slate-900">
                        Signed in as
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user?.email ?? "Unknown account"}
                      </p>
                    </div>

                    {isDevelopmentPreview ? (
                      <label className="block text-xs font-semibold text-slate-600">
                        Switch user

                        <select
                          value={previewUserId ?? ""}
                          onChange={(event) =>
                            handlePreviewChange(event.target.value)
                          }
                          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="">
                            My super-admin account
                          </option>

                          {previewUsers.map((preview) => (
                            <option key={preview.id} value={preview.id}>
                              {preview.role} · {preview.email}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <p className="text-xs leading-5 text-slate-500">
                        User switching is available only in development.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main page content */}
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
