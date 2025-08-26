// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import ReactMarkdown from 'react-markdown';

// const AIChatPage = () => {
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([
//     {
//       role: 'ai',
//       content: 'Hi! I am your AI medical assistant. How can I help you today?'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     setLoading(true);
//     setError('');
//     const userMsg = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/ai/ask`,
//         { question: input },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages(prev => [
//         ...prev,
//         { role: 'ai', content: res.data.answer }
//       ]);
//     } catch (err) {
//       setMessages(prev => [
//         ...prev,
//         { role: 'ai', content: err.response?.data?.message || 'Something went wrong.' }
//       ]);
//       setError('');
//     }
//     setLoading(false);
//   };

//   const getAvatar = (role) => {
//     return role === 'user'
//       ? <img src="https://api.dicebear.com/7.x/identicon/svg?seed=user" alt="User" className="w-8 h-8 rounded-full" />
//       : <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" alt="AI" className="w-8 h-8 rounded-full" />;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0">
//       <div className="w-full flex flex-col h-[90vh] bg-white rounded-none shadow-lg overflow-hidden relative">
//         <button
//           onClick={() => navigate('/')}
//           className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-full shadow transition"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//           </svg>
//           Back
//         </button>
//         <div className="flex items-center justify-center py-4 border-b bg-blue-100">
//           <h2 className="text-xl font-bold text-blue-700">AI Medical Chatbot</h2>
//         </div>
//         <div className="flex-1 overflow-y-auto px-4 py-6" style={{ background: '#f7fafc' }}>
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               {msg.role === 'ai' && getAvatar('ai')}
//               <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.role === 'user' ? 'bg-blue-500 text-white ml-2' : 'bg-gray-200 text-gray-900 mr-2'}`}>
//                 {msg.role === 'ai'
//                   ? <ReactMarkdown>{msg.content}</ReactMarkdown>
//                   : msg.content}
//               </div>
//               {msg.role === 'user' && getAvatar('user')}
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>
//         <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t bg-white">
//           <Input
//             type="text"
//             placeholder="Type your medical question..."
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             disabled={loading}
//             className="flex-1"
//             autoFocus
//           />
//           <Button type="submit" disabled={loading || !input.trim()} className="px-6">
//             {loading ? '...' : 'Send'}
//           </Button>
//         </form>
//         {error && <div className="text-red-500 text-center py-2">{error}</div>}
//       </div>
//     </div>
//   );
// };

// export default AIChatPage;


"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import ReactMarkdown from "react-markdown"
import { ArrowLeft, Send, Bot, User, Loader2, Sparkles, Heart, Shield, MessageCircle } from "lucide-react"

const AIChatPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! I'm your AI medical assistant. I'm here to help answer your health questions and provide medical guidance. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError("")

    const userMsg = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        { question: input },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: res.data.answer,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: err.response?.data?.message || "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
      setError("Connection error. Please check your internet and try again.")
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const quickQuestions = [
    "What are the symptoms of flu?",
    "How to manage headaches?",
    "First aid for cuts and wounds",
    "When should I see a doctor?",
  ]

  const handleQuickQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">MediCamb AI</h1>
                  <p className="text-sm text-white/70">Medical Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-white/70">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.length === 1 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to MediCamb AI</h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  I'm here to help with your medical questions. Try asking about symptoms, treatments, or general health advice.
                </p>
                
                {/* Quick Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question)}
                      className="p-3 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-orange-500 to-pink-500'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 backdrop-blur-lg text-white border border-white/20'
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      {msg.role === 'ai' ? (
                        <div className="text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-orange-300 prose-code:bg-black/20 prose-code:px-1 prose-code:rounded">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="m-0">{msg.content}</p>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-white/70' : 'text-white/50'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                      <span className="text-white/70">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-500/20 border-t border-red-500/30">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/5 backdrop-blur-lg border-t border-white/20">
            <form onSubmit={handleSend} className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything about your health..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:bg-white/20 focus:border-orange-500/50 transition-all duration-200 backdrop-blur-sm resize-none"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-white/40" />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </Button>
            </form>
            
            {/* Footer Info */}
            <div className="flex items-center justify-center mt-3 text-xs text-white/40">
              <Heart className="w-3 h-3 mr-1" />
              <span>AI responses are for informational purposes only. Consult a doctor for medical advice.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChatPage
