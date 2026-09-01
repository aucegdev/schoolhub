import { useState, useEffect } from "react";
import { Plus, X, Check, Clock, CalendarDays } from "lucide-react";
import { listLeaves, createLeave, updateLeaveStatus, type LeaveRequest } from "../../services/leave";
import { listTeachers, type Teacher } from "../../services/teacher";

const TYPE_COLORS: Record<string, string> = {
  CASUAL: "bg-blue-100 text-blue-700",
  SICK: "bg-amber-100 text-amber-700",
  EARNED: "bg-green-100 text-green-700",
  UNPAID: "bg-red-100 text-red-700",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ teacherId: "", type: "CASUAL", startDate: "", endDate: "", reason: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadLeaves(); }, [statusFilter]);

  async function loadLeaves() {
    try {
      setLoading(true);
      const data = await listLeaves({ status: statusFilter || undefined });
      setLeaves(data.leaves);
    } catch {
      setMessage({ type: "error", text: "Failed to load leave requests" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTeachers(); }, []);

  async function loadTeachers() {
    try {
      const data = await listTeachers({ status: "ACTIVE", page: 1 });
      setTeachers(data.teachers);
    } catch { /* ignore */ }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function calcDays(start: string, end: string) {
    if (!start || !end) return 0;
    const s = new Date(start), e = new Date(end);
    return Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }

  async function handleSave() {
    if (!form.teacherId || !form.startDate || !form.endDate || !form.reason.trim()) return;
    try {
      setSaving(true);
      await createLeave(form);
      setMessage({ type: "success", text: "Leave request submitted" });
      setShowForm(false);
      setForm({ teacherId: "", type: "CASUAL", startDate: "", endDate: "", reason: "" });
      await loadLeaves();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to submit leave" });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id: string, status: "APPROVED" | "REJECTED") {
    if (!confirm(`Approve or reject this leave? Marking as ${status}.`)) return;
    const remarks = prompt("Remarks (optional):") || undefined;
    try {
      await updateLeaveStatus(id, status, remarks);
      setMessage({ type: "success", text: `Leave ${status.toLowerCase()}` });
      await loadLeaves();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update status" });
    }
  }

  const stats = {
    pending: leaves.filter(l => l.status === "PENDING").length,
    approved: leaves.filter(l => l.status === "APPROVED").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Leave</h1>
          <p className="text-slate-500 text-sm mt-1">Leave requests and approvals</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> New Leave Request
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <Clock size={18} className="text-amber-500" />
          <div>
            <p className="text-xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <Check size={18} className="text-green-500" />
          <div>
            <p className="text-xl font-bold text-slate-900">{stats.approved}</p>
            <p className="text-xs text-slate-500">Approved</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Leave Request</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teacher</label>
                <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="EARNED">Earned Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} placeholder="Reason for leave" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.teacherId || !form.startDate || !form.endDate || !form.reason.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-5 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <CalendarDays className="mx-auto text-slate-300 mb-2" size={40} />
                  <p className="text-slate-500 font-medium">No leave requests</p>
                </td>
              </tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">{l.teacher.firstName} {l.teacher.lastName}</p>
                    <p className="text-xs text-slate-400">{l.teacher.employeeId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[l.type] || "bg-slate-100 text-slate-600"}`}>{l.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {formatDate(l.startDate)} — {formatDate(l.endDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{calcDays(l.startDate, l.endDate)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">{l.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[l.status] || "bg-slate-100 text-slate-600"}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleStatus(l.id, "APPROVED")} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"><Check size={12} /> Approve</button>
                        <button onClick={() => handleStatus(l.id, "REJECTED")} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Reject</button>
                      </div>
                    )}
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