"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft, User as UserIcon, Mail, Calendar, MessageCircle,
  FileText, Loader2, Clock, Edit3, Save, X, Building2,
  Microscope, Camera, Bot, ChevronRight, Shield, LogOut,
  Activity, Heart,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editMode, setEditMode] = useState(false)

  const [appointments, setAppointments] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        if (!token) { navigate("/login"); return }

        const [meRes, apptRes, aiRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/ai/history`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setUser(meRes.data.user)
        setName(meRes.data.user.name || "")
        setAppointments(apptRes.data.appointments || [])
        setAiHistory(aiRes.data.history || [])
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError("")
      const token = localStorage.getItem("token")
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setUser(res.data.user)
      const localUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...localUser, name: res.data.user.name }))
      setEditMode(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const formatDate = (value) => {
    if (!value) return "—"
    return new Date(value).toLocaleString()
  }

  const QUICK_LINKS = [
    { icon: Camera, label: "Medicine Scanner", route: "/upload", color: "from-orange-500 to-amber-500" },
    { icon: Bot, label: "AI Doctor Chat", route: "/ai-chat", color: "from-sky-500 to-blue-500" },
    { icon: Building2, label: "Find Hospitals", route: "/hospitals", color: "from-emerald-500 to-cyan-500" },
    { icon: Microscope, label: "Report Analysis", route: "/report-analysis", color: "from-violet-500 to-purple-500" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Subtle background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.05),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.04),transparent_60%)]" />

      <div className="relative z-10">
        {/* Top navbar */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </button>
              <div className="h-5 w-px bg-white/10" />
              <h1 className="text-base font-bold text-white">My Profile</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Profile Hero Card */}
          <div className="bg-gray-900 border border-white/10 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/20 via-transparent to-sky-500/10 h-24 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Crect x=\"0\" y=\"0\" width=\"20\" height=\"20\"/%3E%3Crect x=\"20\" y=\"20\" width=\"20\" height=\"20\"/%3E%3C/g%3E%3C/svg%3E')]" />
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-xl shadow-orange-500/20 border-4 border-gray-900 text-3xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : null}
              </div>

              {!editMode ? (
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name || "—"}</h2>
                  <p className="text-gray-400 text-sm mt-0.5 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user?.email}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center space-x-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—"}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="mt-2 space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email (read-only)</label>
                    <div className="flex items-center px-3 py-2.5 rounded-xl bg-white/3 border border-white/10 text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />{user?.email}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={saving}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl px-5 disabled:opacity-60">
                      {saving ? "Saving..." : <><Save className="w-4 h-4 mr-1" />Save</>}
                    </Button>
                    <Button type="button" onClick={() => { setEditMode(false); setName(user?.name || "") }}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-4">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Appointments", value: appointments.length, icon: Calendar, color: "text-emerald-400" },
              { label: "AI Chats", value: aiHistory.length, icon: MessageCircle, color: "text-sky-400" },
              { label: "Days Active", value: user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt)) / 86400000) : 0, icon: Activity, color: "text-orange-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-900 border border-white/10 rounded-2xl p-4 text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.route)}
                  className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all space-y-2 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <link.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-300 font-medium text-center leading-tight">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Toggle */}
          <div className="flex space-x-1 bg-gray-900 border border-white/10 rounded-2xl p-1 w-fit">
            {[["overview", "Appointments"], ["ai", "AI Chat History"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeSection === key ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Appointments Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>My Appointments</span>
                </h2>
                <Button onClick={() => navigate("/hospitals")}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-lg">
                  + Book New
                </Button>
              </div>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No appointments booked yet</p>
                  <button onClick={() => navigate("/hospitals")} className="text-xs text-emerald-400 hover:text-emerald-300 mt-2">Find hospitals →</button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="px-5 py-4 hover:bg-white/3 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white text-sm">{appt.hospital?.name || "Hospital"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[appt.hospital?.addressLine1, appt.hospital?.city, appt.hospital?.state].filter(Boolean).join(", ")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(appt.date)}</span>
                          </p>
                          {appt.reason && <p className="text-xs text-gray-500 mt-0.5">Reason: {appt.reason}</p>}
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${
                          appt.status === "scheduled" ? "bg-sky-500/10 border-sky-500/30 text-sky-300" :
                          appt.status === "completed" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                          "bg-red-500/10 border-red-500/30 text-red-300"
                        }`}>
                          {appt.status || "scheduled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Chat History Section */}
          {activeSection === "ai" && (
            <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                  <span>AI Chat History</span>
                </h2>
                <Button onClick={() => navigate("/ai-chat")}
                  className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs px-3 py-1.5 rounded-lg">
                  New Chat
                </Button>
              </div>
              {aiHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No AI conversations yet</p>
                  <button onClick={() => navigate("/ai-chat")} className="text-xs text-sky-400 hover:text-sky-300 mt-2">Start chatting →</button>
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {[...aiHistory].reverse().map((item) => (
                    <div key={item._id} className="px-5 py-4 hover:bg-white/3 transition-colors">
                      <p className="text-[10px] text-gray-500 mb-1">{new Date(item.createdAt).toLocaleString()}</p>
                      <p className="text-sm text-white mb-1">
                        <span className="text-orange-400 font-medium">You: </span>
                        {item.question}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        <span className="text-sky-400 font-medium">AI: </span>
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage



