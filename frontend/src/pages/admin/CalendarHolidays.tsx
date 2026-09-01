import { useEffect, useState } from "react";
import { type Holiday, type CalendarData, getCalendar, addHoliday, removeHoliday } from "../../services/calendar";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarHolidays() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [holidayForm, setHolidayForm] = useState({ name: "", date: "", type: "PUBLIC" as Holiday["type"], isRecurring: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCalendar();
  }, [month, year]);

  const loadCalendar = async () => {
    try {
      setCalendar(await getCalendar(month, year));
    } catch {}
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await addHoliday(holidayForm);
      setHolidayForm({ name: "", date: "", type: "PUBLIC", isRecurring: false });
      await loadCalendar();
      setMessage("Holiday added");
    } catch {
      setMessage("Failed to add holiday");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeHoliday(id);
      await loadCalendar();
    } catch {}
  };

  const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const firstDay = (m: number, y: number) => new Date(y, m - 1, 1).getDay();

  const holidayMap = new Map<string, Holiday[]>();
  calendar?.holidays?.forEach((h) => {
    const key = new Date(h.date).toDateString();
    if (!holidayMap.has(key)) holidayMap.set(key, []);
    holidayMap.get(key)!.push(h);
  });

  const today = new Date();

  return (
    <div>
      <h1>Calendar & Holidays</h1>
      {message && <p className={message.includes("Failed") ? "error" : "success"}>{message}</p>}

      <div className="module-grid">
        <div className="module-card">
          <div className="calendar-header">
            <button onClick={() => { if (month === 1) { setMonth(12); setYear(year - 1); } else { setMonth(month - 1); } }}>&lt;</button>
            <h2>{MONTHS[month - 1]} {year}</h2>
            <button onClick={() => { if (month === 12) { setMonth(1); setYear(year + 1); } else { setMonth(month + 1); } }}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {Array.from({ length: firstDay(month, year) }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty" />
            ))}
            {Array.from({ length: daysInMonth(month, year) }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month - 1, day);
              const dateStr = date.toDateString();
              const isHoliday = holidayMap.has(dateStr);
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div key={day} className={`calendar-day ${isHoliday ? "holiday" : ""} ${isToday ? "today" : ""}`}>
                  <span className="day-number">{day}</span>
                  {isHoliday && <span className="holiday-dot" title={holidayMap.get(dateStr)?.map((h) => h.name).join(", ")} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="module-card">
          <h2>Add Holiday</h2>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Holiday Name</label>
              <input value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} placeholder="e.g. Diwali" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={holidayForm.type} onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value as Holiday["type"] })}>
                <option value="PUBLIC">Public</option>
                <option value="ACADEMIC">Academic</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={holidayForm.isRecurring} onChange={(e) => setHolidayForm({ ...holidayForm, isRecurring: e.target.checked })} />
                {" "}Recurring (annual)
              </label>
            </div>
            <button type="submit">Add Holiday</button>
          </form>
        </div>
      </div>

      <div className="module-card" style={{ marginTop: 20 }}>
        <h2>All Holidays</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Date</th><th>Type</th><th>Recurring</th><th></th></tr>
          </thead>
          <tbody>
            {(calendar?.holidays || []).map((h) => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{new Date(h.date).toLocaleDateString()}</td>
                <td>{h.type}</td>
                <td>{h.isRecurring ? "Yes" : "No"}</td>
                <td><button className="btn-danger" onClick={() => handleRemove(h.id!)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
