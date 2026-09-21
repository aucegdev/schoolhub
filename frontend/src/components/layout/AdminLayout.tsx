import { Outlet, useNavigate, Link } from "react-router-dom";
import { signOutWithGoogle } from "../../services/auth";
import NotificationCenter from "./NotificationCenter";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutWithGoogle();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/", label: "🌐 Public Portal", external: true },
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/school", label: "School Info" },
    { to: "/admin/academic-years", label: "Academic Years" },
    { to: "/admin/calendar", label: "Calendar & Holidays" },
    { to: "/admin/students", label: "Students" },
    { to: "/admin/teachers", label: "Teachers" },
    { to: "/admin/classes", label: "Classes & Sections" },
    { to: "/admin/subjects", label: "Subjects" },
    { to: "/admin/timetable", label: "Timetable" },
    { to: "/admin/attendance", label: "Attendance" },
    { to: "/admin/exams", label: "Examinations" },
    { to: "/admin/fees", label: "Fees & Billing" },
    { to: "/admin/leave", label: "Leave Requests" },
    { to: "/admin/notices", label: "Notices" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/communication", label: "Communication" },
    { to: "/admin/reports", label: "Reports & Analytics" },
    { to: "/admin/transport", label: "Transport" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>SchoolHub</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                {item.external ? (
                  <a href={item.to} target="_blank" rel="noreferrer">{item.label}</a>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" onClick={handleLogout} style={{ marginTop: 16, padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-400">SchoolHub Admin Workspace</span>
          <NotificationCenter />
        </div>
        <Outlet />
      </main>
    </div>
  );
}