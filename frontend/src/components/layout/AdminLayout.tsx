import { Outlet, useNavigate } from "react-router-dom";
import { signOutWithGoogle } from "../../services/auth";
import NotificationCenter from "./NotificationCenter";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutWithGoogle();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>SchoolHub</h2>
        <nav>
          <ul>
            <li><a href="/" target="_blank" rel="noreferrer">🌐 View Public Portal</a></li>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/dashboard-customizer">✨ Customizer Engine</a></li>
            <li><a href="/admin/school">School Info</a></li>
            <li><a href="/admin/academic-years">Academic Years</a></li>
            <li><a href="/admin/calendar">Calendar & Holidays</a></li>
            <li><a href="/admin/students">Students</a></li>
            <li><a href="/admin/teachers">Teachers</a></li>
            <li><a href="/admin/classes">Classes & Sections</a></li>
            <li><a href="/admin/subjects">Subjects</a></li>
            <li><a href="/admin/timetable">Timetable</a></li>
            <li><a href="/admin/attendance">Attendance</a></li>
            <li><a href="/admin/exams">Examinations</a></li>
            <li><a href="/admin/fees">Fees & Billing</a></li>
            <li><a href="/admin/leave">Leave Requests</a></li>
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