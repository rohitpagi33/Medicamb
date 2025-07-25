import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get('http://localhost:5000/api/chats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    };
    fetchChats();
  }, [token]);

  const fetchMessages = async (chatId) => {
    setSelectedChat(chatId);
    const res = await axios.get(`http://localhost:5000/api/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const res = await axios.post(
      'http://localhost:5000/api/messages',
      { content: message, chatId: selectedChat },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages((prev) => [...prev, res.data]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat._id}
              className={`p-2 rounded cursor-pointer mb-2 ${selectedChat === chat._id ? 'bg-blue-100' : ''}`}
              onClick={() => fetchMessages(chat._id)}
            >
              {chat.isGroup ? chat.chatName : chat.users.find(u => u._id !== user.id)?.name || 'Chat'}
            </li>
          ))}
        </ul>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedChat ? (
            <>
              <div className="mb-4">
                {messages.map((msg) => (
                  <div key={msg._id} className={`mb-2 flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg ${msg.sender._id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                      <span className="font-semibold">{msg.sender.name}: </span>{msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 