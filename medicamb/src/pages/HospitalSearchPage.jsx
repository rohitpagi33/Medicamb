"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Search,
  Filter,
  Building2,
  Phone,
  Globe,
  Stethoscope,
  Clock,
  CheckCircle,
  X,
  FileText,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const SPECIALITY_FILTERS = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "surgery", label: "Surgery" },
  { value: "cancer", label: "Cancer" },
  { value: "cardiology", label: "Cardiology" },
  { value: "emergency", label: "Emergency" },
]

const DEFAULT_RADIUS_KM = 20

const HospitalSearchPage = () => {
  const navigate = useNavigate()

  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [radius, setRadius] = useState(DEFAULT_RADIUS_KM)

  const [userLocation, setUserLocation] = useState(null)
  const [locError, setLocError] = useState("")

  const [selectedHospital, setSelectedHospital] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState("")
  const [createdAppointment, setCreatedAppointment] = useState(null)

  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    // Try to get user location on mount
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.")
      fetchHospitals()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        fetchHospitals({ lat: latitude, lng: longitude, radius: DEFAULT_RADIUS_KM, speciality, search })
      },
      () => {
        setLocError("Location access denied. Showing hospitals without distance.")
        fetchHospitals()
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchHospitals = async (options = {}) => {
    try {
      setLoading(true)
      setError("")

      const params = {}
      const { lat, lng, radius: r, speciality: s, search: q } = {
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        radius,
        speciality,
        search,
        ...options,
      }

      if (lat && lng) {
        params.lat = lat
        params.lng = lng
        params.radius = r
      }
      if (s) params.speciality = s
      if (q) params.q = q

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hospitals`, { params })
      setHospitals(res.data.hospitals || [])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load hospitals. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    fetchHospitals()
  }

  const resetBookingState = () => {
    setBookingError("")
    setBookingSuccess("")
    setCreatedAppointment(null)
    setPatientName("")
    setPatientEmail("")
    setPatientPhone("")
    setAppointmentDate("")
    setAppointmentTime("")
    setReason("")
  }

  const openBooking = (hospital) => {
    resetBookingState()
    setSelectedHospital(hospital)
  }

  const closeBooking = () => {
    setSelectedHospital(null)
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    if (!selectedHospital) return

    if (!appointmentDate || !appointmentTime || !patientName) {
      setBookingError("Please fill date, time and your name.")
      return
    }

    try {
      setBookingLoading(true)
      setBookingError("")
      setBookingSuccess("")

      const token = localStorage.getItem("token")
      if (!token) {
        setBookingError("Please log in to book an appointment.")
        return
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/appointments`,
        {
          hospitalId: selectedHospital._id,
          date: appointmentDate,
          time: appointmentTime,
          reason,
          patientName,
          patientEmail,
          patientPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setCreatedAppointment(res.data.appointment)
      setBookingSuccess("Appointment booked successfully! You can download the confirmation PDF.")
    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to book appointment. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!createdAppointment) return
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointments/${createdAppointment._id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      )

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `appointment-${createdAppointment._id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setBookingError("Failed to download PDF. Please try again.")
    }
  }

  const formatDistance = (distanceMeters) => {
    if (distanceMeters == null) return null
    const km = distanceMeters / 1000
    if (km < 1) return `${(distanceMeters).toFixed(0)} m`
    return `${km.toFixed(1)} km`
  }

  const openInMaps = (hospital) => {
    if (!hospital.location?.coordinates || hospital.location.coordinates.length < 2) return
    const [lng, lat] = hospital.location.coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="flex items-center justify-between p-4 max-w-6xl mx-auto w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Find Hospitals Near You</h1>
                  <p className="text-sm text-white/70">Search, filter, and book appointments in a few clicks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-white">
                <Filter className="w-4 h-4" />
                <span className="font-semibold text-sm uppercase tracking-wide">Search & Filters</span>
              </div>
              {locError && <p className="text-xs text-amber-300">{locError}</p>}
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2 flex items-center bg-white/5 border border-white/20 rounded-xl px-3">
                <Search className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by hospital, city, or pincode..."
                  className="bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-3">
                <Stethoscope className="w-4 h-4 text-white/50 flex-shrink-0" />
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="bg-transparent border-0 text-white text-sm flex-1 focus:outline-none"
                >
                  {SPECIALITY_FILTERS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-3">
                <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="bg-transparent border-0 text-white text-sm w-20 focus:outline-none"
                />
                <span className="text-xs text-white/60">km radius</span>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleApplyFilters}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Hospitals</span>
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-100 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Hospital List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-white/70 py-10">Loading hospitals...</div>
            ) : hospitals.length === 0 ? (
              <div className="text-center text-white/70 py-10">
                <p className="mb-2">No hospitals found for the selected filters.</p>
                <p className="text-sm text-white/50">Try increasing the radius or clearing some filters.</p>
              </div>
            ) : (
              hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h2 className="text-lg md:text-xl font-bold text-white mr-2">{hospital.name}</h2>
                      {hospital.isEmergency24x7 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[11px] font-medium text-red-200">
                          24x7 Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 mb-1">
                      {hospital.address?.line1},{" "}
                      {hospital.address?.city && `${hospital.address.city}, `}
                      {hospital.address?.state} - {hospital.address?.pincode}
                    </p>
                    {hospital.specialities && hospital.specialities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hospital.specialities.map((sp) => (
                          <span
                            key={sp}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/5 border border-white/20 text-[11px] uppercase tracking-wide text-white/70"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/60">
                      {hospital.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{hospital.phone}</span>
                        </span>
                      )}
                      {hospital.website && (
                        <button
                          onClick={() => window.open(hospital.website, "_blank")}
                          className="flex items-center space-x-1 hover:text-white/90"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Website</span>
                        </button>
                      )}
                      {typeof hospital.distance === "number" && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{formatDistance(hospital.distance)} away</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch md:items-end gap-2 md:gap-3">
                    <Button
                      variant="outline"
                      className="w-full md:w-auto bg-white/5 hover:bg-white/15 border-white/30 text-white text-sm flex items-center justify-center space-x-2"
                      onClick={() => openInMaps(hospital)}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>View on Maps</span>
                    </Button>
                    <Button
                      className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-medium flex items-center justify-center space-x-2"
                      onClick={() => openBooking(hospital)}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Booking Drawer / Modal */}
        {selectedHospital && (
          <div className="fixed inset-0 z-20 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full md:max-w-lg bg-slate-900 border border-white/20 rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span>Book Appointment</span>
                  </h2>
                  <p className="text-sm text-white/60">
                    {selectedHospital.name} &mdash; {selectedHospital.address?.city},{" "}
                    {selectedHospital.address?.state}
                  </p>
                </div>
                <button
                  onClick={closeBooking}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {bookingError && (
                <div className="mb-3 text-xs bg-red-500/20 border border-red-500/40 text-red-100 rounded-xl px-3 py-2">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="mb-3 text-xs bg-emerald-500/15 border border-emerald-500/40 text-emerald-100 rounded-xl px-3 py-2 flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Your Name *</label>
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Phone</label>
                    <Input
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      placeholder="Mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Email</label>
                    <Input
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      placeholder="Email (optional)"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-xs text-white/60 mb-1">Date *</label>
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-white/60 mb-1">Time *</label>
                      <Input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Reason / Symptoms</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/40 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="Short description (optional)"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
                  <div className="text-[11px] text-white/50 flex items-center space-x-2">
                    <FileText className="w-3 h-3" />
                    <span>After booking, you can download a PDF confirmation of your appointment.</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {createdAppointment && (
                      <Button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs px-4 py-2 rounded-full flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Download PDF</span>
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-semibold px-6 py-2 rounded-full flex items-center space-x-2 disabled:opacity-60"
                    >
                      {bookingLoading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Confirm Appointment</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HospitalSearchPage


