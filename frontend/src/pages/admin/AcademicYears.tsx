import { useEffect, useState } from "react";
import { type AcademicYear, listAcademicYears, createAcademicYear, updateAcademicYear } from "../../services/academicYear";
import { type Term, listTerms, createTerm, updateTerm } from "../../services/term";

const emptyYear = { name: "", startDate: "", endDate: "", isActive: true };
const emptyTerm = { name: "", academicYearId: "", startDate: "", endDate: "", isActive: true };

export default function AcademicYears() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [yearForm, setYearForm] = useState<Omit<AcademicYear, "id">>(emptyYear);
  const [termForm, setTermForm] = useState<Omit<Term, "id">>(emptyTerm);
  const [editingYearId, setEditingYearId] = useState<string | null>(null);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYearId) loadTerms(selectedYearId);
  }, [selectedYearId]);

  const loadYears = async () => {
    try {
      const data = await listAcademicYears();
      setYears(data);
      if (data.length > 0 && !selectedYearId) {
        setSelectedYearId(data[0].id!);
      }
    } catch {}
  };

  const loadTerms = async (yearId: string) => {
    try {
      setTerms(await listTerms(yearId));
    } catch {}
  };

  const handleYearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingYearId) {
        await updateAcademicYear(editingYearId, yearForm);
      } else {
        await createAcademicYear(yearForm);
      }
      setYearForm(emptyYear);
      setEditingYearId(null);
      await loadYears();
      setMessage("Academic year saved successfully");
    } catch {
      setMessage("Failed to save academic year");
    }
  };

  const editYear = (year: AcademicYear) => {
    setEditingYearId(year.id!);
    setYearForm({
      name: year.name,
      startDate: year.startDate.slice(0, 10),
      endDate: year.endDate.slice(0, 10),
      isActive: year.isActive,
    });
  };

  const handleTermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingTermId) {
        await updateTerm(editingTermId, termForm);
      } else {
        await createTerm({ ...termForm, academicYearId: selectedYearId });
      }
      setTermForm(emptyTerm);
      setEditingTermId(null);
      await loadTerms(selectedYearId);
      setMessage("Term saved successfully");
    } catch {
      setMessage("Failed to save term");
    }
  };

  const editTerm = (term: Term) => {
    setEditingTermId(term.id!);
    setTermForm({
      name: term.name,
      academicYearId: term.academicYearId,
      startDate: term.startDate.slice(0, 10),
      endDate: term.endDate.slice(0, 10),
      isActive: term.isActive,
    });
  };

  return (
    <div>
      <h1>Academic Years & Terms</h1>
      {message && <p className={message.includes("Failed") ? "error" : "success"}>{message}</p>}

      <div className="module-grid">
        <div className="module-card">
          <h2>{editingYearId ? "Edit" : "Add"} Academic Year</h2>
          <form onSubmit={handleYearSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input value={yearForm.name} onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })} placeholder="e.g. 2026-2027" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={yearForm.startDate} onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={yearForm.endDate} onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={yearForm.isActive} onChange={(e) => setYearForm({ ...yearForm, isActive: e.target.checked })} />
                {" "}Active
              </label>
            </div>
            <button type="submit">{editingYearId ? "Update" : "Create"}</button>
            {editingYearId && <button type="button" className="btn-secondary" onClick={() => { setEditingYearId(null); setYearForm(emptyYear); }}>Cancel</button>}
          </form>
        </div>

        <div className="module-card">
          <h2>Academic Years</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Period</th><th>Status</th><th>Terms</th><th></th></tr>
            </thead>
            <tbody>
              {years.map((y) => (
                <tr key={y.id} className={selectedYearId === y.id ? "selected" : ""} onClick={() => setSelectedYearId(y.id!)}>
                  <td>{y.name}</td>
                  <td>{new Date(y.startDate).toLocaleDateString()} - {new Date(y.endDate).toLocaleDateString()}</td>
                  <td>{y.isActive ? "Active" : "Inactive"}</td>
                  <td>{y._count?.terms || 0}</td>
                  <td><button type="button" onClick={(e) => { e.stopPropagation(); editYear(y); }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedYearId && (
        <div className="module-card" style={{ marginTop: 20 }}>
          <h2>Terms for {years.find((y) => y.id === selectedYearId)?.name}</h2>
          <div className="inline-form">
            <div className="form-group">
              <label>Term Name</label>
              <input value={termForm.name} onChange={(e) => setTermForm({ ...termForm, name: e.target.value })} placeholder="e.g. Term 1" />
            </div>
            <div className="form-group">
              <label>Start</label>
              <input type="date" value={termForm.startDate} onChange={(e) => setTermForm({ ...termForm, startDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>End</label>
              <input type="date" value={termForm.endDate} onChange={(e) => setTermForm({ ...termForm, endDate: e.target.value })} />
            </div>
            <button onClick={handleTermSubmit} style={{ marginTop: 22 }}>{editingTermId ? "Update" : "Add"} Term</button>
            {editingTermId && <button type="button" className="btn-secondary" style={{ marginTop: 22 }} onClick={() => { setEditingTermId(null); setTermForm(emptyTerm); }}>Cancel</button>}
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Period</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {terms.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</td>
                  <td>{t.isActive ? "Active" : "Inactive"}</td>
                  <td><button type="button" onClick={() => editTerm(t)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
