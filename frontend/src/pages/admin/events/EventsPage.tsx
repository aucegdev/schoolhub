import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar as CalIcon, MapPin, Edit3, CheckCircle } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";
import { listEvents, createEvent, updateEvent, deleteEvent, type Event } from "../../../services/event";

const TYPE_COLORS: Record<string, string> = {
  HOLIDAY: "bg-red-100 text-red-700 border-red-200",
  EXAM: "bg-blue-100 text-blue-700 border-blue-200",
  MEETING: "bg-amber-100 text-amber-700 border-amber-200",
  SPORTS: "bg-green-100 text-green-700 border-green-200",
  CULTURAL: "bg-purple-100 text-purple-700 border-purple-200",
  GENERAL: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", eventType: "GENERAL",
    startDate: "", endDate: "", location: "", targetRoles: "",
  });

  async function load() { setEvents(await listEvents()); }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.title || !form.startDate) return;
    if (editingEvent) {
      await updateEvent(editingEvent.id, form);
    } else {
      await createEvent(form);
    }
    setShowForm(false);
    setEditingEvent(null);
    setForm({ title: "", description: "", eventType: "GENERAL", startDate: "", endDate: "", location: "", targetRoles: "" });
    load();
  }

  function handleEdit(ev: Event) {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || "",
      eventType: ev.eventType,
      startDate: ev.startDate.slice(0, 16),
      endDate: ev.endDate?.slice(0, 16) || "",
      location: ev.location || "",
      targetRoles: ev.targetRoles || "",
    });
    setShowForm(true);
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const upcomingEvents = events.filter(e => e.startDate >= todayStr);
  const pastEvents = events.filter(e => e.startDate < todayStr);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events & Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">Manage school events, holidays, and activities</p>
        </div>
        <button onClick={() => { setEditingEvent(null); setForm({ title: "", description: "", eventType: "GENERAL", startDate: "", endDate: "", location: "", targetRoles: "" }); setShowForm(!showForm); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800">{editingEvent ? "Edit Event" : "New Event"}</h2>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Event Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})}>
              {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="datetime-local" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="datetime-local" placeholder="End Date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">{editingEvent ? "Update" : "Save"}</button>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(ev => {
              const date = new Date(ev.startDate);
              const isToday = date.toISOString().split("T")[0] === todayStr;
              const month = date.toLocaleString("en-US", { month: "short" });
              const day = date.getDate();
              return (
                <div key={ev.id} className="card-lift bg-white border border-slate-200 rounded-xl p-4 flex gap-4">
                  <div className="shrink-0 w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase leading-none">{month}</span>
                    <span className="text-lg font-bold text-indigo-700 leading-tight">{day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 text-sm truncate">{ev.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${TYPE_COLORS[ev.eventType] || "bg-slate-100"}`}>{ev.eventType}</span>
                    </div>
                    {ev.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><CalIcon size={12} /> {isToday ? "Today" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {ev.location && <span className="flex items-center gap-1 truncate"><MapPin size={12} /> {ev.location}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => handleEdit(ev)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"><Edit3 size={14} /></button>
                    <button onClick={() => { if (confirm("Delete event?")) { deleteEvent(ev.id).then(load); } }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Past Events</h2>
          <div className="space-y-2">
            {pastEvents.map(ev => (
              <div key={ev.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <CheckCircle size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-500 w-24 shrink-0">
                    {new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="font-medium text-slate-700 text-sm">{ev.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${TYPE_COLORS[ev.eventType] || "bg-slate-100"}`}>{ev.eventType}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(ev)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"><Edit3 size={14} /></button>
                  <button onClick={() => { if (confirm("Delete event?")) { deleteEvent(ev.id).then(load); } }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <EmptyState
          icon={CalIcon}
          title="No events yet"
          description="Plan your first event to keep everyone informed and engaged."
          actionLabel="Create Event"
          onAction={() => { setEditingEvent(null); setForm({ title: "", description: "", eventType: "GENERAL", startDate: "", endDate: "", location: "", targetRoles: "" }); setShowForm(true); }}
          iconColor="text-violet-400"
        />
      )}
    </div>
  );
}
