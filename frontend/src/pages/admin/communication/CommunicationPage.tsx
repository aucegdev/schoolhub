import { useState, useEffect } from "react";
import { Send, Trash2, Mail } from "lucide-react";
import { listMessages, sendMessage, markAsRead, deleteMessage, type Message } from "../../../services/messaging";

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ recipientRole: "ALL", subject: "", body: "" });
  const [message, setMessage] = useState("");

  async function load() { setMessages(await listMessages()); }
  useEffect(() => { load(); }, []);

  async function handleSend() {
    if (!form.subject || !form.body) return;
    try {
      await sendMessage({ recipientRole: form.recipientRole, subject: form.subject, body: form.body });
      setShowForm(false);
      setForm({ recipientRole: "ALL", subject: "", body: "" });
      setMessage("Message sent");
      load();
    } catch { setMessage("Failed to send"); }
  }

  async function handleRead(id: string) { await markAsRead(id); load(); }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internal Communication</h1>
          <p className="text-slate-500 text-sm mt-1">Send messages and announcements to staff, teachers, or parents</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Send size={16} /> Compose
        </button>
      </div>

      {message && <div className="mb-4 p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">{message}<button onClick={() => setMessage("")} className="float-right ml-2">&times;</button></div>}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.recipientRole} onChange={e => setForm({...form, recipientRole: e.target.value})}>
            <option value="ALL">Everyone</option>
            <option value="TEACHER">Teachers</option>
            <option value="STUDENT">Students</option>
            <option value="PARENT">Parents</option>
            <option value="STAFF">Staff</option>
          </select>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-32" placeholder="Message body..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
          <button onClick={handleSend} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Send</button>
        </div>
      )}

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-white p-8 border border-slate-200 rounded-xl text-center text-slate-400 text-sm">No messages yet. Compose the first one.</div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`bg-white border rounded-xl p-4 ${m.isRead ? "border-slate-200" : "border-blue-300 bg-blue-50"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{m.subject}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">To: {m.recipientRole || "User"}</span>
                  </div>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{m.body}</p>
                  <div className="text-xs text-slate-400 mt-2">From: {m.senderRole} | {new Date(m.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  {!m.isRead && <button onClick={() => handleRead(m.id)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg text-xs">Mark Read</button>}
                  <button onClick={() => { if (confirm("Delete?")) { deleteMessage(m.id).then(load); } }} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}