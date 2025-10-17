import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types';
import * as api from '../services/api';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Matches ({matches.length})
      </h1>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            No matches yet
          </p>
          <p className="text-gray-400">
            Keep swiping to find your perfect match!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleChatClick(match.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              {match.user.profile.photos.length > 0 ? (
                <img
                  src={`${API_URL}${match.user.profile.photos[0].url}`}
                  alt={match.user.profile.firstName}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No photo</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="font-semibold text-lg mb-1">
                  {match.user.profile.firstName}
                </h3>
                {match.lastMessage ? (
                  <p className="text-sm text-gray-600 truncate">
                    {match.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Start chatting!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;

