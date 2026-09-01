import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Search, BookOpen, GraduationCap } from "lucide-react";
import {
  listSubjects, createSubject, updateSubject, deleteSubject,
  type SubjectData
} from "../../services/subject";

const TYPE_COLORS: Record<string, string> = {
  CORE: "bg-blue-100 text-blue-700",
  ELECTIVE: "bg-purple-100 text-purple-700",
  LANGUAGE: "bg-green-100 text-green-700",
};

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SubjectData | null>(null);
  const [form, setForm] = useState({ name: "", code: "", type: "CORE" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSubjects(); }, [search, typeFilter]);

  async function loadSubjects() {
    try {
      setLoading(true);
      const data = await listSubjects({ search: search || undefined, type: typeFilter || undefined });
      setSubjects(data.subjects);
    } catch {
      setMessage({ type: "error", text: "Failed to load subjects" });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ name: "", code: "", type: "CORE" });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(s: SubjectData) {
    setEditing(s);
    setForm({ name: s.name, code: s.code || "", type: s.type || "CORE" });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    try {
      setSaving(true);
      if (editing) {
        await updateSubject(editing.id, { name: form.name.trim(), code: form.code.trim() || undefined, type: form.type });
        setMessage({ type: "success", text: "Subject updated" });
      } else {
        await createSubject({ name: form.name.trim(), code: form.code.trim() || undefined, type: form.type });
        setMessage({ type: "success", text: "Subject created" });
      }
      resetForm();
      await loadSubjects();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to save subject" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this subject?")) return;
    try {
      await deleteSubject(id);
      setMessage({ type: "success", text: "Subject deleted" });
      await loadSubjects();
    } catch {
      setMessage({ type: "error", text: "Failed to delete subject" });
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage academic subjects and their types</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right ml-2 text-current opacity-50 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="CORE">Core</option>
          <option value="ELECTIVE">Elective</option>
          <option value="LANGUAGE">Language</option>
        </select>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editing ? "Edit Subject" : "Add Subject"}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Mathematics, Physics"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. MATH101, PHY101"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CORE">Core</option>
                  <option value="ELECTIVE">Elective</option>
                  <option value="LANGUAGE">Language</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={resetForm} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teachers</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3"><div className="h-5 bg-slate-100 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <BookOpen className="mx-auto text-slate-300 mb-2" size={40} />
                  <p className="text-slate-500 font-medium">No subjects found</p>
                  <p className="text-slate-400 text-sm">Create your first subject to get started</p>
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-500 font-mono">{s.code || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[s.type || "CORE"] || "bg-slate-100 text-slate-600"}`}>
                      {s.type || "CORE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-slate-500">{s._count.teachers}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(s)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
