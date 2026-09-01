import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import SchoolInfo from "./pages/admin/SchoolInfo";
import AcademicYears from "./pages/admin/AcademicYears";
import CalendarHolidays from "./pages/admin/CalendarHolidays";
import TeacherManagement from "./pages/admin/TeacherManagement";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeaveManagement from "./pages/admin/LeaveManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ClassManagement from "./pages/admin/ClassManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="school" element={<SchoolInfo />} />
          <Route path="academic-years" element={<AcademicYears />} />
          <Route path="calendar" element={<CalendarHolidays />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="classes" element={<ClassManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
