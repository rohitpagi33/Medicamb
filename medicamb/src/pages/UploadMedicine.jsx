"use client"

import { useState, useRef } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import {
  Upload,
  Camera,
  ImageIcon,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Shield,
  Eye,
  FileText,
  Sparkles,
  ArrowLeft,
  Info,
  Clock,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const UploadMedicine = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [medicineName, setMedicineName] = useState("")
  const [aiDetails, setAiDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    processFile(f)
  }

  const processFile = (f) => {
    if (!f) return

    // Validate file type
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }

    // Validate file size (max 10MB)
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setFile(f)
    setPreview(URL.createObjectURL(f))
    setMedicineName("")
    setAiDetails("")
    setError("")
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError("")
    setMedicineName("")
    setAiDetails("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/identify`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.data.error) throw new Error(res.data.error)

      setMedicineName(res.data.medicineName)
      setAiDetails(res.data.aiDetails)
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to identify medicine. Please try again.")
    }

    setLoading(false)
  }

  const clearFile = () => {
    setFile(null)
    setPreview("")
    setMedicineName("")
    setAiDetails("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fillOpacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div> */}
       <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}
      ></div>
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Medicine Scanner</h1>
                    <p className="text-sm text-white/70">AI-powered identification</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-white/70">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Upload Medicine Photo</h2>
              <p className="text-white/70">
                Take a clear photo of your medicine for instant AI-powered identification and detailed information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  dragActive
                    ? "border-orange-500 bg-orange-500/10"
                    : file
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/30 bg-white/5 hover:bg-white/10"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!preview ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {dragActive ? "Drop your image here" : "Upload medicine photo"}
                    </h3>
                    <p className="text-white/60 mb-4">
                      Drag and drop your image here, or click to browse
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        type="button"
                        onClick={openFileDialog}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Choose File</span>
                      </button>
                      <button
                        type="button"
                        onClick={openFileDialog}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                    <p className="text-xs text-white/40 mt-4">
                      Supported formats: JPG, PNG, WEBP • Max size: 10MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Medicine preview"
                        className="max-w-full max-h-64 rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Image uploaded successfully</span>
                    </div>
                    <p className="text-white/60 text-sm">
                      {file?.name} • {(file?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Medicine...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Identify Medicine</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {(medicineName || aiDetails) && (
            <div className="space-y-6">
              {/* Medicine Name */}
              {medicineName && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Medicine Identified</h3>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                    <p className="text-2xl font-bold text-white">{medicineName}</p>
                  </div>
                </div>
              )}

              {/* AI Details */}
              {aiDetails && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Detailed Information</h3>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="prose prose-invert max-w-none text-white">
                      <ReactMarkdown>
                        {aiDetails}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Medical Disclaimer */}
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-300 mb-1">Medical Disclaimer</h4>
                        <p className="text-amber-200/80 text-sm">
                          This information is for educational purposes only and should not replace professional medical advice. 
                          Always consult with a healthcare provider before making any medical decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Info */}
          {!loading && !medicineName && !aiDetails && !error && (
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-white mb-2">99% Accuracy</h3>
                <p className="text-white/70 text-sm">Advanced AI recognition with medical database verification</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Instant Results</h3>
                <p className="text-white/70 text-sm">Get comprehensive medicine information in seconds</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Secure & Private</h3>
                <p className="text-white/70 text-sm">Your images are processed securely and not stored</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadMedicine
