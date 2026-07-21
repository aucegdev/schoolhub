import { useEffect, useState } from "react";
import { Teacher, TeacherListResult, listTeachers, createTeacher, updateTeacher, deleteTeacher } from "../../services/teacher";

const emptyTeacher: Teacher = {
  firstName: "", lastName: "", gender: "", qualification: "", specialization: "",
  experience: 0, department: "", designation: "", email: "", phone: "", address: "",
  salary: 0, bankAccount: "", ifscCode: "", status: "ACTIVE",
};

const DEPARTMENTS = ["Science", "Mathematics", "English", "Social Studies", "Computer Science", "Physical Education", "Arts", "Music", "Administration"];
const STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "RESIGNED"];

export default function TeacherManagement() {
  const [result, setResult] = useState<TeacherListResult | null>(null);
  const [teacher, setTeacher] = useState<Teacher>(emptyTeacher);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async (page = 1) => {
    try {
      const data = await listTeachers({ search, status: statusFilter, department: departmentFilter, page });
      setResult(data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await updateTeacher(editingId, teacher);
        setMessage("Teacher updated");
      } else {
        await createTeacher(teacher);
        setMessage("Teacher created");
      }
      setShowForm(false);
      setEditingId(null);
      setTeacher(emptyTeacher);
      await loadTeachers();
    } catch {
      setMessage("Failed to save teacher");
    }
  };

  const handleEdit = (t: Teacher) => {
    setTeacher(t);
    setEditingId(t.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this teacher?")) return;
    try {
      await deleteTeacher(id);
      await loadTeachers();
      setMessage("Teacher deactivated");
    } catch {}
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadTeachers();
  };

  return (
    <div>
      <h1>Teacher Management</h1>
      {message && <p className={message.includes("Failed") ? "error" : "success"}>{message}</p>}

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input placeholder="Search by name, ID, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit">Search</button>
        </form>
        <button className="btn-primary" onClick={() => { setTeacher(emptyTeacher); setEditingId(null); setShowForm(true); }}>+ Add Teacher</button>
      </div>

      {showForm && (
        <div className="module-card" style={{ marginTop: 20 }}>
          <h2>{editingId ? "Edit" : "Add"} Teacher</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input value={teacher.firstName} onChange={(e) => setTeacher({ ...teacher, firstName: e.target.value })} required /></div>
              <div className="form-group"><label>Last Name</label><input value={teacher.lastName} onChange={(e) => setTeacher({ ...teacher, lastName: e.target.value })} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date of Birth</label><input type="date" value={teacher.dateOfBirth?.slice(0, 10) || ""} onChange={(e) => setTeacher({ ...teacher, dateOfBirth: e.target.value })} /></div>
              <div className="form-group">
                <label>Gender</label>
                <select value={teacher.gender || ""} onChange={(e) => setTeacher({ ...teacher, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={teacher.department || ""} onChange={(e) => setTeacher({ ...teacher, department: e.target.value })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Qualification</label><input value={teacher.qualification || ""} onChange={(e) => setTeacher({ ...teacher, qualification: e.target.value })} placeholder="M.Sc, B.Ed" /></div>
              <div className="form-group"><label>Specialization</label><input value={teacher.specialization || ""} onChange={(e) => setTeacher({ ...teacher, specialization: e.target.value })} /></div>
              <div className="form-group"><label>Experience (years)</label><input type="number" value={teacher.experience || 0} onChange={(e) => setTeacher({ ...teacher, experience: parseInt(e.target.value) })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Designation</label><input value={teacher.designation || ""} onChange={(e) => setTeacher({ ...teacher, designation: e.target.value })} placeholder="Senior Teacher" /></div>
              <div className="form-group"><label>Date of Joining</label><input type="date" value={teacher.dateOfJoining?.slice(0, 10) || ""} onChange={(e) => setTeacher({ ...teacher, dateOfJoining: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" value={teacher.email || ""} onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} /></div>
              <div className="form-group"><label>Phone</label><input value={teacher.phone || ""} onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })} /></div>
            </div>
            <div className="form-group"><label>Address</label><textarea value={teacher.address || ""} onChange={(e) => setTeacher({ ...teacher, address: e.target.value })} /></div>
            <div className="form-row">
              <div className="form-group"><label>Salary</label><input type="number" value={teacher.salary || 0} onChange={(e) => setTeacher({ ...teacher, salary: parseFloat(e.target.value) })} /></div>
              <div className="form-group"><label>Bank Account</label><input value={teacher.bankAccount || ""} onChange={(e) => setTeacher({ ...teacher, bankAccount: e.target.value })} /></div>
              <div className="form-group"><label>IFSC Code</label><input value={teacher.ifscCode || ""} onChange={(e) => setTeacher({ ...teacher, ifscCode: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={teacher.status} onChange={(e) => setTeacher({ ...teacher, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">{editingId ? "Update" : "Create"}</button>
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="module-card" style={{ marginTop: 20 }}>
        <h2>Teachers ({result?.total || 0})</h2>
        <table>
          <thead>
            <tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Status</th><th>Phone</th><th></th></tr>
          </thead>
          <tbody>
            {(result?.teachers || []).map((t) => (
              <tr key={t.id}>
                <td>{t.employeeId}</td>
                <td>{t.firstName} {t.lastName}</td>
                <td>{t.department}</td>
                <td>{t.designation}</td>
                <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td>{t.phone}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(t.id!)}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {result && result.totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: result.totalPages }).map((_, i) => (
              <button key={i + 1} className={result.page === i + 1 ? "active" : ""} onClick={() => loadTeachers(i + 1)}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
