import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, Shield, Bell, Clock, DollarSign, Globe } from "lucide-react";
import { listSettings, updateSetting, seedSettings, type Setting } from "../../../services/settings";

const CATEGORIES = [
  { key: "GENERAL", label: "General", icon: Settings },
  { key: "ACADEMIC", label: "Academic", icon: Clock },
  { key: "MODULES", label: "Modules", icon: Shield },
  { key: "NOTIFICATIONS", label: "Notifications", icon: Bell },
  { key: "SYSTEM", label: "System", icon: Globe },
  { key: "FEES", label: "Fees", icon: DollarSign },
  { key: "ATTENDANCE", label: "Attendance", icon: Clock },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changedKeys, setChangedKeys] = useState<Record<string, string>>({});

  useEffect(() => { loadSettings(); }, [activeCategory]);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await listSettings(activeCategory);
      setSettings(data);
      setChangedKeys({});
    } catch {
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    if (!confirm("Reset all settings to defaults? This will overwrite existing values.")) return;
    try {
      await seedSettings();
      setMessage({ type: "success", text: "Default settings restored" });
      loadSettings();
    } catch {
      setMessage({ type: "error", text: "Failed to seed settings" });
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      for (const [key, value] of Object.entries(changedKeys)) {
        await updateSetting(key, { value, category: activeCategory });
      }
      setMessage({ type: "success", text: `${Object.keys(changedKeys).length} setting(s) saved` });
      setChangedKeys({});
      await loadSettings();
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(key: string, value: string) {
    setChangedKeys(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure system preferences and module controls</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSeed} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm">
            <RefreshCw size={14} /> Reset Defaults
          </button>
          {Object.keys(changedKeys).length > 0 && (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg overflow-x-auto">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              <Icon size={14} /> {cat.label}
            </button>
          );
        })}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right ml-2 text-current opacity-50 hover:opacity-100">&times;</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading settings...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {settings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No settings in this category. Click "Save Changes" after modifying values.
            </div>
          ) : (
            settings.map(s => (
              <div key={s.key} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{s.key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.category} setting</div>
                </div>
                <div className="ml-4 w-64">
                  <input
                    type="text"
                    value={changedKeys[s.key] ?? s.value}
                    onChange={e => handleChange(s.key, e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}