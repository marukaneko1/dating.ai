import { useState, useEffect } from 'react';
import { Profile } from '../types';
import * as api from '../services/api';

const Discover = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentType, setCommentType] = useState<{
    type: 'PHOTO' | 'PROMPT';
    id: string;
  } | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadNextProfile();
  }, []);

  const loadNextProfile = async () => {
    setLoading(true);
    setCurrentPhotoIndex(0);
    try {
      const nextProfile = await api.getNextProfile();
      setProfile(nextProfile);
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (
    type: 'PROFILE' | 'PHOTO' | 'PROMPT',
    itemId?: string
  ) => {
    if (!profile) return;

    try {
      const likeData: any = {
        toUserId: profile.userId,
        type,
      };

      if (type === 'PHOTO' && itemId) {
        likeData.photoId = itemId;
      } else if (type === 'PROMPT' && itemId) {
        likeData.promptAnswerId = itemId;
      }

      if (comment.trim()) {
        likeData.comment = comment.trim();
      }

      const result = await api.createLike(likeData);

      if (result.match) {
        alert("It's a match! 🎉");
      }

      setShowCommentModal(false);
      setComment('');
      setCommentType(null);
      loadNextProfile();
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handlePass = () => {
    loadNextProfile();
  };

  const openCommentModal = (type: 'PHOTO' | 'PROMPT', id: string) => {
    setCommentType({ type, id });
    setShowCommentModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">
            No more profiles to show
          </p>
          <p className="text-gray-500">Check back later!</p>
        </div>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Photos */}
        <div className="relative">
          {profile.photos.length > 0 ? (
            <>
              <img
                src={`${API_URL}${profile.photos[currentPhotoIndex].url}`}
                alt={`${profile.firstName}`}
                className="w-full h-96 object-cover"
              />
              {profile.photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex(
                        (currentPhotoIndex - 1 + profile.photos.length) %
                          profile.photos.length
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex(
                        (currentPhotoIndex + 1) % profile.photos.length
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100"
                  >
                    →
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {profile.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentPhotoIndex
                            ? 'bg-white'
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={() =>
                  openCommentModal('PHOTO', profile.photos[currentPhotoIndex].id)
                }
                className="absolute top-4 right-4 bg-white bg-opacity-75 rounded-full px-4 py-2 text-sm font-medium hover:bg-opacity-100"
              >
                ❤️ Like Photo
              </button>
            </>
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No photos</p>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            {profile.firstName}, {profile.age}
          </h2>
          {profile.location && (
            <p className="text-gray-600 mb-4">📍 {profile.location}</p>
          )}
          {profile.bio && (
            <p className="text-gray-700 mb-6">{profile.bio}</p>
          )}

          {/* Prompt Answers */}
          {profile.promptAnswers.length > 0 && (
            <div className="space-y-4 mb-6">
              {profile.promptAnswers.map((pa) => (
                <div
                  key={pa.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <p className="font-medium text-gray-900 mb-2">
                    {pa.prompt.text}
                  </p>
                  <p className="text-gray-700 mb-3">{pa.answer}</p>
                  <button
                    onClick={() => openCommentModal('PROMPT', pa.id)}
                    className="text-primary text-sm font-medium hover:text-red-600"
                  >
                    ❤️ Like & Comment
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handlePass}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ✕ Pass
            </button>
            <button
              onClick={() => handleLike('PROFILE')}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              ❤️ Like
            </button>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && commentType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add a comment</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something nice..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary mb-4"
              rows={4}
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setCommentType(null);
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleLike(commentType.type, commentType.id)
                }
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
              >
                Send Like
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;

