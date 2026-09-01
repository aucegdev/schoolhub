import { useState, useEffect } from "react";
import { Users, School, Layers, BookOpen, CalendarClock, CalendarDays, Loader2 } from "lucide-react";
import { getStats, type DashboardStats } from "../../services/stats";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  ON_LEAVE: "bg-amber-100 text-amber-700",
  RESIGNED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center pt-24">
        <Loader2 size={32} className="text-blue-600 animate-spin mb-3" />
        <p className="text-slate-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-medium">{error}</div>
      </div>
    );
  }

  const { totals, recentTeachers, classesWithSections } = stats;
  const cards = [
    { label: "Total Teachers", value: totals.teachers, icon: Users, color: "bg-blue-500" },
    { label: "Active Teachers", value: totals.activeTeachers, icon: Users, color: "bg-green-500" },
    { label: "Classes", value: totals.classes, icon: School, color: "bg-purple-500" },
    { label: "Sections", value: totals.sections, icon: Layers, color: "bg-amber-500" },
    { label: "Subjects", value: totals.subjects, icon: BookOpen, color: "bg-cyan-500" },
    { label: "Timetable Entries", value: totals.timetableEntries, icon: CalendarClock, color: "bg-rose-500" },
    { label: "Holidays", value: totals.holidays, icon: CalendarDays, color: "bg-indigo-500" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">School overview and key metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white shrink-0`}>
              <card.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teachers */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Teachers</h2>
          </div>
          {recentTeachers.length === 0 ? (
            <p className="text-sm text-slate-400 px-4 py-8 text-center">No teachers yet</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentTeachers.map((t) => (
                <li key={t.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-slate-400">{t.employeeId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.designation && <span className="text-xs text-slate-500">{t.designation}</span>}
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] || "bg-slate-100 text-slate-600"}`}>
                      {t.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Classes with Sections */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Classes & Sections</h2>
          </div>
          {classesWithSections.length === 0 ? (
            <p className="text-sm text-slate-400 px-4 py-8 text-center">No classes yet</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {classesWithSections.map((c) => (
                <li key={c.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{c.name}</span>
                  <span className="text-xs text-slate-500">{c._count.sections} sections</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}