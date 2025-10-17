import { useState, useEffect } from 'react';
import { Like } from '../types';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Likes = () => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const [sent, received] = await Promise.all([
        api.getSentLikes(),
        api.getReceivedLikes(),
      ]);
      setSentLikes(sent);
      setReceivedLikes(received);
    } catch (error) {
      console.error('Failed to load likes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (like: Like) => {
    try {
      const result = await api.createLike({
        toUserId: like.fromUserId,
        type: 'PROFILE',
      });

      if (result.match) {
        alert("It's a match! 🎉");
        navigate('/matches');
      } else {
        loadLikes();
      }
    } catch (error) {
      console.error('Failed to like back', error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const likes = activeTab === 'sent' ? sentLikes : receivedLikes;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Likes</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'received'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Received ({receivedLikes.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'sent'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sent ({sentLikes.length})
        </button>
      </div>

      {/* Likes List */}
      {likes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {activeTab === 'sent'
              ? 'You haven\'t liked anyone yet'
              : 'No one has liked you yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likes.map((like) => {
            const user =
              activeTab === 'sent' ? like.toUser : like.fromUser;
            if (!user || !user.profile) return null;

            return (
              <div
                key={like.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {user.profile.photos.length > 0 ? (
                  <img
                    src={`${API_URL}${user.profile.photos[0].url}`}
                    alt={user.profile.firstName}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No photo</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">
                    {user.profile.firstName}, {user.profile.age}
                  </h3>
                  {user.profile.location && (
                    <p className="text-gray-600 text-sm mb-2">
                      📍 {user.profile.location}
                    </p>
                  )}
                  {like.comment && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        💬 "{like.comment}"
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mb-3">
                    {like.type === 'PHOTO'
                      ? '❤️ Liked your photo'
                      : like.type === 'PROMPT'
                      ? '❤️ Liked your prompt'
                      : '❤️ Liked your profile'}
                  </p>
                  {activeTab === 'received' && (
                    <button
                      onClick={() => handleLikeBack(like)}
                      className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-red-600"
                    >
                      ❤️ Like Back
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Likes;

