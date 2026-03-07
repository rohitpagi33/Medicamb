
"use client"

import React from "react";
import { motion } from "framer-motion";
import {
  Camera, Bot, Building2, Microscope, CheckCircle, ArrowRight,
  Heart, User, FileText, Activity, ChevronRight, Upload,
  TrendingUp, Lock, Clock, LogIn, UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: Camera,
    title: "Medicine Scanner",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    badge: "AI Powered",
    badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    description:
      "Instantly identify any medicine by simply taking a photo. Our AI scans the label and packaging to provide the drug name, dosage, usage instructions, side effects, and interactions.",
    highlights: ["Photo-based identification", "Drug interactions check", "Dosage guidance", "Side effect alerts"],
    route: "/upload",
    cta: "Try Medicine Scanner",
  },
  {
    icon: Bot,
    title: "AI Doctor Chat",
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    badge: "24/7 Available",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    description:
      "Chat with our intelligent AI medical assistant anytime, anywhere. Describe your symptoms, get preliminary insights, understand medical terms, and receive guidance on when to see a doctor.",
    highlights: ["Symptom analysis", "Medical Q&A", "Chat history saved", "Instant responses"],
    route: "/ai-chat",
    cta: "Chat with AI Doctor",
  },
  {
    icon: Building2,
    title: "Find & Book Hospitals",
    color: "from-emerald-500 to-cyan-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badge: "Near You",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    description:
      "Locate hospitals near your current location using GPS. Browse specialities, timings, and available appointment slots. Book appointments directly with hospitals registered on our platform.",
    highlights: ["GPS-based search", "Filter by speciality", "Live slot booking", "PDF confirmation"],
    route: "/hospitals",
    cta: "Find Hospitals",
  },
  {
    icon: Microscope,
    title: "Medical Report Analysis",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    badge: "Gemini AI",
    badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    description:
      "Upload your medical reports — blood tests, urine analysis, MRI, lipid profiles, thyroid tests and more. Our AI compares your values against medical normal ranges and provides a clear summary with suggestions.",
    highlights: ["20+ report types", "Normal range comparison", "Medical summary", "Health suggestions"],
    route: "/report-analysis",
    cta: "Analyze Report",
  },
];

const STATS = [
  { value: "99%", label: "Accuracy Rate", icon: TrendingUp },
  { value: "20+", label: "Report Types", icon: FileText },
  { value: "24/7", label: "AI Availability", icon: Clock },
  { value: "100%", label: "Secure & Private", icon: Lock },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: 4 + (i % 3) * 4,
                height: 4 + (i % 3) * 4,
                background: i % 2 === 0 ? "#f97316" : "#38bdf8",
                left: `${8 + i * 9}%`,
                top: `${15 + i * 7}%`,
              }}
              animate={{ x: [0, 80, -40, 120, 0], y: [0, -80, 40, -120, 0], scale: [1, 1.4, 0.6, 1.2, 1] }}
              transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}
        </div>

        {/* Top-right nav icons */}
        <div className="absolute top-5 right-5 z-20 flex items-center space-x-2">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/profile")}
              title="My Profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
            <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium">
              🏥 AI-Powered Healthcare Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-orange-400 to-sky-400 bg-clip-text text-transparent">
              MediCamb
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Your complete AI healthcare companion — identify medicines, analyze medical reports, chat with an AI doctor, and book hospital appointments all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center"
          >
            <button
              className="group bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-full text-black font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate(isAuthenticated ? "/upload" : "/login")}
            >
              <Camera className="w-5 h-5" />
              <span>Scan Medicine</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="px-8 py-4 rounded-full border-2 border-violet-500/60 text-violet-300 font-bold text-lg hover:bg-violet-500/10 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate(isAuthenticated ? "/report-analysis" : "/login")}
            >
              <Microscope className="w-5 h-5" />
              <span>Analyze Report</span>
            </button>
            <button
              className="px-8 py-4 rounded-full border-2 border-emerald-400/60 text-emerald-300 font-bold text-lg hover:bg-emerald-400/10 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate(isAuthenticated ? "/hospitals" : "/login")}
            >
              <Building2 className="w-5 h-5" />
              <span>Find Hospitals</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center space-y-1">
                <stat.icon className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section — 4 cards in 2x2 grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-400 text-sm font-medium mb-4">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Platform{" "}
              <span className="bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Four powerful AI-driven tools to take control of your healthcare journey.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`relative rounded-3xl border ${feature.border} ${feature.bg} p-7 flex flex-col hover:scale-[1.02] transition-transform duration-300 group cursor-pointer`}
                onClick={() => navigate(isAuthenticated ? feature.route : "/login")}
              >
                {/* Badge */}
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${feature.badgeColor}`}>
                  {feature.badge}
                </span>

                {/* Icon & Title */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{feature.description}</p>

                {/* Highlights */}
                <ul className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-6 flex-1">
                  {feature.highlights.map((h) => (
                    <li key={h} className="flex items-center space-x-2 text-xs text-gray-400">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white text-sm font-semibold flex items-center justify-center space-x-2 group-hover:shadow-lg transition-shadow`}
                >
                  <span>{feature.cta}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg mb-14">Get started in three easy steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: User, title: "Create Account", desc: "Sign up for free and set up your personal health profile." },
              { step: "02", icon: Upload, title: "Use Any Feature", desc: "Scan medicines, analyze reports, find hospitals or chat with AI." },
              { step: "03", icon: Heart, title: "Stay Healthy", desc: "Get insights, book appointments, and track your health journey." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="text-6xl font-black text-orange-500/20 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-900/30 via-black to-sky-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to take control of your health?</h2>
            <p className="text-gray-400 mb-8">Join thousands using MediCamb for smarter healthcare decisions.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-10 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/5 transition-all"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/profile")}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:shadow-2xl transition-all"
                >
                  Go to My Profile
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

