import { useState, useEffect } from "react";
import { Plus, Trash2, Megaphone } from "lucide-react";
import { listNotices, createNotice, deleteNotice, type Notice } from "../../../services/notice";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "NORMAL", target: "ALL" });
  const [message, setMessage] = useState("");

  async function load() { setNotices(await listNotices(undefined, true)); }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.title || !form.content) return;
    try {
      await createNotice(form);
      setShowForm(false);
      setForm({ title: "", content: "", priority: "NORMAL", target: "ALL" });
      setMessage("Notice published");
      load();
    } catch { setMessage("Failed to publish"); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notices & Announcements</h1>
          <p className="text-slate-500 text-sm mt-1">Publish school-wide or role-specific notices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} /> New Notice
        </button>
      </div>

      {message && <div className="mb-4 p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">{message}<button onClick={() => setMessage("")} className="float-right ml-2">&times;</button></div>}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Notice Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-32" placeholder="Notice content..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          <div className="flex gap-3">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Important</option>
              <option value="URGENT">Urgent</option>
            </select>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.target} onChange={e => setForm({...form, target: e.target.value})}>
              <option value="ALL">Everyone</option>
              <option value="STUDENTS">Students</option>
              <option value="TEACHERS">Teachers</option>
              <option value="PARENTS">Parents</option>
              <option value="STAFF">Staff</option>
            </select>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Publish</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="bg-white p-8 border border-slate-200 rounded-xl text-center text-slate-400 text-sm">No active notices. Create one to inform the school.</div>
        ) : (
          notices.map(n => (
            <div key={n.id} className={`bg-white border rounded-xl p-4 ${n.priority === "URGENT" ? "border-red-300 bg-red-50" : n.priority === "IMPORTANT" ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Megaphone size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{n.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${n.priority === "URGENT" ? "bg-red-200 text-red-800" : n.priority === "IMPORTANT" ? "bg-amber-200 text-amber-800" : "bg-slate-100 text-slate-600"}`}>{n.priority}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{n.target}</span>
                  </div>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{n.content}</p>
                  <div className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => { if (confirm("Delete notice?")) { deleteNotice(n.id).then(load); } }} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}