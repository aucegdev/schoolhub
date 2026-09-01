import { useState, useEffect } from "react";
import { Plus, Trash2, X, Clock, MapPin, Filter } from "lucide-react";
import {
  listTimetable, createTimetableEntry, deleteTimetableEntry,
  type TimetableEntry
} from "../../services/timetable";
import { listClasses, type ClassData } from "../../services/class";
import { listSubjects, type SubjectData } from "../../services/subject";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};
const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
const COLORS = ["bg-blue-100 border-blue-300 text-blue-800", "bg-green-100 border-green-300 text-green-800", "bg-purple-100 border-purple-300 text-purple-800", "bg-amber-100 border-amber-300 text-amber-800", "bg-rose-100 border-rose-300 text-rose-800", "bg-cyan-100 border-cyan-300 text-cyan-800"];

export default function TimetableManagement() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ classId: "", sectionId: "", subjectId: "", teacherId: "", day: "MONDAY", startTime: "09:00", endTime: "09:30", room: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDropdowns(); }, []);
  useEffect(() => { loadTimetable(); }, [filterClass, filterSection, filterDay]);

  async function loadDropdowns() {
    try {
      const [clsData, subData] = await Promise.all([listClasses(), listSubjects()]);
      setClasses(clsData);
      setSubjects(subData.subjects);
    } catch { /* ignore */ }
  }

  async function loadTimetable() {
    try {
      setLoading(true);
      const data = await listTimetable({
        classId: filterClass || undefined,
        sectionId: filterSection || undefined,
        day: filterDay || undefined,
      });
      setEntries(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load timetable" });
    } finally {
      setLoading(false);
    }
  }

  function getSelectedClassSections() {
    const cls = classes.find(c => c.id === form.classId);
    return cls?.sections || [];
  }

  async function handleSave() {
    if (!form.classId || !form.sectionId || !form.subjectId || !form.teacherId) return;
    try {
      setSaving(true);
      await createTimetableEntry(form);
      setMessage({ type: "success", text: "Entry added to timetable" });
      setShowForm(false);
      setForm({ classId: "", sectionId: "", subjectId: "", teacherId: "", day: "MONDAY", startTime: "09:00", endTime: "09:30", room: "" });
      await loadTimetable();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to add entry" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this timetable entry?")) return;
    try {
      await deleteTimetableEntry(id);
      setMessage({ type: "success", text: "Entry removed" });
      await loadTimetable();
    } catch {
      setMessage({ type: "error", text: "Failed to remove entry" });
    }
  }

  // Build grid
  const filteredEntries = filterClass ? entries.filter(e => e.classId === filterClass) : entries;
  const grid: Record<string, Record<string, TimetableEntry[]>> = {};
  for (const day of DAYS) {
    grid[day] = {};
    for (const t of TIME_SLOTS) grid[day][t] = [];
  }
  for (const entry of filteredEntries) {
    if (grid[entry.day]?.[entry.startTime]) {
      grid[entry.day][entry.startTime].push(entry);
    }
  }

  const selectedClass = classes.find(c => c.id === filterClass);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
          <p className="text-slate-500 text-sm mt-1">Weekly class schedule management</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Entry
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
        <div className="flex items-center gap-2 text-sm text-slate-500"><Filter size={14} /> Filter:</div>
        <select value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setFilterSection(""); }} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {filterClass && (
          <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Sections</option>
            {selectedClass?.sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
          </select>
        )}
        <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Days</option>
          {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-20 px-2 py-2 text-xs font-semibold text-slate-500 border-b border-r border-slate-100">Time</th>
                {DAYS.map(d => (
                  <th key={d} className="px-2 py-2 text-xs font-semibold text-slate-500 border-b border-slate-100 text-center">{DAY_LABELS[d]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time) => (
                <tr key={time}>
                  <td className="px-2 py-1 text-xs text-slate-400 border-r border-b border-slate-100 text-center">{time}</td>
                  {DAYS.map(day => {
                    const cellEntries = grid[day]?.[time] || [];
                    return (
                      <td key={day} className="px-1 py-1 border-b border-slate-50 align-top min-h-[48px]">
                        {cellEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className={`group relative rounded-md border px-2 py-1 mb-1 text-xs ${COLORS[entry.subject.name.length % COLORS.length]}`}
                          >
                            <div className="font-semibold truncate">{entry.subject.name}</div>
                            <div className="truncate opacity-75">{entry.teacher.firstName} {entry.teacher.lastName}</div>
                            {entry.room && (
                              <div className="flex items-center gap-0.5 opacity-60"><MapPin size={9} />{entry.room}</div>
                            )}
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-white/80 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            ><Trash2 size={10} className="text-red-500" /></button>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Timetable Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: "" })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select section</option>
                  {getSelectedClassSections().map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teacher ID</label>
                <input type="text" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} placeholder="Enter teacher ID" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                <input type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Room 101" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                <select value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <select value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.classId || !form.sectionId || !form.subjectId || !form.teacherId}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
