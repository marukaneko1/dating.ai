import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Profile as ProfileType, Prompt } from '../types';
import * as api from '../services/api';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    age: 0,
    bio: '',
    location: '',
    minAge: 18,
    maxAge: 99,
    maxDistance: 50,
  });

  useEffect(() => {
    loadProfile();
    loadPrompts();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        age: data.age,
        bio: data.bio || '',
        location: data.location || '',
        minAge: data.minAge,
        maxAge: data.maxAge,
        maxDistance: data.maxDistance,
      });
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrompts = async () => {
    try {
      const data = await api.getPrompts();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.updateProfile(formData);
      await refreshUser();
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !profile) return;

    const file = e.target.files[0];
    const order = profile.photos.length;

    try {
      await api.uploadPhoto(file, order);
      loadProfile();
    } catch (error) {
      console.error('Failed to upload photo', error);
      alert('Failed to upload photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await api.deletePhoto(photoId);
      loadProfile();
    } catch (error) {
      console.error('Failed to delete photo', error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Basic Info</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    firstName: profile.firstName,
                    age: profile.age,
                    bio: profile.bio || '',
                    location: profile.location || '',
                    minAge: profile.minAge,
                    maxAge: profile.maxAge,
                    maxDistance: profile.maxDistance,
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Age
                </label>
                <input
                  type="number"
                  value={formData.minAge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minAge: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Age
                </label>
                <input
                  type="number"
                  value={formData.maxAge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxAge: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Distance (mi)
                </label>
                <input
                  type="number"
                  value={formData.maxDistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDistance: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p>
              <span className="font-medium">Name:</span> {profile.firstName},{' '}
              {profile.age}
            </p>
            {profile.bio && (
              <p>
                <span className="font-medium">Bio:</span> {profile.bio}
              </p>
            )}
            {profile.location && (
              <p>
                <span className="font-medium">Location:</span>{' '}
                {profile.location}
              </p>
            )}
            <p>
              <span className="font-medium">Age Preference:</span>{' '}
              {profile.minAge}-{profile.maxAge}
            </p>
            <p>
              <span className="font-medium">Distance:</span> Within{' '}
              {profile.maxDistance} miles
            </p>
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Photos</h2>
        <div className="grid grid-cols-3 gap-4">
          {profile.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square">
              <img
                src={`${API_URL}${photo.url}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {profile.photos.length < 6 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <span className="text-4xl text-gray-400">+</span>
            </label>
          )}
        </div>
      </div>

      {/* Prompt Answers */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Prompt Answers</h2>
        <div className="space-y-4">
          {profile.promptAnswers.map((pa) => (
            <div key={pa.id} className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">{pa.prompt.text}</p>
              <p className="text-gray-700">{pa.answer}</p>
            </div>
          ))}
          {profile.promptAnswers.length < 3 && (
            <p className="text-gray-500 text-sm">
              Go to profile setup to add more prompts
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

