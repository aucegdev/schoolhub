import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar as CalIcon } from "lucide-react";
import { listEvents, createEvent, deleteEvent, type Event } from "../../../services/event";

const TYPE_COLORS: Record<string, string> = {
  HOLIDAY: "bg-red-100 text-red-700",
  EXAM: "bg-blue-100 text-blue-700",
  MEETING: "bg-amber-100 text-amber-700",
  SPORTS: "bg-green-100 text-green-700",
  CULTURAL: "bg-purple-100 text-purple-700",
  GENERAL: "bg-slate-100 text-slate-700",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", eventType: "GENERAL", startDate: "", endDate: "", location: "", targetRoles: "" });

  async function load() { setEvents(await listEvents()); }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.title || !form.startDate) return;
    await createEvent(form);
    setShowForm(false);
    setForm({ title: "", description: "", eventType: "GENERAL", startDate: "", endDate: "", location: "", targetRoles: "" });
    load();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events & Calendar</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school events, holidays, and activities</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Event Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})}>
              <option value="GENERAL">General</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="EXAM">Exam</option>
              <option value="MEETING">Meeting</option>
              <option value="SPORTS">Sports</option>
              <option value="CULTURAL">Cultural</option>
            </select>
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="datetime-local" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="datetime-local" placeholder="End Date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-white p-8 border border-slate-200 rounded-xl text-center text-slate-400 text-sm">No events scheduled.</div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CalIcon size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{ev.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[ev.eventType] || "bg-slate-100"}`}>{ev.eventType}</span>
                  </div>
                  {ev.description && <p className="text-slate-600 text-sm mb-2">{ev.description}</p>}
                  <div className="text-xs text-slate-500">
                    📅 {new Date(ev.startDate).toLocaleString()}
                    {ev.endDate && ` → ${new Date(ev.endDate).toLocaleString()}`}
                    {ev.location && ` | 📍 ${ev.location}`}
                  </div>
                </div>
                <button onClick={() => { if (confirm("Delete event?")) { deleteEvent(ev.id).then(load); } }} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}