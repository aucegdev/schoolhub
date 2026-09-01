import { useState, useEffect } from "react";
import { MoveUp, MoveDown, Save, RotateCcw, Eye, Edit3, Check } from "lucide-react";
import SchoolHome, { DEFAULT_DASHBOARD_CONFIG, type DashboardConfig } from "../public/SchoolHome";

export default function DashboardCustomizer() {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD_CONFIG);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("schoolhub_dashboard_config_v1");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("schoolhub_dashboard_config_v1", JSON.stringify(config));
    setMessage("Dashboard settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset home dashboard layout to default settings?")) {
      setConfig(DEFAULT_DASHBOARD_CONFIG);
      localStorage.removeItem("schoolhub_dashboard_config_v1");
      setMessage("Reset to default settings.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const moveWidget = (index: number, direction: "up" | "down") => {
    const newOrder = [...config.widgetOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setConfig({ ...config, widgetOrder: newOrder });
  };

  const WIDGET_NAMES: Record<string, string> = {
    announcement: "📢 Top Announcement Marquee",
    stats: "📊 Key Statistics Counter Cards",
    features: "⚡ Smart Management Modules Grid",
    students_avatars: "🧑🎓 Interactive Student Profiles Showcase",
    quote: "💬 Educational Thought of the Day",
    admissions: "🚀 Call to Action Banner",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Home Dashboard Customizer</h1>
          <p className="text-sm text-slate-500">Configure content, announcements, and reorder home page widgets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${activeTab === "edit" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Layout
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${activeTab === "preview" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      {activeTab === "preview" ? (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800 text-white px-4 py-2 text-xs font-mono flex justify-between items-center">
            <span>LIVE PREVIEW MODE</span>
            <span className="text-emerald-400 font-bold">● Active Customization</span>
          </div>
          <SchoolHome />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Editor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Hero & Announcement Text</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Title</label>
                <textarea
                  rows={2}
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Announcement Marquee Text</label>
                <input
                  type="text"
                  value={config.announcement}
                  onChange={(e) => setConfig({ ...config, announcement: e.target.value })}
                  placeholder="Enter notice/announcement"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Widget Placement / Reordering */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Widget Placement & Layout Order</h2>
              <p className="text-xs text-slate-500">Reorder widgets to customize home page hierarchy</p>
            </div>

            <div className="space-y-3">
              {config.widgetOrder.map((widgetId, index) => (
                <div
                  key={widgetId}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-indigo-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm text-slate-800">{WIDGET_NAMES[widgetId] || widgetId}</span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => moveWidget(index, "up")}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded disabled:opacity-30 transition"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === config.widgetOrder.length - 1}
                      onClick={() => moveWidget(index, "down")}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded disabled:opacity-30 transition"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
