import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-red-100 mt-1">
            {matches.length} {matches.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>

        {/* Conversations List */}
        {matches.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No conversations yet
            </h2>
            <p className="text-gray-500 mb-6">
              Match with someone to start chatting!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Start Discovering
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {matches.map((match) => {
              const otherUser = match.user;
              const lastMessage = match.lastMessage;
              const isUnread = lastMessage && !lastMessage.read && lastMessage.senderId !== user?.id;

              return (
                <div
                  key={match.id}
                  onClick={() => handleChatClick(match.id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center space-x-4"
                >
                  {/* Profile Photo */}
                  <div className="relative flex-shrink-0">
                    {otherUser.profile.photos.length > 0 ? (
                      <img
                        src={`${API_URL}${otherUser.profile.photos[0].url}`}
                        alt={otherUser.profile.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-400">
                          {otherUser.profile.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className={`text-lg font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {otherUser.profile.firstName}
                      </h3>
                      {lastMessage && (
                        <span className={`text-xs ${isUnread ? 'text-primary font-medium' : 'text-gray-500'}`}>
                          {formatMessageTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {lastMessage ? (
                      <p className={`text-sm truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {lastMessage.senderId === user?.id && 'You: '}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Start the conversation!
                      </p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {matches.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/matches')}
            className="text-primary hover:text-red-600 font-medium"
          >
            View All Matches →
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;

