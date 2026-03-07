import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle,
  Loader2, ChevronDown, X, Activity, Heart, Droplets,
  Thermometer, Beaker, Pill, Brain, Stethoscope,
  ShieldCheck, ShieldAlert, TrendingUp, TrendingDown,
  Lightbulb, ClipboardList, Bone,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid,
} from "recharts";

const REPORT_TYPES = [
  { label: "CBC (Complete Blood Count)", icon: Droplets, color: "text-red-400" },
  { label: "LFT (Liver Function Test)", icon: Beaker, color: "text-amber-400" },
  { label: "KFT (Kidney Function Test)", icon: Activity, color: "text-blue-400" },
  { label: "Lipid Profile", icon: Heart, color: "text-pink-400" },
  { label: "Thyroid (TFT)", icon: Thermometer, color: "text-purple-400" },
  { label: "Blood Sugar / HbA1c", icon: Droplets, color: "text-orange-400" },
  { label: "Blood Pressure Report", icon: Heart, color: "text-rose-400" },
  { label: "Diabetes Screening", icon: Pill, color: "text-teal-400" },
  { label: "Urine Routine (Urinalysis)", icon: Beaker, color: "text-yellow-400" },
  { label: "Urine Culture", icon: Beaker, color: "text-lime-400" },
  { label: "Stool Routine", icon: ClipboardList, color: "text-amber-400" },
  { label: "ECG / EEG Report", icon: Activity, color: "text-cyan-400" },
  { label: "Chest X-Ray", icon: Stethoscope, color: "text-gray-400" },
  { label: "Iron Studies", icon: Bone, color: "text-orange-400" },
  { label: "Vitamin D & B12", icon: Pill, color: "text-yellow-400" },
  { label: "Coagulation Profile (PT/INR)", icon: Droplets, color: "text-red-400" },
  { label: "Hormone Panel (Testosterone/Estrogen/FSH/LH)", icon: Brain, color: "text-indigo-400" },
];

const STATUS_CONFIG = {
  normal: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", label: "Normal", icon: CheckCircle },
  high: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", label: "High", icon: TrendingUp },
  low: { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400", label: "Low", icon: TrendingDown },
  critical: { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400", label: "Critical", icon: ShieldAlert },
};

const OVERALL_CONFIG = {
  normal: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400", label: "All Normal", icon: ShieldCheck },
  borderline: { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-400", label: "Borderline", icon: AlertTriangle },
  abnormal: { bg: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-400", label: "Abnormal", icon: ShieldAlert },
  critical: { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-400", label: "Critical", icon: ShieldAlert },
};

const URGENCY_CONFIG = {
  none: null,
  low: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300" },
  moderate: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
  high: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300" },
};

const BAR_COLORS = { normal: "#22c55e", high: "#f59e0b", low: "#3b82f6", critical: "#ef4444" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ParamBar({ param }) {
  const { name, value, unit, normalMin, normalMax, status } = param;
  const rangeSpan = normalMax - normalMin || 1;
  const pct = Math.min(Math.max(((value - normalMin) / rangeSpan) * 100, 0), 150);
  const barColor = BAR_COLORS[status] || BAR_COLORS.normal;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{name}</span>
          <StatusBadge status={status} />
        </div>
        <span className="text-sm font-bold text-white">
          {value} <span className="text-xs text-gray-400 font-normal">{unit}</span>
        </span>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-500">Min: {normalMin}</span>
        <span className="text-[10px] text-gray-500">Max: {normalMax}</span>
      </div>
    </div>
  );
}

function ParameterChart({ parameters }) {
  const data = parameters.map((p) => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name,
    value: p.value,
    status: p.status,
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-violet-400" />
        Values Overview
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(parameters.length * 38, 180)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#d1d5db", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#1e1b3a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 12, color: "#fff" }}
            labelStyle={{ color: "#a78bfa", fontWeight: 600 }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry, i) => (
              <Cell key={i} fill={BAR_COLORS[entry.status] || BAR_COLORS.normal} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusSummaryCards({ parameters }) {
  const counts = { normal: 0, high: 0, low: 0, critical: 0 };
  parameters.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });
  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(counts).map(([key, count]) => {
        const cfg = STATUS_CONFIG[key];
        const Icon = cfg.icon;
        return (
          <div key={key} className={`flex flex-col items-center p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <Icon className={`w-4 h-4 ${cfg.text} mb-1`} />
            <span className="text-lg font-bold text-white">{count}</span>
            <span className={`text-[10px] font-medium ${cfg.text}`}>{cfg.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function FallbackResult({ analysis, reportType }) {
  if (!analysis) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-violet-400" />
        Analysis — {reportType}
      </h3>
      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis}</div>
    </div>
  );
}

export default function ReportAnalysisPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedType) { setError("Please select a report type."); return; }
    if (!file) { setError("Please upload a report file."); return; }

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const formData = new FormData();
    formData.append("report", file);
    formData.append("reportType", selectedType);

    try {
      setLoading(true);
      setError("");
      setResult(null);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports/analyze`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } },
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const data = result?.structured;
  const hasStructured = !!data?.parameters?.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Activity className="w-5 h-5 text-violet-400" />
          <h1 className="text-lg font-bold">Medical Report Analysis</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <section className="grid md:grid-cols-2 gap-5">
          {/* Report Type Selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 1 — Select Report Type
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-900 border border-white/15 hover:border-violet-500/50 transition text-sm"
              >
                <span className={selectedType ? "text-white" : "text-gray-500"}>
                  {selectedType || "Choose report type…"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute z-20 top-full mt-1 w-full bg-gray-900 border border-white/15 rounded-lg shadow-2xl max-h-72 overflow-y-auto">
                  {REPORT_TYPES.map(({ label, icon: Icon, color }) => (
                    <button
                      key={label}
                      onClick={() => { setSelectedType(label); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-white/10 transition ${
                        selectedType === label ? "text-violet-300 bg-violet-500/10" : "text-gray-300"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 2 — Upload Report
            </label>
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/15 rounded-lg p-8 text-center cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/5 transition"
              >
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Drop file here or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP, or PDF — max 10 MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full rounded-lg max-h-40 object-contain bg-black/30" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg border border-white/10">
                    <FileText className="w-8 h-8 text-violet-400" />
                    <div>
                      <p className="text-sm text-white font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-black flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !selectedType || !file}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-500 font-semibold text-base flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Report…
            </>
          ) : (
            <>
              <Activity className="w-5 h-5" />
              Analyze Report
            </>
          )}
        </button>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
            <p className="text-white font-medium">AI is analyzing your report…</p>
            <p className="text-xs text-gray-500 mt-1">This may take 15–30 seconds</p>
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {result && !loading && (
          <div className="space-y-5">
            {hasStructured && (
              <>
                {/* Overall Status Banner */}
                {(() => {
                  const overall = OVERALL_CONFIG[data.overallStatus] || OVERALL_CONFIG.normal;
                  const OverallIcon = overall.icon;
                  return (
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${overall.bg} ${overall.border}`}>
                      <OverallIcon className={`w-6 h-6 ${overall.text}`} />
                      <div>
                        <p className={`text-sm font-bold ${overall.text}`}>Overall: {overall.label}</p>
                        <p className="text-sm text-gray-300 mt-0.5">{data.summary}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Urgency Banner */}
                {data.urgency && data.urgency !== "none" && URGENCY_CONFIG[data.urgency] && (
                  <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${URGENCY_CONFIG[data.urgency].bg} ${URGENCY_CONFIG[data.urgency].border}`}>
                    <AlertTriangle className={`w-5 h-5 ${URGENCY_CONFIG[data.urgency].text}`} />
                    <p className={`text-sm font-medium ${URGENCY_CONFIG[data.urgency].text}`}>
                      {data.urgencyNote}
                    </p>
                  </div>
                )}

                {/* Status Count Cards */}
                <StatusSummaryCards parameters={data.parameters} />

                {/* Chart */}
                <ParameterChart parameters={data.parameters} />

                {/* Parameter Detail Cards */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Detailed Parameters</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data.parameters.map((p, i) => (
                      <ParamBar key={i} param={p} />
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {data.suggestions?.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Health Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {data.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[11px] text-gray-600 text-center">
                  This analysis is AI-generated for informational purposes only. Always consult a qualified doctor for medical advice.
                </p>
              </>
            )}

            {/* Fallback: raw text if structured parsing failed */}
            {!hasStructured && (
              <FallbackResult analysis={result.analysis} reportType={result.reportType} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}