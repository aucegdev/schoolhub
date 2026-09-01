import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SchoolInfo from "./pages/admin/SchoolInfo";
import AcademicYears from "./pages/admin/AcademicYears";
import CalendarHolidays from "./pages/admin/CalendarHolidays";
import TeacherManagement from "./pages/admin/TeacherManagement";
import TimetableManagement from "./pages/admin/TimetableManagement";
import LeaveManagement from "./pages/admin/LeaveManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import ExamManagement from "./pages/admin/ExamManagement";
import FeesManagement from "./pages/admin/FeesManagement";
import LoginPage from "./pages/auth/LoginPage";
import { getStoredToken } from "./services/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(getStoredToken());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="school" element={<SchoolInfo />} />
          <Route path="academic-years" element={<AcademicYears />} />
          <Route path="calendar" element={<CalendarHolidays />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="timetable" element={<TimetableManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="fees" element={<FeesManagement />} />
          <Route path="leave" element={<LeaveManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;