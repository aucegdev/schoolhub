import { useState, useEffect } from "react";
import { Send, Trash2, Mail, Inbox } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";
import { listMessages, sendMessage, markAsRead, deleteMessage, type Message } from "../../../services/messaging";

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "sent">("all");
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
      setMessage("Message sent!");
      load();
    } catch { setMessage("Failed to send"); }
  }

  async function handleRead(id: string) { await markAsRead(id); load(); }

  const displayed = messages.filter(m => {
    if (filter === "unread") return !m.isRead;
    if (filter === "sent") return false; // mark sent messages in backend
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internal Communication</h1>
          <p className="text-sm text-slate-500 mt-1">Send messages and announcements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Send size={16} /> Compose
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
          {message}
          <button onClick={() => setMessage("")} className="text-current opacity-60 hover:opacity-100">&times;</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">New Message</h2>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={form.recipientRole} onChange={e => setForm({...form, recipientRole: e.target.value})}>
            <option value="ALL">Everyone</option>
            <option value="TEACHER">Teachers</option>
            <option value="STUDENT">Students</option>
            <option value="PARENT">Parents</option>
            <option value="STAFF">Staff</option>
          </select>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y" placeholder="Message body..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
          <div className="flex gap-3">
            <button onClick={handleSend} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">Send Message</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter bar */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-100 w-fit">
          {([["all", "All"], ["unread", "Unread"], ["sent", "Sent"] ] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === key ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
              {key === "unread" && unreadCount > 0 ? `${label} (${unreadCount})` : label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {displayed.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No messages yet"
            description="Start the conversation by sending your first message to the school."
            actionLabel="Compose Message"
            onAction={() => setShowForm(true)}
            iconColor="text-blue-400"
          />
        ) : (
          displayed.map(m => (
            <div key={m.id} className={`bg-white border rounded-xl p-5 card-lift ${m.isRead ? "border-slate-200" : "border-indigo-300 bg-indigo-50/30"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900 text-sm truncate">{m.subject}</span>
                    {!m.isRead && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">NEW</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">To: {m.recipientRole || "User"}</span>
                  </div>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{m.body}</p>
                  <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-400">
                    <span>From: <span className="font-medium text-slate-600">{m.senderRole}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!m.isRead && (
                    <button onClick={() => handleRead(m.id)} className="flex items-center gap-1 text-indigo-600 px-2 py-1.5 rounded-lg hover:bg-indigo-50 text-xs font-medium transition">
                      <Mail size={12} /> Mark read
                    </button>
                  )}
                  <button onClick={() => { if (confirm("Delete this message?")) { deleteMessage(m.id).then(load); } }} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
