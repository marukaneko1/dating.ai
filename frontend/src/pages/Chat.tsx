import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message } from '../types';
import * as api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!matchId) return;

    loadMessages();

    const socket = getSocket();
    if (socket) {
      socket.emit('joinMatch', matchId);

      socket.on('newMessage', (message: Message) => {
        if (message.matchId === matchId) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.emit('leaveMatch', matchId);
        socket.off('newMessage');
      };
    }
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!matchId) return;

    setLoading(true);
    try {
      const data = await api.getMessages(matchId);
      setMessages(data);
      await api.markMessagesAsRead(matchId);
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId || !newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const message = await api.sendMessage(matchId, content);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message', error);
      setNewMessage(content);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const otherUser =
    messages.length > 0
      ? messages.find((m) => m.senderId !== user?.id)?.sender
      : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center">
          <button
            onClick={() => navigate('/matches')}
            className="mr-4 hover:opacity-80"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold">
            {otherUser?.profile?.firstName || 'Match'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Start the conversation with a friendly message!
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMe = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      isMe
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? 'text-red-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

