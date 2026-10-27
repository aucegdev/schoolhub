import { useState, useEffect } from "react";
import { Bus, Plus, Trash2, MapPin, Truck, Users, UserCheck, Navigation, Clock, IndianRupee, Edit3 } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";
import {
  listRoutes, createRoute, deleteRoute, 
  listAllocations, createAllocation, deleteAllocation,
  listVehicles, createVehicle, deleteVehicle, 
  listDrivers, createDriver, deleteDriver, 
} from "../../../services/transport";
import { listStudents, type Student } from "../../../services/student";

const TAB_CONFIG = [
  { key: "routes" as const, label: "Routes", icon: MapPin, color: "indigo" },
  { key: "vehicles" as const, label: "Vehicles", icon: Truck, color: "blue" },
  { key: "drivers" as const, label: "Drivers", icon: UserCheck, color: "emerald" },
  { key: "allocations" as const, label: "Allocations", icon: Users, color: "amber" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  RETIRED: "bg-red-100 text-red-700",
  INACTIVE: "bg-slate-100 text-slate-600",
};

export default function TransportPage() {
  const [tab, setTab] = useState<"routes" | "vehicles" | "drivers" | "allocations">("routes");

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transport Management</h1>
        <p className="text-sm text-slate-500 mt-1">Bus routes, vehicles, drivers, and student allocations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === t.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "routes" && <RoutesTab />}
      {tab === "vehicles" && <VehiclesTab />}
      {tab === "drivers" && <DriversTab />}
      {tab === "allocations" && <AllocationsTab />}
    </div>
  );
}

/* ─── Routes ─── */
function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ routeName: "", startPoint: "", endPoint: "", stops: "", pickupTime: "07:00", dropTime: "15:00", fareMonthly: 0 });

  const load = async () => setRoutes(await listRoutes());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.routeName || !form.startPoint || !form.endPoint) return;
    if (editing) {
      await createRoute({ ...form, id: editing.id } as any);
    } else {
      await createRoute(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ routeName: "", startPoint: "", endPoint: "", stops: "", pickupTime: "07:00", dropTime: "15:00", fareMonthly: 0 });
    load();
  };

  function handleEdit(r: any) {
    setEditing(r);
    setForm({
      routeName: r.routeName,
      startPoint: r.startPoint,
      endPoint: r.endPoint,
      stops: (r as any).stops?.join(", ") || "",
      pickupTime: r.pickupTime || "07:00",
      dropTime: r.dropTime || "15:00",
      fareMonthly: (r as any).fareMonthly || 0,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setForm({ routeName: "", startPoint: "", endPoint: "", stops: "", pickupTime: "07:00", dropTime: "15:00", fareMonthly: 0 }); setShowForm(!showForm); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} /> {showForm ? "Cancel" : "Add Route"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-slate-800">{editing ? "Edit Route" : "New Route"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Route Name" value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Start Point" value={form.startPoint} onChange={e => setForm({...form, startPoint: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="End Point" value={form.endPoint} onChange={e => setForm({...form, endPoint: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Stops (comma-separated)" value={form.stops} onChange={e => setForm({...form, stops: e.target.value})} />
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-3 text-slate-400" />
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm" type="time" value={form.pickupTime} onChange={e => setForm({...form, pickupTime: e.target.value})} />
            </div>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-3 text-slate-400" />
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm" type="time" value={form.dropTime} onChange={e => setForm({...form, dropTime: e.target.value})} />
            </div>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3 top-3 text-slate-400" />
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm" type="number" placeholder="Monthly Fare" value={form.fareMonthly} onChange={e => setForm({...form, fareMonthly: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">{editing ? "Update" : "Create"} Route</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {routes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl">
          <EmptyState icon={MapPin} title="No routes configured" description="Add bus routes to manage student transport." actionLabel="Add Route" onAction={() => setShowForm(true)} iconColor="text-indigo-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map(r => (
            <div key={r.id} className="card-lift bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{r.routeName}</h3>
                    <p className="text-xs text-slate-500">{r.startPoint} → {r.endPoint}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"><Edit3 size={14} /></button>
                  <button onClick={() => { if (confirm("Delete this route?")) { deleteRoute(r.id).then(load); } }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {r.pickupTime} – {r.dropTime}</span>
                <span className="flex items-center gap-1"><IndianRupee size={12} /> {(r as any).fareMonthly ? `₹${(r as any).fareMonthly}/mo` : "N/A"}</span>
              </div>
              {(r as any).stops?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(r as any).stops.map((s: string, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Vehicles ─── */
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} /> {showForm ? "Cancel" : "Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-slate-800">New Vehicle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={e => setForm({...form, vehicleNumber: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} />
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">Add Vehicle</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl">
          <EmptyState icon={Truck} title="No vehicles registered" description="Add school buses or vans to the fleet." actionLabel="Add Vehicle" onAction={() => setShowForm(true)} iconColor="text-blue-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="card-lift bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Bus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{v.vehicleNumber}</h3>
                    <p className="text-xs text-slate-500">{v.model || "No model"}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[v.status] || "bg-slate-100"}`}>{v.status}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Capacity: {v.capacity} seats</span>
              </div>
              <button onClick={() => { if (confirm("Delete this vehicle?")) { deleteVehicle(v.id).then(load); } }} className="w-full text-red-500 text-xs py-1.5 rounded-lg hover:bg-red-50 transition">Remove Vehicle</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Drivers ─── */
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} /> {showForm ? "Cancel" : "Add Driver"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-slate-800">New Driver</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="License Number" value={form.licenseNumber} onChange={e => setForm({...form, licenseNumber: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Experience (years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">Add Driver</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {drivers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl">
          <EmptyState icon={UserCheck} title="No drivers yet" description="Add licensed drivers to operate the school fleet." actionLabel="Add Driver" onAction={() => setShowForm(true)} iconColor="text-emerald-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map(d => (
            <div key={d.id} className="card-lift bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{d.firstName} {d.lastName}</h3>
                  <p className="text-xs text-slate-500">License: {d.licenseNumber}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                {d.phone && <p>{d.phone}</p>}
                {d.experience != null && <p>{d.experience} years experience</p>}
                {d.address && <p className="line-clamp-1">{d.address}</p>}
              </div>
              <button onClick={() => { if (confirm("Delete this driver?")) { deleteDriver(d.id).then(load); } }} className="w-full text-red-500 text-xs py-1.5 rounded-lg hover:bg-red-50 transition">Remove Driver</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Allocations ─── */
function AllocationsTab() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} /> {showForm ? "Cancel" : "Allocate Student"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-slate-800">New Allocation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={form.routeId} onChange={e => setForm({...form, routeId: e.target.value})}>
              <option value="">Select Route</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.routeName}</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber}</option>)}
            </select>
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 font-medium">Allocate</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {allocations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl">
          <EmptyState icon={Users} title="No allocations yet" description="Assign students to bus routes and vehicles." actionLabel="Allocate Student" onAction={() => setShowForm(true)} iconColor="text-amber-400" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {allocations.map(a => (
            <div key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-slate-900">{a.student?.firstName} {a.student?.lastName}</div>
                  <div className="text-xs text-slate-500">{a.route?.routeName} · {a.vehicle?.vehicleNumber} · Since {new Date(a.startDate).toLocaleDateString()}</div>
                </div>
              </div>
              <button onClick={() => { if (confirm("Remove allocation?")) { deleteAllocation(a.id).then(load); } }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
