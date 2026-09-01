import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit2, Phone, Mail } from "lucide-react";
import {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  type Student,
} from "../../services/student";
import { listClasses, type ClassData } from "../../services/class";

const emptyStudent: Student = {
  admissionNo: "",
  firstName: "",
  lastName: "",
  gender: "MALE",
  email: "",
  phone: "",
  address: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  status: "ACTIVE",
};

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<Student>(emptyStudent);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [search, selectedClass]);

  const loadData = async () => {
    try {
      const [res, classList] = await Promise.all([
        listStudents({ search, classId: selectedClass }),
        listClasses(),
      ]);
      setStudents(res.students);
      setClasses(classList);
    } catch {}
  };

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setForm(student);
    } else {
      setEditingStudent(null);
      setForm({ ...emptyStudent, admissionNo: `ADM-${Date.now().toString().slice(-4)}` });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingStudent?.id) {
        await updateStudent(editingStudent.id, form);
        setMessage("Student updated successfully");
      } else {
        await createStudent(form);
        setMessage("Student created successfully");
      }
      setIsModalOpen(false);
      await loadData();
    } catch {
      setMessage("Failed to save student");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      await loadData();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
          <p className="text-sm text-slate-500">Manage student records, admissions, and class enrollments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or admission no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Admission No</th>
                <th className="p-4">Class</th>
                <th className="p-4">Guardian Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{st.firstName} {st.lastName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {st.email || "No email"}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{st.admissionNo}</td>
                    <td className="p-4 text-slate-600">
                      {st.class?.name || "Unassigned"} {st.section?.name ? `(${st.section.name})` : ""}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700 font-medium">{st.guardianName || "N/A"}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {st.guardianPhone || "No phone"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${st.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(st)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(st.id!)} className="p-1.5 text-slate-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800">
              {editingStudent ? "Edit Student" : "New Student Admission"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Admission No</label>
                  <input
                    required
                    value={form.admissionNo}
                    onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Roll Number</label>
                  <input
                    value={form.rollNumber || ""}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                  <select
                    value={form.classId || ""}
                    onChange={(e) => setForm({ ...form, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Name</label>
                  <input
                    value={form.guardianName || ""}
                    onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Phone</label>
                  <input
                    value={form.guardianPhone || ""}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Email</label>
                  <input
                    type="email"
                    value={form.guardianEmail || ""}
                    onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
