import { useState, useEffect } from "react";
import { BarChart3, Users, DollarSign, TrendingUp } from "lucide-react";
import { listClasses, type ClassData } from "../../services/class";
import { listStudents, type Student } from "../../services/student";
import { listTeachers, type Teacher } from "../../services/teacher";
import { getStudentDues, getClassDuesSummary, type FeeDues } from "../../services/fees";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "fees" | "attendance" | "exams">("overview");
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [feeReport, setFeeReport] = useState<FeeDues | null>(null);
  const [classSummary, setClassSummary] = useState<any>(null);

  useEffect(() => {
    Promise.all([listClasses(), listStudents(), listTeachers({ status: "ACTIVE" })]).then(([c, s, t]) => {
      setClasses(c);
      setStudents(s.students);
      setTeachers(t.teachers);
      if (c.length > 0) setSelectedClass(c[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find(c => c.id === selectedClass);
      if (cls) setStudents(cls.students || []);
      else listStudents({ classId: selectedClass }).then(s => setStudents(s.students));
    }
  }, [selectedClass, classes]);

  async function loadFeeReport() {
    if (selectedStudent) {
      const d = await getStudentDues(selectedStudent);
      setFeeReport(d);
    }
    if (selectedClass) {
      const s = await getClassDuesSummary(selectedClass);
      setClassSummary(s);
    }
  }

  useEffect(() => { if (activeTab === "fees") loadFeeReport(); }, [activeTab]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Reports & Analytics</h1>
      <p className="text-slate-500 text-sm mb-6">School-wide overview, fee collection, attendance, and exam performance</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
        {([
          { key: "overview", label: "Overview", icon: BarChart3 },
          { key: "fees", label: "Fee Collection", icon: DollarSign },
          { key: "attendance", label: "Attendance", icon: TrendingUp },
          { key: "exams", label: "Exams", icon: BarChart3 },
        ]).map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-blue-900">{students.length}</div>
            <div className="text-sm text-blue-600">Total Students</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <Users className="w-6 h-6 text-emerald-500 mb-2" />
            <div className="text-2xl font-bold text-emerald-900">{teachers.length}</div>
            <div className="text-sm text-emerald-600">Active Teachers</div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
            <BarChart3 className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-purple-900">{classes.length}</div>
            <div className="text-sm text-purple-600">Classes</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <TrendingUp className="w-6 h-6 text-amber-500 mb-2" />
            <div className="text-2xl font-bold text-amber-900">{classes.reduce((s, c) => s + (c.sections?.length || 0), 0)}</div>
            <div className="text-sm text-amber-600">Total Sections</div>
          </div>
        </div>
      )}

      {activeTab === "fees" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Student</label>
              <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="">All Students</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
              </select>
            </div>
          </div>

          {classSummary && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 font-semibold text-slate-800">Class Collection Summary</div>
              <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100">
                <div className="p-4 text-center">
                  <div className="text-xs text-slate-500">Collected</div>
                  <div className="text-lg font-bold text-emerald-700">₹{classSummary.totalCollected?.toLocaleString()}</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xs text-slate-500">Outstanding</div>
                  <div className="text-lg font-bold text-red-700">₹{classSummary.totalOutstanding?.toLocaleString()}</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xs text-slate-500">Expected</div>
                  <div className="text-lg font-bold text-slate-800">₹{classSummary.totalExpected?.toLocaleString()}</div>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50"><tr>
                  <th className="p-3">Student</th>
                  <th className="p-3 text-right">Due</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Outstanding</th><th className="p-3 text-center">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {classSummary.students?.map((s: any) => (
                    <tr key={s.studentId}>
                      <td className="p-3 font-medium">{s.studentName}</td>
                      <td className="p-3 text-right">₹{s.totalDue?.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-700">₹{s.totalPaid?.toLocaleString()}</td>
                      <td className="p-3 text-right text-red-700">₹{s.outstanding?.toLocaleString()}</td>
                      <td className="p-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${s.status === "PAID" ? "bg-emerald-100 text-emerald-700" : s.status === "PARTIAL" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {feeReport && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-3">{feeReport.student.firstName} {feeReport.student.lastName} — Dues</h3>
              <div className="space-y-2">
                {feeReport.dues.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{d.feeStructure.title}</span>
                    <span className={`text-sm font-semibold ${d.outstanding > 0 ? "text-red-700" : "text-emerald-700"}`}>{d.outstanding > 0 ? `₹${d.outstanding} due` : `₹${d.paid} paid`}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
                <span>Total Due: ₹{feeReport.totalDue?.toLocaleString()}</span>
                <span className="text-emerald-700">Paid: ₹{feeReport.totalPaid?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          Attendance reports available after marking sessions. See Attendance Management for daily summaries.
        </div>
      )}

      {activeTab === "exams" && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          Exam reports with report card PDFs available after entering marks. See Examinations for details.
        </div>
      )}
    </div>
  );
}