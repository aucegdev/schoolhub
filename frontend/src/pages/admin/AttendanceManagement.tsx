import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar, Save, Users, CheckCheck, X as XIcon } from "lucide-react";
import { listClasses, type ClassData } from "../../services/class";
import { listStudents, type Student } from "../../services/student";
import { markAttendance, getAttendanceSummary } from "../../services/attendance";

export default function AttendanceManagement() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">>({});
  const [summary, setSummary] = useState<{ total: number; present: number; absent: number; late: number; excused: number } | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listClasses().then((res) => {
      setClasses(res);
      if (res.length > 0) setSelectedClass(res[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find((c) => c.id === selectedClass);
      if (cls && cls.sections.length > 0) {
        setSelectedSection(cls.sections[0].id);
      }
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (selectedClass) {
      loadStudentsAndAttendance();
    }
  }, [selectedClass, selectedSection, date]);

  const loadStudentsAndAttendance = async () => {
    try {
      const [res, sum] = await Promise.all([
        listStudents({ classId: selectedClass, sectionId: selectedSection }),
        getAttendanceSummary({ classId: selectedClass, sectionId: selectedSection, date }),
      ]);
      setStudents(res.students);
      setSummary(sum);

      const initialMap: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {};
      res.students.forEach((s) => {
        initialMap[s.id!] = "PRESENT";
      });
      setAttendance(initialMap);
    } catch {}
  };

  const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setMessage("");
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      await markAttendance({
        classId: selectedClass,
        sectionId: selectedSection,
        date,
        records,
      });
      setMessage("Attendance saved successfully!");
      const sum = await getAttendanceSummary({ classId: selectedClass, sectionId: selectedSection, date });
      setSummary(sum);
    } catch {
      setMessage("Failed to save attendance.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Marking</h1>
          <p className="text-sm text-slate-500">Record daily student attendance by class and section</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
        >
          <Save className="w-4 h-4" /> Save Attendance
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </div>
      )}

      {/* Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          >
            {classes
              .find((c) => c.id === selectedClass)
              ?.sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl card-lift">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div className="text-xs font-semibold text-emerald-600">Present</div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">{summary.present}<span className="text-sm text-emerald-500 ml-1">/{summary.total}</span></div>
            <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${summary.total > 0 ? (summary.present / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl card-lift">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <div className="text-xs font-semibold text-red-600">Absent</div>
            </div>
            <div className="text-2xl font-bold text-red-800">{summary.absent}</div>
            <div className="mt-2 h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${summary.total > 0 ? (summary.absent / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl card-lift">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <div className="text-xs font-semibold text-amber-600">Late</div>
            </div>
            <div className="text-2xl font-bold text-amber-800">{summary.late}</div>
            <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${summary.total > 0 ? (summary.late / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl card-lift">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <div className="text-xs font-semibold text-indigo-600">Excused</div>
            </div>
            <div className="text-2xl font-bold text-indigo-800">{summary.excused}</div>
            <div className="mt-2 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${summary.total > 0 ? (summary.excused / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Mark Toolbar */}
      {students.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Quick Mark All:
          </span>
          <button onClick={() => { const m: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {}; students.forEach(s => m[s.id!] = "PRESENT"); setAttendance(m); }} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"><CheckCheck className="w-3.5 h-3.5" /> All Present</button>
          <button onClick={() => { const m: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {}; students.forEach(s => m[s.id!] = "ABSENT"); setAttendance(m); }} className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-1"><XIcon className="w-3.5 h-3.5" /> All Absent</button>
        </div>
      )}

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
            <tr>
              <th className="p-4 w-16">Roll No</th>
              <th className="p-4">Student</th>
              <th className="p-4 text-center w-[340px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  No students in this class/section.
                </td>
              </tr>
            ) : (
              students.map((st) => {
                const currentStatus = attendance[st.id!] || "PRESENT";
                const statusConfig: Record<string, { cls: string; icon: typeof CheckCircle }> = {
                  PRESENT: { cls: "bg-emerald-600 text-white shadow-sm", icon: CheckCircle },
                  ABSENT:  { cls: "bg-red-600 text-white shadow-sm", icon: XCircle },
                  LATE:    { cls: "bg-amber-500 text-white shadow-sm", icon: Clock },
                  EXCUSED: { cls: "bg-indigo-600 text-white shadow-sm", icon: AlertCircle },
                };
                return (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono text-slate-500 text-xs">{st.rollNumber || "—"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {st.firstName[0]}{st.lastName?.[0] || ""}
                        </div>
                        <span className="font-medium text-slate-800">{st.firstName} {st.lastName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-1.5">
                        {[
                          { key: "PRESENT", label: "Present" },
                          { key: "ABSENT", label: "Absent" },
                          { key: "LATE", label: "Late" },
                          { key: "EXCUSED", label: "Excused" },
                        ].map((btn) => {
                          const cfg = statusConfig[btn.key];
                          const isActive = currentStatus === btn.key;
                          return (
                            <button
                              key={btn.key}
                              type="button"
                              onClick={() => handleStatusChange(st.id!, btn.key as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                isActive ? cfg.cls : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              <cfg.icon className="w-3.5 h-3.5" /> {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
