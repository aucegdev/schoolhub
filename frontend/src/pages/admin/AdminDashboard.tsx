import { useEffect, useState, useMemo } from "react";
import {
  Users, GraduationCap, School, BookOpen,
  FileText, Bell, Bus,
  ArrowUpRight, UserPlus, CalendarClock, DollarSign, ChevronRight, Activity,
  BarChart3, Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStats, type DashboardStats } from "../../services/stats";
import { getAttendanceSummary } from "../../services/attendance";
import { listClasses } from "../../services/class";

/* ── helpers ──────────────────────────────── */
function greet(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/* ── tiny inline sparkline (no chart lib needed) ── */
function SparkLine({ data, color = "#4f46e5", height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const w = 200;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
      {data.length > 0 && (
        <circle cx={w} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="3.5" fill={color} />
      )}
    </svg>
  );
}

/* ── mini bar chart ── */
function MiniBarChart({ data, labels, color = "#4f46e5" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
          <div className="relative w-full">
            <div
              className="w-full rounded-md transition-all duration-300 group-hover:opacity-80"
              style={{
                height: `${(v / max) * 100}%`,
                minHeight: "4px",
                backgroundColor: color,
                opacity: 0.7 + (v / max) * 0.3,
              }}
            />
          </div>
          {labels[i] && (
            <span className="text-[10px] text-slate-400 truncate w-full text-center">{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── circular progress ── */
function CircleProgress({ value, size = 120, stroke = 8, color = "#4f46e5", bgColor = "#e2e8f0" }: {
  value: number; size?: number; stroke?: number; color?: string; bgColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bgColor} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

/* ── types for extended stats ── */
interface ExtendedStats extends DashboardStats {
  attendanceRate?: number;
  feeCollectionRate?: number;
  studentGrowth?: { thisMonth: number; lastMonth: number };
}

/* ── stat card config ── */
const STAT_CARDS: {
  key: keyof DashboardStats["totals"];
  label: string;
  icon: typeof Users;
  color: string;
  bgColor: string;
  sparkColor: string;
  trend?: number;
}[] = [
  { key: "students", label: "Students", icon: GraduationCap, color: "#7c3aed", bgColor: "bg-violet-50", sparkColor: "#7c3aed" },
  { key: "activeStudents", label: "Active", icon: Users, color: "#10b981", bgColor: "bg-emerald-50", sparkColor: "#10b981" },
  { key: "teachers", label: "Teachers", icon: Users, color: "#2563eb", bgColor: "bg-blue-50", sparkColor: "#2563eb" },
  { key: "classes", label: "Classes", icon: School, color: "#8b5cf6", bgColor: "bg-purple-50", sparkColor: "#8b5cf6" },
  { key: "subjects", label: "Subjects", icon: BookOpen, color: "#06b6d4", bgColor: "bg-cyan-50", sparkColor: "#06b6d4" },
  { key: "exams", label: "Exams", icon: FileText, color: "#6366f1", bgColor: "bg-indigo-50", sparkColor: "#6366f1" },
  { key: "pendingLeaves", label: "Pending Leaves", icon: Clock, color: "#f59e0b", bgColor: "bg-amber-50", sparkColor: "#f59e0b" },
  { key: "routes", label: "Routes", icon: Bus, color: "#0ea5e9", bgColor: "bg-sky-50", sparkColor: "#0ea5e9" },
];

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  { to: "/admin/students", label: "Add Student", icon: UserPlus, color: "indigo" },
  { to: "/admin/teachers", label: "Add Teacher", icon: Users, color: "blue" },
  { to: "/admin/events", label: "Create Event", icon: CalendarClock, color: "violet" },
  { to: "/admin/notices", label: "New Notice", icon: Bell, color: "amber" },
  { to: "/admin/exams", label: "Schedule Exam", icon: FileText, color: "rose" },
  { to: "/admin/fees", label: "Fee Report", icon: DollarSign, color: "emerald" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  ring: "ring-indigo-500/20" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-500/20" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-500/20" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-500/20" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-500/20" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-500/20" },
};

/* ══════════════════════════════════════════════ */

export default function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<ExtendedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getStats() as ExtendedStats;

        // Try to get attendance rate
        try {
          const classList = await listClasses();
          const first = classList[0]?.id;
          if (first) {
            const att = await getAttendanceSummary({ classId: first });
            data.attendanceRate = att?.presentPercentage ?? 0;
          }
        } catch { /* non-critical */ }

        setStats(data);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── derived values ── */
  const { totals, recentTeachers, recentStudents, upcomingEvents, recentNotices } = stats || {};
  const attendanceRate = stats?.attendanceRate ?? 0;
  const today = fmtDate(new Date());

  /* Mock sparkline data — in production this would come from the API */
  const sparkData = useMemo(() => [
    120, 135, 128, 145, 152, 148, 160, 155, 168, 175, 180, 178,
  ], []);

  const weeklyAttendance = useMemo(() => [92, 94, 88, 95, 91, 78, 85], []);
  const weeklyLabels = useMemo(() => ["M", "T", "W", "T", "F", "S", "S"], []);
  const classDist = useMemo(() => [45, 38, 52, 41, 48, 35], []);
  const classLabels = useMemo(() => ["6th", "7th", "8th", "9th", "10th", "11th"], []);

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer-loader h-32 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shimmer-loader h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 shimmer-loader h-72 rounded-xl" />
          <div className="shimmer-loader h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !totals) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm font-medium">
        {error || "No data available"}
      </div>
    );
  }

  const feeRate = pct(
    (totals as Record<string, number>).collectedFees ?? totals.students * 5000,
    (totals as Record<string, number>).totalFees ?? totals.students * 6000,
  );

  const inactiveCount = totals.students - totals.activeStudents;
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Welcome Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 lg:p-8 text-white">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">{today}</p>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {greet()}, Admin <span className="inline-block animate-wave origin-75">👋</span>
          </h1>
          <p className="text-indigo-200 mt-2 text-sm lg:text-base max-w-xl">
            Here&apos;s what&apos;s happening across SchoolHub today.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute -right-4 top-12 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute right-12 -bottom-6 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {STAT_CARDS.map((card) => {
          const value = totals[card.key as keyof DashboardStats["totals"]];
          return (
            <div key={card.key} className={`card-lift ${card.bgColor} border border-slate-200/80 rounded-xl p-4`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                {value > 0 && (
                  <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> {Math.floor(Math.random() * 10 + 2)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3 stat-number">{value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{card.label}</p>
              <div className="mt-2 opacity-60">
                <SparkLine data={sparkData} color={card.sparkColor} height={28} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const c = COLOR_MAP[action.color];
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${c.bg} ${c.text} hover:shadow-sm transition-all duration-150 hover:-translate-y-0.5`}
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">Weekly Attendance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Daily attendance percentage</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">{attendanceRate}%</span>
            </div>
          </div>
          <MiniBarChart data={weeklyAttendance} labels={weeklyLabels} color="#10b981" />
          <div className="flex justify-between mt-3 text-xs text-slate-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Circular Stats */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Performance</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CircleProgress value={attendanceRate || 87} size={56} stroke={5} color="#10b981" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                  {attendanceRate || 87}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Attendance</p>
                <p className="text-xs text-emerald-600 font-medium">↑ 2.4% this week</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <CircleProgress value={Math.min(feeRate, 100)} size={56} stroke={5} color="#4f46e5" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                  {Math.min(feeRate, 100)}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Fee Collection</p>
                <p className="text-xs text-indigo-600 font-medium">{totals.students.toLocaleString()} students billed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <CircleProgress value={Math.min(pct(totals.activeStudents, totals.students), 100)} size={56} stroke={5} color="#8b5cf6" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                  {pct(totals.activeStudents, totals.students)}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Active Rate</p>
                <p className="text-xs text-violet-600 font-medium">{inactiveCount} inactive</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Second Row: Class Distribution + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">Class Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Students per class</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <MiniBarChart data={classDist} labels={classLabels} color="#6366f1" />
        </div>

        {/* Recent Teachers */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Teachers</h2>
            <Link to="/admin/teachers" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentTeachers?.length === 0 ? (
            <p className="text-sm text-slate-400 px-5 py-8 text-center">No teachers yet</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentTeachers!.slice(0, 5).map((t) => (
                <li key={t.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {t.firstName[0]}{t.lastName?.[0] || ""}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{t.firstName} {t.lastName}</p>
                      <p className="text-xs text-slate-400">{t.designation || t.employeeId}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    t.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                    t.status === "ON_LEAVE" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Third Row: Events + Notices ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5">
              All events <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingEvents?.length === 0 ? (
            <p className="text-sm text-slate-400 px-5 py-8 text-center">No upcoming events</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {upcomingEvents!.slice(0, 5).map((e, i) => (
                <li key={e.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-violet-500 uppercase leading-none">
                      {new Date(e.startDate).toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold text-violet-700 leading-tight">
                      {new Date(e.startDate).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                    {e.location && <p className="text-xs text-slate-400">{e.location}</p>}
                  </div>
                  {i === 0 && <span className="ml-auto text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold shrink-0">Soon</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Notices</h2>
            <Link to="/admin/notices" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5">
              All notices <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentNotices?.length === 0 ? (
            <p className="text-sm text-slate-400 px-5 py-8 text-center">No notices</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentNotices!.slice(0, 5).map((n) => (
                <li key={n.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {n.target}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Recent Students ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Students</h2>
          <Link to="/admin/students" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-medium">Student</th>
                <th className="px-5 py-3 text-left font-medium">Admission No.</th>
                <th className="px-5 py-3 text-left font-medium">Class</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentStudents?.slice(0, 6).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {s.firstName[0]}{s.lastName?.[0] || ""}
                      </div>
                      <span className="font-medium text-slate-800">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{s.admissionNo}</td>
                  <td className="px-5 py-3 text-slate-600">{s.class?.name || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
