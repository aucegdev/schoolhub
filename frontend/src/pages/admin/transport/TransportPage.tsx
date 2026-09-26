import { useState, useEffect } from "react";
import { Bus, Plus, Trash2 } from "lucide-react";
import {
  listRoutes, createRoute, deleteRoute,
  listAllocations, createAllocation, deleteAllocation,
  listVehicles, createVehicle, deleteVehicle,
  listDrivers, createDriver, deleteDriver,
} from "../../../services/transport";
import { listStudents } from "../../../services/student";

export default function TransportPage() {
  const [tab, setTab] = useState<"routes" | "vehicles" | "drivers" | "allocations">("routes");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Transport</h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">Bus routes, vehicles, drivers, and student transport allocations</p>

      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
        {(["routes", "vehicles", "drivers", "allocations"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "routes" && <RoutesTab />}
      {tab === "vehicles" && <VehiclesTab />}
      {tab === "drivers" && <DriversTab />}
      {tab === "allocations" && <AllocationsTab />}
    </div>
  );
}

/* Routes */

function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ routeName: "", startPoint: "", endPoint: "", stops: "", pickupTime: "07:00", dropTime: "15:00", fareMonthly: 0 });

  const load = async () => setRoutes(await listRoutes());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.routeName || !form.startPoint || !form.endPoint) return;
    await createRoute(form);
    setShowForm(false);
    setForm({ routeName: "", startPoint: "", endPoint: "", stops: "", pickupTime: "07:00", dropTime: "15:00", fareMonthly: 0 });
    load();
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm mb-4"><Plus size={16} /> Add Route</button>

      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input className="col-span-2 border rounded-lg px-3 py-2 text-sm" placeholder="Route Name" value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Start Point" value={form.startPoint} onChange={e => setForm({...form, startPoint: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="End Point" value={form.endPoint} onChange={e => setForm({...form, endPoint: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Stops (comma-separated)" value={form.stops} onChange={e => setForm({...form, stops: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="time" value={form.pickupTime} onChange={e => setForm({...form, pickupTime: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="time" value={form.dropTime} onChange={e => setForm({...form, dropTime: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="number" placeholder="Monthly Fare" value={form.fareMonthly} onChange={e => setForm({...form, fareMonthly: Number(e.target.value)})} />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {routes.map(r => (
          <div key={r.id} className="flex items-center justify-between p-4">
            <div><div className="font-medium">{r.routeName}</div><div className="text-sm text-slate-500">{r.startPoint} → {r.endPoint} | ₹{r.fareMonthly}/mo</div></div>
            <button onClick={() => confirm("Delete this route?") && deleteRoute(r.id).then(load)} className="text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {!routes.length && <div className="p-8 text-center text-slate-400 text-sm">No routes found. Create one above.</div>}
      </div>
    </div>
  );
}

/* Vehicles */

function VehiclesTab() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicleNumber: "", model: "", capacity: 30, status: "ACTIVE" });

  const load = async () => setVehicles(await listVehicles());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.vehicleNumber) return;
    await createVehicle(form);
    setShowForm(false);
    setForm({ vehicleNumber: "", model: "", capacity: 30, status: "ACTIVE" });
    load();
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4"><Plus size={16} /> Add Vehicle</button>

      {showForm && (
        <div className="bg-slate-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={e => setForm({...form, vehicleNumber: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} />
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="ACTIVE">Active</option><option value="MAINTENANCE">Maintenance</option><option value="RETIRED">Retired</option></select>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {vehicles.map(v => (
          <div key={v.id} className="flex items-center justify-between p-4">
            <div><div className="font-medium"><Bus size={14} className="inline mr-1" />{v.vehicleNumber}</div><div className="text-sm text-slate-500">{v.model || "No model"} | Capacity: {v.capacity} | {v.status}</div></div>
            <button onClick={() => confirm("Delete this vehicle?") && deleteVehicle(v.id).then(load)} className="text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {!vehicles.length && <div className="p-8 text-center text-slate-400 text-sm">No vehicles found.</div>}
      </div>
    </div>
  );
}

/* Drivers */

function DriversTab() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", licenseNumber: "", experience: "", address: "" });

  const load = async () => setDrivers(await listDrivers());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.licenseNumber) return;
    await createDriver({ ...form, experience: form.experience ? Number(form.experience) : undefined } as any);
    setShowForm(false);
    setForm({ firstName: "", lastName: "", phone: "", licenseNumber: "", experience: "", address: "" });
    load();
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4"><Plus size={16} /> Add Driver</button>

      {showForm && (
        <div className="bg-slate-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="License Number" value={form.licenseNumber} onChange={e => setForm({...form, licenseNumber: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="number" placeholder="Experience (years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <button onClick={handleSave} className="col-span-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {drivers.map(d => (
          <div key={d.id} className="flex items-center justify-between p-4">
            <div><div className="font-medium">{d.firstName} {d.lastName}</div><div className="text-sm text-slate-500">{d.phone} | License: {d.licenseNumber} | Exp: {d.experience} yrs</div></div>
            <button onClick={() => confirm("Delete this driver?") && deleteDriver(d.id).then(load)} className="text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {!drivers.length && <div className="p-8 text-center text-slate-400 text-sm">No drivers found.</div>}
      </div>
    </div>
  );
}

/* Allocations */

function AllocationsTab() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: "", routeId: "", vehicleId: "", startDate: "", endDate: "", status: "ACTIVE" });

  const load = async () => {
    const [a, s, r, v] = await Promise.all([
      listAllocations(),
      listStudents({ status: "ACTIVE", page: 1 }),
      listRoutes(),
      listVehicles(),
    ]);
    setAllocations(a);
    setStudents(s.students);
    setRoutes(r);
    setVehicles(v);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.studentId || !form.routeId || !form.vehicleId) return;
    await createAllocation(form);
    setShowForm(false);
    setForm({ studentId: "", routeId: "", vehicleId: "", startDate: "", endDate: "", status: "ACTIVE" });
    load();
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4"><Plus size={16} /> Allocate Student</button>

      {showForm && (
        <div className="bg-slate-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}</select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.routeId} onChange={e => setForm({...form, routeId: e.target.value})}><option value="">Select Route</option>{routes.map(r => <option key={r.id} value={r.id}>{r.routeName}</option>)}</select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value})}><option value="">Select Vehicle</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber}</option>)}</select>
          <input className="border rounded-lg px-3 py-2 text-sm" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          <input className="border rounded-lg px-3 py-2 text-sm" type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          <button onClick={handleSave} className="col-span-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Allocate</button>
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {allocations.map(a => (
          <div key={a.id} className="flex items-center justify-between p-4">
            <div><div className="font-medium">{a.student?.firstName} {a.student?.lastName}</div><div className="text-sm text-slate-500">{a.route?.routeName} | {a.vehicle?.vehicleNumber} | Since: {new Date(a.startDate).toLocaleDateString()}</div></div>
            <button onClick={() => confirm("Remove allocation?") && deleteAllocation(a.id).then(load)} className="text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {!allocations.length && <div className="p-8 text-center text-slate-400 text-sm">No allocations found.</div>}
      </div>
    </div>
  );
}