
"use client"

import React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Bot,
  Shield,
  Clock,
  Globe,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  Search,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-30"
              animate={{
                x: [0, 100, -50, 150, 0],
                y: [0, -100, 50, -150, 0],
                scale: [1, 1.5, 0.5, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 8}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-500 text-sm font-medium mb-6">
              🚀 AI-Powered Healthcare Assistant
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-orange-500 to-white bg-clip-text text-transparent">
              MediCamb
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Instantly identify medicines, get detailed information, and receive AI-powered health guidance with just a
            photo. Your pocket healthcare companion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              className="group bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-full text-black font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate('/upload')}
            >
              <Camera className="w-5 h-5" />
              <span>Try Medicine Scanner</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              className="px-8 py-4 rounded-full border-2 border-orange-500/50 text-orange-500 font-bold text-lg hover:bg-orange-500/10 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate('/ai-chat')}
            >
              <Bot className="w-5 h-5" />
              <span>Chat with AI Doctor</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>99% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>AI-Powered</span>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ...existing advanced homepage code... */}
    </div>
  );
}

