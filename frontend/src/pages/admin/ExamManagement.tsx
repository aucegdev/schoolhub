import { useEffect, useState } from "react";
import { Plus, BookOpen, Calendar, Award, CheckSquare } from "lucide-react";
import { listClasses, type ClassData } from "../../services/class";
import { listSubjects, type SubjectData } from "../../services/subject";
import { listExams, createExam, enterMarks, type Exam } from "../../services/examination";
import { listStudents, type Student } from "../../services/student";

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [marksState, setMarksState] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const [examForm, setExamForm] = useState({
    title: "",
    examType: "UNIT_TEST",
    classId: "",
    subjectId: "",
    examDate: new Date().toISOString().split("T")[0],
    totalMarks: 100,
    passingMarks: 35,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eList, cList, sList] = await Promise.all([
        listExams(),
        listClasses(),
        listSubjects(),
      ]);
      setExams(eList);
      setClasses(cList);
      setSubjects(sList.subjects);
      if (cList.length > 0) setExamForm((f) => ({ ...f, classId: cList[0].id }));
      if (sList.subjects.length > 0) setExamForm((f) => ({ ...f, subjectId: sList.subjects[0].id }));
    } catch {}
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createExam(examForm);
      setIsExamModalOpen(false);
      await loadData();
      setMessage("Exam created successfully!");
    } catch {
      setMessage("Failed to create exam");
    }
  };

  const handleOpenMarksModal = async (exam: Exam) => {
    setSelectedExam(exam);
    try {
      const res = await listStudents({ classId: exam.classId });
      setStudents(res.students);

      const markMap: Record<string, number> = {};
      exam.marks?.forEach((m) => {
        markMap[m.studentId] = m.marksObtained;
      });
      setMarksState(markMap);
      setIsMarksModalOpen(true);
    } catch {}
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;
    try {
      const payload = Object.entries(marksState).map(([studentId, marksObtained]) => ({
        studentId,
        marksObtained,
      }));
      await enterMarks(selectedExam.id, payload);
      setIsMarksModalOpen(false);
      await loadData();
      setMessage("Marks updated successfully!");
    } catch {
      setMessage("Failed to update marks");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Examination & Evaluation</h1>
          <p className="text-sm text-slate-500">Schedule exams and enter student marks</p>
        </div>
        <button
          onClick={() => setIsExamModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </div>
      )}

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
            No exams scheduled. Click "Create Exam" to schedule your first exam.
          </div>
        ) : (
          exams.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                    {ex.examType}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg mt-2">{ex.title}</h3>
                </div>
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Subject: <strong>{ex.subject?.name || "N/A"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date: {new Date(ex.examDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-50 font-medium">
                  <span>Total: {ex.totalMarks}</span>
                  <span>Pass: {ex.passingMarks}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenMarksModal(ex)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                <CheckSquare className="w-4 h-4" /> Enter / Edit Marks ({ex.marks?.length || 0})
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Schedule New Exam</h2>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Title</label>
                <input
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. Unit Test 1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Type</label>
                <select
                  value={examForm.examType}
                  onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="UNIT_TEST">Unit Test</option>
                  <option value="MIDTERM">Midterm Exam</option>
                  <option value="FINAL">Final Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <select
                  value={examForm.classId}
                  onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
                <select
                  value={examForm.subjectId}
                  onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={examForm.totalMarks}
                    onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={examForm.passingMarks}
                    onChange={(e) => setExamForm({ ...examForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marks Modal */}
      {isMarksModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800">
              Enter Marks: {selectedExam.title} ({selectedExam.subject?.name})
            </h2>
            <div className="space-y-3">
              {students.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{st.firstName} {st.lastName}</div>
                    <div className="text-xs text-slate-400">Roll: {st.rollNumber || "N/A"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      max={selectedExam.totalMarks}
                      value={marksState[st.id!] ?? ""}
                      onChange={(e) => setMarksState({ ...marksState, [st.id!]: Number(e.target.value) })}
                      placeholder="Marks"
                      className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-center font-bold"
                    />
                    <span className="text-xs text-slate-400">/ {selectedExam.totalMarks}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setIsMarksModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSaveMarks} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Save Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
