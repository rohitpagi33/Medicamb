import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ReactMarkdown from 'react-markdown';

const AIChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hi! I am your AI medical assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        { question: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: res.data.answer }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: err.response?.data?.message || 'Something went wrong.' }
      ]);
      setError('');
    }
    setLoading(false);
  };

  const getAvatar = (role) => {
    return role === 'user'
      ? <img src="https://api.dicebear.com/7.x/identicon/svg?seed=user" alt="User" className="w-8 h-8 rounded-full" />
      : <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" alt="AI" className="w-8 h-8 rounded-full" />;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-0">
      <div className="w-full flex flex-col h-[90vh] bg-white rounded-none shadow-lg overflow-hidden relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-full shadow transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <div className="flex items-center justify-center py-4 border-b bg-blue-100">
          <h2 className="text-xl font-bold text-blue-700">AI Medical Chatbot</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6" style={{ background: '#f7fafc' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && getAvatar('ai')}
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.role === 'user' ? 'bg-blue-500 text-white ml-2' : 'bg-gray-200 text-gray-900 mr-2'}`}>
                {msg.role === 'ai'
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content}
              </div>
              {msg.role === 'user' && getAvatar('user')}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t bg-white">
          <Input
            type="text"
            placeholder="Type your medical question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" disabled={loading || !input.trim()} className="px-6">
            {loading ? '...' : 'Send'}
          </Button>
        </form>
        {error && <div className="text-red-500 text-center py-2">{error}</div>}
      </div>
    </div>
  );
};

export default AIChatPage;