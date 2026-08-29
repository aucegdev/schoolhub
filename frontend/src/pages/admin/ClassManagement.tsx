import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight, Users, BookOpen } from "lucide-react";
import {
  listClasses, createClass, updateClass, deleteClass,
  addSection, updateSection, deleteSection,
  type ClassData
} from "../../services/class";

export default function ClassManagement() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // Class form state
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [className, setClassName] = useState("");

  // Section form state
  const [showSectionForm, setShowSectionForm] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{ classId: string; sectionId: string; name: string } | null>(null);
  const [sectionName, setSectionName] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => { loadClasses(); }, []);

  async function loadClasses() {
    try {
      setLoading(true);
      const data = await listClasses();
      setClasses(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load classes" });
    } finally {
      setLoading(false);
    }
  }

  function resetClassForm() {
    setClassName("");
    setEditingClass(null);
    setShowClassForm(false);
  }

  function resetSectionForm() {
    setSectionName("");
    setEditingSection(null);
    setShowSectionForm(null);
  }

  async function handleSaveClass() {
    if (!className.trim()) return;
    try {
      setSaving(true);
      if (editingClass) {
        await updateClass(editingClass.id, { name: className.trim() });
        setMessage({ type: "success", text: "Class updated" });
      } else {
        await createClass({ name: className.trim() });
        setMessage({ type: "success", text: "Class created" });
      }
      resetClassForm();
      await loadClasses();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to save class" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteClass(id: string) {
    if (!confirm("Delete this class and all its sections?")) return;
    try {
      await deleteClass(id);
      setMessage({ type: "success", text: "Class deleted" });
      await loadClasses();
    } catch {
      setMessage({ type: "error", text: "Failed to delete class" });
    }
  }

  async function handleSaveSection() {
    if (!sectionName.trim() || !showSectionForm) return;
    try {
      setSaving(true);
      if (editingSection) {
        await updateSection(editingSection.classId, editingSection.sectionId, { name: sectionName.trim() });
        setMessage({ type: "success", text: "Section updated" });
      } else {
        await addSection(showSectionForm, { name: sectionName.trim() });
        setMessage({ type: "success", text: "Section added" });
      }
      resetSectionForm();
      await loadClasses();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to save section" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSection(classId: string, sectionId: string) {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteSection(classId, sectionId);
      setMessage({ type: "success", text: "Section deleted" });
      await loadClasses();
    } catch {
      setMessage({ type: "error", text: "Failed to delete section" });
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes & Sections</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school classes and their sections</p>
        </div>
        <button
          onClick={() => { resetClassForm(); setShowClassForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Class
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

      {/* Class Form Modal */}
      {showClassForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingClass ? "Edit Class" : "Add Class"}</h2>
              <button onClick={resetClassForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 10, Class 12"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={resetClassForm} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={handleSaveClass}
                  disabled={saving || !className.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingClass ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Form Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingSection ? "Edit Section" : "Add Section"}</h2>
              <button onClick={resetSectionForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section Name</label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. A, B, C"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={resetSectionForm} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={handleSaveSection}
                  disabled={saving || !sectionName.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSection ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Class List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <BookOpen className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-500 font-medium">No classes yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first class to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {/* Class Header */}
              <div
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer"
                onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedClass === cls.id ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                  <div>
                    <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                    <p className="text-xs text-slate-500">{cls.sections.length} section{cls.sections.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setEditingClass(cls); setClassName(cls.name); setShowClassForm(true); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  ><Pencil size={14} /></button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  ><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Sections */}
              {expandedClass === cls.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                  {cls.sections.length === 0 ? (
                    <p className="text-sm text-slate-400 py-2">No sections yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {cls.sections.map((sec) => (
                        <div key={sec.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">Section {sec.name}</span>
                            {sec.classTeacher && (
                              <span className="text-xs text-slate-400">
                                ({sec.classTeacher.teacher.firstName} {sec.classTeacher.teacher.lastName})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingSection({ classId: cls.id, sectionId: sec.id, name: sec.name });
                                setSectionName(sec.name);
                                setShowSectionForm(cls.id);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            ><Pencil size={12} /></button>
                            <button
                              onClick={() => handleDeleteSection(cls.id, sec.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            ><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { resetSectionForm(); setShowSectionForm(cls.id); }}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
