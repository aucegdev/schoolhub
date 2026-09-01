import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>SchoolHub</h2>
        <nav>
          <ul>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/school">School Info</a></li>
            <li><a href="/admin/academic-years">Academic Years</a></li>
            <li><a href="/admin/calendar">Calendar & Holidays</a></li>
            <li><a href="/admin/teachers">Teachers</a></li>
            <li><a href="/admin/classes">Classes & Sections</a></li>
            <li><a href="/admin/subjects">Subjects</a></li>
            <li><a href="/admin/timetable">Timetable</a></li>
            <li><a href="/admin/leave">Leave Requests</a></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}