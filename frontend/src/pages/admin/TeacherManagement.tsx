import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, Phone, Mail } from "lucide-react";
import {
  listTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  type Teacher,
  type TeacherListResult,
} from "../../services/teacher";

const emptyTeacher: Teacher = {
  firstName: "",
  lastName: "",
  gender: "",
  qualification: "",
  specialization: "",
  experience: 0,
  department: "",
  designation: "",
  email: "",
  phone: "",
  address: "",
  salary: 0,
  bankAccount: "",
  ifscCode: "",
  status: "ACTIVE",
};

const DEPARTMENTS = ["Science", "Mathematics", "English", "Social Studies", "Computer Science", "Physical Education", "Arts", "Music", "Administration"];
const STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "RESIGNED"];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  ON_LEAVE: "bg-amber-100 text-amber-700",
  RESIGNED: "bg-red-100 text-red-700",
};

export default function TeacherManagement() {
  const [result, setResult] = useState<TeacherListResult | null>(null);
  const [teacher, setTeacher] = useState<Teacher>(emptyTeacher);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { loadTeachers(); }, [search, statusFilter, departmentFilter, page]);

  const loadTeachers = async () => {
    try {
      const data = await listTeachers({ search, status: statusFilter, department: departmentFilter, page });
      setResult(data);
    } catch {
      setMessage("Failed to load teachers");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await updateTeacher(editingId, teacher);
        setMessage("Teacher updated successfully");
      } else {
        await createTeacher(teacher);
        setMessage("Teacher created successfully");
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
    } catch {
      setMessage("Failed to deactivate teacher");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Teacher Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage teaching staff, assignments, and departments</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm items-end">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, employee ID, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            onKeyDown={(e) => e.key === "Enter" && loadTeachers()}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button
          onClick={() => { setTeacher(emptyTeacher); setEditingId(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm"
        >
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Teacher" : "New Teacher"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                  <input required value={teacher.firstName} onChange={(e) => setTeacher({ ...teacher, firstName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                  <input required value={teacher.lastName} onChange={(e) => setTeacher({ ...teacher, lastName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                  <input type="date" value={teacher.dateOfBirth?.slice(0, 10) || ""} onChange={(e) => setTeacher({ ...teacher, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                  <select value={teacher.gender || ""} onChange={(e) => setTeacher({ ...teacher, gender: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <select value={teacher.department || ""} onChange={(e) => setTeacher({ ...teacher, department: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option value="">Select</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qualification</label>
                  <input value={teacher.qualification || ""} onChange={(e) => setTeacher({ ...teacher, qualification: e.target.value })} placeholder="M.Sc, B.Ed" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization</label>
                  <input value={teacher.specialization || ""} onChange={(e) => setTeacher({ ...teacher, specialization: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Experience (years)</label>
                  <input type="number" value={teacher.experience || 0} onChange={(e) => setTeacher({ ...teacher, experience: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
                  <input value={teacher.designation || ""} onChange={(e) => setTeacher({ ...teacher, designation: e.target.value })} placeholder="Senior Teacher" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Joining</label>
                  <input type="date" value={teacher.dateOfJoining?.slice(0, 10) || ""} onChange={(e) => setTeacher({ ...teacher, dateOfJoining: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input type="email" value={teacher.email || ""} onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                  <input value={teacher.phone || ""} onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Salary (INR)</label>
                  <input type="number" value={teacher.salary || 0} onChange={(e) => setTeacher({ ...teacher, salary: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bank Account</label>
                  <input value={teacher.bankAccount || ""} onChange={(e) => setTeacher({ ...teacher, bankAccount: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                <textarea value={teacher.address || ""} onChange={(e) => setTeacher({ ...teacher, address: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={teacher.status} onChange={(e) => setTeacher({ ...teacher, status: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{editingId ? "Update Teacher" : "Create Teacher"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="font-semibold text-slate-800">Teachers ({result?.total || 0})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(result?.teachers || []).length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No teachers found.</td></tr>
              ) : (
                (result?.teachers || []).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono text-xs text-slate-500">{t.employeeId || "—"}</td>
                    <td className="p-4 font-medium text-slate-800">{t.firstName} {t.lastName}</td>
                    <td className="p-4 text-slate-600">{t.department || "—"}</td>
                    <td className="p-4 text-slate-600">{t.designation || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[t.status] || "bg-slate-100 text-slate-600"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {t.email || "—"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3" /> {t.phone || "—"}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id!)} className="p-1.5 text-slate-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50">Prev</button>
            <span className="text-sm text-slate-600">Page {page} of {result.totalPages}</span>
            <button disabled={page >= result.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
