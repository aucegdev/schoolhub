import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import SchoolInfo from "./pages/admin/SchoolInfo";
import AcademicYears from "./pages/admin/AcademicYears";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/school" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="school" element={<SchoolInfo />} />
          <Route path="academic-years" element={<AcademicYears />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
