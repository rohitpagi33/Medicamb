"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User as UserIcon, Mail, Calendar, MessageCircle, FileText, Loader2, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [appointments, setAppointments] = useState([])
  const [aiHistory, setAiHistory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const [meRes, apptRes, aiRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/ai/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return ""
    return new Date(value).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">My Profile</h1>
                  <p className="text-sm text-white/70">Manage your account, appointments, and AI chats</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-100 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/70">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Loading profile...</span>
            </div>
          ) : (
            <>
              {/* Top: profile card + quick info */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">Account Info</h2>
                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Email</label>
                      <div className="flex items-center px-3 py-2 rounded-xl bg-white/5 border border-white/20 text-sm text-white/80">
                        <Mail className="w-4 h-4 mr-2 text-white/50" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-white/50 space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Member since{" "}
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-sm font-medium disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 space-y-3 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-300" />
                    <span className="font-semibold text-white">Appointments</span>
                  </div>
                  <p className="text-white/60 text-xs">
                    View your upcoming and past appointments. Download confirmation PDFs anytime.
                  </p>
                  <Button
                    onClick={() => navigate("/hospitals")}
                    className="w-full mt-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs rounded-full flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Book New Appointment</span>
                  </Button>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-sky-300" />
                    <span className="font-semibold text-white">AI Chat</span>
                  </div>
                  <p className="text-white/60 text-xs">
                    Your AI medical questions are stored so you can review them later.
                  </p>
                  <Button
                    onClick={() => navigate("/ai-chat")}
                    className="w-full mt-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xs rounded-full"
                  >
                    Continue AI Chat
                  </Button>
                </div>
              </div>

              {/* Bottom: appointments and AI chat history */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Appointments */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-300" />
                      <span>My Appointments</span>
                    </h2>
                  </div>

                  {appointments.length === 0 ? (
                    <p className="text-xs text-white/60">You have not booked any appointments yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {appointments.map((appt) => (
                        <div
                          key={appt._id}
                          className="border border-white/15 rounded-xl px-3 py-2 text-xs text-white/80 bg-white/5"
                        >
                          <div className="font-semibold text-white">
                            {appt.hospital?.name || "Hospital"}
                          </div>
                          <div className="text-white/60">
                            {[
                              appt.hospital?.addressLine1,
                              appt.hospital?.city,
                              appt.hospital?.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-white/70">{formatDate(appt.date)}</span>
                            <span className="capitalize text-xs text-white/60">
                              {appt.status || "scheduled"}
                            </span>
                          </div>
                          {appt.reason && (
                            <div className="mt-1 text-white/60 truncate">Reason: {appt.reason}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Chat history */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-sky-300" />
                      <span>AI Chat History</span>
                    </h2>
                  </div>

                  {aiHistory.length === 0 ? (
                    <p className="text-xs text-white/60">You have not asked any AI questions yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {aiHistory
                        .slice()
                        .reverse()
                        .map((item) => (
                          <div
                            key={item._id}
                            className="border border-white/15 rounded-xl px-3 py-2 text-xs text-white/80 bg-white/5"
                          >
                            <div className="text-[10px] text-white/50 mb-1">
                              {new Date(item.createdAt).toLocaleString()}
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold text-orange-300">You: </span>
                              <span>{item.question}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-sky-300">AI: </span>
                              <span className="line-clamp-3">{item.answer}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage


