import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Microscope, Upload, FileText, CheckCircle,
  AlertTriangle, Loader2, ChevronDown, X, Activity, Info,
} from "lucide-react";
import { Button } from "../components/ui/button";

const REPORT_TYPES = [
  "CBC (Complete Blood Count)",
  "LFT (Liver Function Test)",
  "KFT (Kidney Function Test)",
  "Lipid Profile",
  "Thyroid (TFT)",
  "Blood Sugar / HbA1c",
  "Urine Routine (Urinalysis)",
  "Urine Culture",
  "Stool Routine",
  "ECG / EEG Report",
  "MRI / CT Scan (Brain)",
  "MRI Spine",
  "Chest X-Ray",
  "Bone Density (DEXA)",
  "Iron Studies",
  "Vitamin D & B12",
  "Coagulation Profile (PT/INR)",
  "Semen Analysis",
  "Hormone Panel (Testosterone/Estrogen/FSH/LH)",
  "COVID / Dengue / Malaria Test",
];

const ReportAnalysisPage = () => {
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
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(f);
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
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
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
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatAnalysis = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.replace(/\*\*/g, "")}</h3>;
      }
      if (line.match(/^\*\*.*\*\*/)) {
        return <p key={i} className="text-sm text-white my-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={i} className="text-sm text-gray-300 ml-4 my-0.5">{line.slice(2)}</li>;
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm text-gray-300 my-0.5">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(139,92,246,0.4) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Medical Report Analysis</h1>
              <p className="text-xs text-gray-400">AI-powered analysis with normal range comparison</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 mb-6 flex items-start space-x-3">
          <Info className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-violet-200 leading-relaxed">
            Upload your medical report (image or PDF) and our AI will analyze the values, compare them with medical normal ranges, and give you a clear health summary with suggestions. This is for informational purposes only — always consult a doctor for medical advice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Upload Panel */}
          <div className="space-y-4">
            {/* Step 1: Select Report Type */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">1</div>
                <h2 className="text-sm font-semibold text-white">Select Report Type</h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-left hover:border-violet-500/50 transition-colors"
                >
                  <span className={selectedType ? "text-white text-sm" : "text-gray-500 text-sm"}>
                    {selectedType || "Choose report type..."}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-slate-900 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {REPORT_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => { setSelectedType(type); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                          selectedType === type ? "text-violet-300 bg-violet-500/10" : "text-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Upload File */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">2</div>
                <h2 className="text-sm font-semibold text-white">Upload Report</h2>
              </div>

              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
                >
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 font-medium">Drop file here or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP, or PDF — max 10MB</p>
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
                    <img src={preview} alt="Report preview" className="w-full rounded-xl max-h-48 object-contain bg-black/30" />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <FileText className="w-8 h-8 text-violet-400" />
                      <div>
                        <p className="text-sm text-white font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center space-x-2 text-sm text-red-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !selectedType || !file}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold text-base rounded-2xl disabled:opacity-50 shadow-lg shadow-violet-500/25 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Report...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Analyze Report</span>
                </>
              )}
            </Button>
          </div>

          {/* Right: Results */}
          <div>
            {!result && !loading && (
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-64">
                <Microscope className="w-14 h-14 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">Analysis results will appear here</p>
                <p className="text-xs text-gray-500 mt-2">Select a report type, upload your file, and click Analyze</p>
              </div>
            )}

            {loading && (
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-64">
                <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                <p className="text-white font-medium">AI is analyzing your report...</p>
                <p className="text-xs text-gray-400 mt-2">This may take 15–30 seconds</p>
              </div>
            )}

            {result && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {/* Result header */}
                <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-b border-white/10 px-5 py-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Analysis Complete</p>
                    <p className="text-xs text-gray-400">{result.reportType}</p>
                  </div>
                </div>

                {/* Normal ranges */}
                {result.normalRanges && (
                  <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <p className="text-xs font-semibold text-emerald-400 mb-1 flex items-center space-x-1">
                      <Info className="w-3 h-3" /><span>Reference Normal Ranges</span>
                    </p>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">{result.normalRanges}</p>
                  </div>
                )}

                {/* Analysis */}
                <div className="px-5 py-4 max-h-[480px] overflow-y-auto">
                  <div className="text-sm leading-relaxed">
                    {formatAnalysis(result.analysis)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysisPage;
