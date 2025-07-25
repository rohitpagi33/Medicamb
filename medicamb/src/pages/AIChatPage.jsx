import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const AIChatPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleAsk} className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">AI Medical Chatbot</h2>
        <Input
          type="text"
          placeholder="Describe your medical problem..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
          className="mb-4"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Asking AI...' : 'Ask AI'}
        </Button>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {answer && (
          <div className="mt-6 p-4 bg-blue-50 rounded shadow">
            <strong>AI Response:</strong>
            <p className="mt-2 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AIChatPage; 