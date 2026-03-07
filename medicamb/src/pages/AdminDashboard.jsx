import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users, Building2, Calendar, LogOut, Plus, Trash2, Edit3, Save,
  X, ChevronDown, ChevronUp, Shield, Activity, Clock, MapPin,
  Phone, Mail, Globe, RefreshCw, AlertTriangle, CheckCircle, Eye,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const API = import.meta.env.VITE_API_URL;

const TABS = ["Dashboard", "Hospitals", "Users"];

const SPECIALITY_OPTIONS = [
  "general", "surgery", "cardiology", "cancer", "orthopedics",
  "neurology", "pediatrics", "gynecology", "dermatology", "psychiatry",
  "radiology", "emergency", "ophthalmology", "ent", "urology",
];

const CATEGORY_OPTIONS = [
  "Multi-Specialty", "Super-Specialty", "Government", "Private",
  "Trust / NGO", "Dental", "Eye", "Maternity", "Rehabilitation", "Diagnostic",
];

const emptyHospital = {
  name: "", description: "",
  address: { line1: "", city: "", state: "", pincode: "", country: "India" },
  location: { type: "Point", coordinates: ["", ""] },
  specialities: [], categories: [],
  phone: "", email: "", website: "",
  isEmergency24x7: false,
  timings: "Mon-Sat: 8:00 AM - 8:00 PM",
  appointmentDirection: "",
  timeSlots: [],
};

// ---- Helpers ----
function adminAxios(adminToken) {
  return axios.create({ headers: { Authorization: `Bearer ${adminToken}` } });
}

// ---- Small Components ----
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center space-x-4`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function SlotEditor({ slots, onChange }) {
  const addSlot = () => onChange([...slots, { time: "", totalSlots: 10, bookedSlots: 0 }]);
  const removeSlot = (i) => onChange(slots.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const updated = [...slots];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">Time Slots</span>
        <button type="button" onClick={addSlot} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1">
          <Plus className="w-3 h-3" /><span>Add Slot</span>
        </button>
      </div>
      {slots.length === 0 && <p className="text-xs text-gray-500 italic">No slots added yet.</p>}
      {slots.map((slot, i) => (
        <div key={i} className="flex items-center space-x-2 mb-2">
          <Input value={slot.time} onChange={(e) => update(i, "time", e.target.value)} placeholder="09:00 AM"
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600 text-xs w-28" />
          <Input type="number" value={slot.totalSlots} onChange={(e) => update(i, "totalSlots", Number(e.target.value))} placeholder="Slots"
            className="bg-white/5 border-white/20 text-white text-xs w-16" min={1} />
          <span className="text-xs text-gray-500">total</span>
          <button type="button" onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((v) => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
              selected.includes(opt)
                ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                : "bg-white/5 border-white/15 text-gray-400 hover:border-white/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Hospital Form ----
function HospitalForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || emptyHospital);
  const set = (path, val) => {
    const keys = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      location: {
        ...form.location,
        coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])],
      },
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Hospital Name *</label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" placeholder="e.g. City Hospital" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Description</label>
          <textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={2}
            className="w-full rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            placeholder="Brief description..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Address Line 1 *</label>
          <Input value={form.address.line1} onChange={(e) => set("address.line1", e.target.value)} required
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">City</label>
          <Input value={form.address.city} onChange={(e) => set("address.city", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">State</label>
          <Input value={form.address.state} onChange={(e) => set("address.state", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Pincode</label>
          <Input value={form.address.pincode} onChange={(e) => set("address.pincode", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Country</label>
          <Input value={form.address.country} onChange={(e) => set("address.country", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Longitude *</label>
          <Input type="number" step="any" value={form.location.coordinates[0]} onChange={(e) => set("location.coordinates", [e.target.value, form.location.coordinates[1]])} required
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" placeholder="e.g. 72.8777" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Latitude *</label>
          <Input type="number" step="any" value={form.location.coordinates[1]} onChange={(e) => set("location.coordinates", [form.location.coordinates[0], e.target.value])} required
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" placeholder="e.g. 19.0760" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Phone</label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email</label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Website</label>
          <Input value={form.website} onChange={(e) => set("website", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Timings</label>
          <Input value={form.timings} onChange={(e) => set("timings", e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-600" placeholder="Mon-Sat: 8:00 AM - 8:00 PM" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Appointment Direction</label>
          <textarea value={form.appointmentDirection || ""} onChange={(e) => set("appointmentDirection", e.target.value)} rows={2}
            className="w-full rounded-xl bg-white/5 border border-white/20 text-white text-sm placeholder:text-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            placeholder="e.g. Call reception or walk in at OPD counter..." />
        </div>
        <div className="md:col-span-2">
          <MultiSelect label="Specialities" options={SPECIALITY_OPTIONS} selected={form.specialities} onChange={(v) => set("specialities", v)} />
        </div>
        <div className="md:col-span-2">
          <MultiSelect label="Categories" options={CATEGORY_OPTIONS} selected={form.categories} onChange={(v) => set("categories", v)} />
        </div>
        <div className="md:col-span-2">
          <SlotEditor slots={form.timeSlots} onChange={(v) => set("timeSlots", v)} />
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="emergency" checked={form.isEmergency24x7}
            onChange={(e) => set("isEmergency24x7", e.target.checked)}
            className="w-4 h-4 accent-red-500" />
          <label htmlFor="emergency" className="text-xs text-gray-300">24×7 Emergency</label>
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 rounded-xl disabled:opacity-60">
          {loading ? "Saving..." : <><Save className="w-4 h-4 mr-1" />Save Hospital</>}
        </Button>
        <Button type="button" onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 rounded-xl">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ---- Main Dashboard ----
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState(null); // null | "create" | { id, hospital }
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [slotModal, setSlotModal] = useState(null); // hospital object

  const adminToken = localStorage.getItem("adminToken");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await adminAxios(adminToken).get(`${API}/api/admin/stats`);
      setStats(res.data);
    } catch {}
  }, [adminToken]);

  const fetchHospitals = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await adminAxios(adminToken).get(`${API}/api/admin/hospitals`);
      setHospitals(res.data.hospitals || []);
    } catch { showToast("Failed to load hospitals", "error"); }
    finally { setLoading(false); }
  }, [adminToken]);

  const fetchUsers = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await adminAxios(adminToken).get(`${API}/api/admin/users`);
      setUsers(res.data.users || []);
    } catch { showToast("Failed to load users", "error"); }
    finally { setLoading(false); }
  }, [adminToken]);

  useEffect(() => {
    if (!adminToken) { navigate("/admin/login"); return; }
    fetchStats();
  }, [adminToken, navigate, fetchStats]);

  useEffect(() => {
    if (activeTab === "Hospitals") fetchHospitals();
    else if (activeTab === "Users") fetchUsers();
  }, [activeTab, fetchHospitals, fetchUsers]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Hospital actions
  const handleCreateHospital = async (data) => {
    setFormLoading(true);
    try {
      await adminAxios(adminToken).post(`${API}/api/admin/hospitals`, data);
      showToast("Hospital added successfully!");
      setFormMode(null);
      fetchHospitals();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create hospital", "error");
    } finally { setFormLoading(false); }
  };

  const handleUpdateHospital = async (data) => {
    setFormLoading(true);
    try {
      await adminAxios(adminToken).put(`${API}/api/admin/hospitals/${formMode.id}`, data);
      showToast("Hospital updated successfully!");
      setFormMode(null);
      fetchHospitals();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update hospital", "error");
    } finally { setFormLoading(false); }
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm("Delete this hospital?")) return;
    try {
      await adminAxios(adminToken).delete(`${API}/api/admin/hospitals/${id}`);
      showToast("Hospital deleted.");
      fetchHospitals();
      fetchStats();
    } catch {
      showToast("Failed to delete hospital", "error");
    }
  };

  const handleUpdateSlots = async (hospitalId, slots) => {
    try {
      await adminAxios(adminToken).patch(`${API}/api/admin/hospitals/${hospitalId}/slots`, { timeSlots: slots });
      showToast("Slots updated!");
      setSlotModal(null);
      fetchHospitals();
    } catch {
      showToast("Failed to update slots", "error");
    }
  };

  // User actions
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    try {
      await adminAxios(adminToken).put(`${API}/api/admin/users/${editUser._id}`, { name: editUser.name, email: editUser.email });
      showToast("User updated!");
      setEditUser(null);
      fetchUsers();
    } catch {
      showToast("Failed to update user", "error");
    } finally { setEditUserLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their data?")) return;
    try {
      await adminAxios(adminToken).delete(`${API}/api/admin/users/${id}`);
      showToast("User deleted.");
      fetchUsers();
      fetchStats();
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-xl
          ${toast.type === "error" ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white"}`}>
          {toast.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">MediCamb Admin</h1>
              <p className="text-xs text-gray-400">Administration Panel</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setFormMode(null); }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === DASHBOARD TAB === */}
        {activeTab === "Dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats?.userCount} color="from-sky-500 to-blue-500" />
              <StatCard icon={Building2} label="Registered Hospitals" value={stats?.hospitalCount} color="from-emerald-500 to-cyan-500" />
              <StatCard icon={Calendar} label="Total Appointments" value={stats?.appointmentCount} color="from-violet-500 to-purple-500" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Add Hospital", icon: Plus, color: "from-emerald-500 to-cyan-500", action: () => { setActiveTab("Hospitals"); setFormMode("create"); } },
                  { label: "Manage Hospitals", icon: Building2, color: "from-orange-500 to-amber-500", action: () => setActiveTab("Hospitals") },
                  { label: "Manage Users", icon: Users, color: "from-sky-500 to-indigo-500", action: () => setActiveTab("Users") },
                  { label: "Refresh Stats", icon: RefreshCw, color: "from-pink-500 to-rose-500", action: fetchStats },
                ].map((item) => (
                  <button key={item.label} onClick={item.action}
                    className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all space-y-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-300 font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === HOSPITALS TAB === */}
        {activeTab === "Hospitals" && (
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Hospital Management</h2>
              <Button onClick={() => setFormMode("create")}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl flex items-center space-x-1.5">
                <Plus className="w-4 h-4" /><span>Add Hospital</span>
              </Button>
            </div>

            {/* Create / Edit Form */}
            {formMode && (
              <div className="bg-white/5 border border-white/15 rounded-2xl p-5">
                <h3 className="text-base font-semibold text-white mb-4">
                  {formMode === "create" ? "Add New Hospital" : "Edit Hospital"}
                </h3>
                <HospitalForm
                  initial={formMode === "create" ? emptyHospital : formMode.hospital}
                  onSave={formMode === "create" ? handleCreateHospital : handleUpdateHospital}
                  onCancel={() => setFormMode(null)}
                  loading={formLoading}
                />
              </div>
            )}

            {/* Slot Modal */}
            {slotModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="bg-gray-900 border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Manage Slots — {slotModal.name}</h3>
                    <button onClick={() => setSlotModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <SlotEditorModal hospital={slotModal} onSave={handleUpdateSlots} onClose={() => setSlotModal(null)} />
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-gray-400 text-sm">Loading hospitals...</p>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No hospitals in the database yet.</p>
                <p className="text-xs mt-1">Click "Add Hospital" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hospitals.map((h) => (
                  <div key={h._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white">{h.name}</h3>
                          {h.isEmergency24x7 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300">24×7</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {[h.address?.line1, h.address?.city, h.address?.state, h.address?.pincode].filter(Boolean).join(", ")}
                        </p>
                        {h.timings && <p className="text-xs text-gray-500 mt-0.5"><Clock className="w-3 h-3 inline mr-1" />{h.timings}</p>}
                        {h.specialities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {h.specialities.map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-gray-400">{s}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{h.timeSlots?.length || 0} time slot(s)</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <button onClick={() => setSlotModal(h)}
                          className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs" title="Manage Slots">
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setFormMode({ id: h._id, hospital: { ...h, location: { ...h.location, coordinates: [...h.location.coordinates] } } })}
                          className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteHospital(h._id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === USERS TAB === */}
        {activeTab === "Users" && (
          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">User Management</h2>
              <button onClick={fetchUsers} className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <RefreshCw className="w-3.5 h-3.5" /><span>Refresh</span>
              </button>
            </div>

            {/* Edit user modal */}
            {editUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="bg-gray-900 border border-white/15 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Edit User</h3>
                    <button onClick={() => setEditUser(null)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <form onSubmit={handleUpdateUser} className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Name</label>
                      <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        className="bg-white/5 border-white/20 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email</label>
                      <Input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        className="bg-white/5 border-white/20 text-white" />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button type="submit" disabled={editUserLoading}
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl px-5 disabled:opacity-60">
                        {editUserLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button type="button" onClick={() => setEditUser(null)}
                        className="bg-white/10 text-white border border-white/20 rounded-xl px-5">Cancel</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-gray-400 text-sm">Loading users...</p>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No users found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u._id} className="bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                          <p className="text-[10px] text-gray-500">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setExpandedUser(expandedUser === u._id ? null : u._id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400">
                          {expandedUser === u._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setEditUser({ ...u })}
                          className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {expandedUser === u._id && (
                      <div className="border-t border-white/10 px-4 py-3">
                        <p className="text-xs text-gray-500">User ID: {u._id}</p>
                        <p className="text-xs text-gray-500">Last updated: {new Date(u.updatedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Slot editor in modal form
function SlotEditorModal({ hospital, onSave, onClose }) {
  const [slots, setSlots] = useState(hospital.timeSlots || []);
  return (
    <div className="space-y-4">
      <SlotEditor slots={slots} onChange={setSlots} />
      <div className="flex space-x-2 pt-2">
        <Button onClick={() => onSave(hospital._id, slots)}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl px-5">
          <Save className="w-4 h-4 mr-1" />Save Slots
        </Button>
        <Button onClick={onClose} className="bg-white/10 text-white border border-white/20 rounded-xl px-5">Cancel</Button>
      </div>
    </div>
  );
}

export default AdminDashboard;
