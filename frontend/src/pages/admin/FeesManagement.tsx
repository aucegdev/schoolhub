import { useEffect, useState } from "react";
import { Plus, DollarSign, Calendar, CreditCard } from "lucide-react";
import { listClasses, type ClassData } from "../../services/class";
import { listFeeStructures, createFeeStructure, recordFeePayment, type FeeStructure } from "../../services/fees";
import { listStudents, type Student } from "../../services/student";

export default function FeesManagement() {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  const [message, setMessage] = useState("");

  const [structureForm, setStructureForm] = useState({
    title: "",
    classId: "",
    amount: 1000,
    dueDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    amountPaid: 1000,
    paymentMode: "ONLINE",
    transactionId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sList, cList, stList] = await Promise.all([
        listFeeStructures(),
        listClasses(),
        listStudents(),
      ]);
      setStructures(sList);
      setClasses(cList);
      setStudents(stList.students);
      if (cList.length > 0) setStructureForm((f) => ({ ...f, classId: cList[0].id }));
      if (stList.students.length > 0) setPaymentForm((f) => ({ ...f, studentId: stList.students[0].id! }));
    } catch {}
  };

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createFeeStructure(structureForm);
      setIsStructureModalOpen(false);
      await loadData();
      setMessage("Fee structure created successfully!");
    } catch {
      setMessage("Failed to create fee structure");
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStructure) return;
    setMessage("");
    try {
      await recordFeePayment({
        feeStructureId: selectedStructure.id,
        studentId: paymentForm.studentId,
        amountPaid: Number(paymentForm.amountPaid),
        paymentMode: paymentForm.paymentMode,
        transactionId: paymentForm.transactionId || `TXN-${Date.now()}`,
      });
      setIsPaymentModalOpen(false);
      await loadData();
      setMessage("Fee payment recorded successfully!");
    } catch {
      setMessage("Failed to record fee payment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fees & Billing Management</h1>
          <p className="text-sm text-slate-500">Configure fee structures and collect student payments</p>
        </div>
        <button
          onClick={() => setIsStructureModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create Fee Structure
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </div>
      )}

      {/* Fee Structures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structures.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
            No fee structures defined. Click "Create Fee Structure" to add one.
          </div>
        ) : (
          structures.map((st) => (
            <div key={st.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{st.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">{st.description || "No description"}</div>
                </div>
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="text-2xl font-bold text-slate-800">
                  ₹{st.amount.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date: {new Date(st.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStructure(st);
                  setPaymentForm((f) => ({ ...f, amountPaid: st.amount }));
                  setIsPaymentModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition"
              >
                <CreditCard className="w-4 h-4" /> Record Payment ({st.payments?.length || 0})
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Structure Modal */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-800">New Fee Structure</h2>
            <form onSubmit={handleCreateStructure} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  required
                  value={structureForm.title}
                  onChange={(e) => setStructureForm({ ...structureForm, title: e.target.value })}
                  placeholder="e.g. Term 1 Tuition Fee"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <select
                  value={structureForm.classId}
                  onChange={(e) => setStructureForm({ ...structureForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={structureForm.amount}
                    onChange={(e) => setStructureForm({ ...structureForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={structureForm.dueDate}
                    onChange={(e) => setStructureForm({ ...structureForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <input
                  value={structureForm.description}
                  onChange={(e) => setStructureForm({ ...structureForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsStructureModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedStructure && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Record Payment: {selectedStructure.title}
            </h2>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student</label>
                <select
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.admissionNo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="ONLINE">Online / UPI</option>
                  <option value="CARD">Card</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref ID</label>
                <input
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  placeholder="Optional transaction reference"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
