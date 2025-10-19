import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

interface DevUser {
  id: string;
  email: string;
  createdAt: string;
  profile: {
    firstName: string;
    age: number;
    gender: string;
    bio: string | null;
    location: string | null;
    interestedIn: string[];
    photos: { id: string; url: string; order: number }[];
    promptAnswers: { 
      id: string; 
      answer: string; 
      order: number;
      prompt: { text: string; category: string };
    }[];
  } | null;
}

interface DevStats {
  totalUsers: number;
  usersWithProfiles: number;
  totalPhotos: number;
  totalPromptAnswers: number;
  totalLikes: number;
  totalMatches: number;
  totalMessages: number;
}

const DevDashboard = () => {
  const [users, setUsers] = useState<DevUser[]>([]);
  const [stats, setStats] = useState<DevStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<DevUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        api.default.get('/dev/users'),
        api.default.get('/dev/stats'),
      ]);
      setUsers(usersData.data);
      setStats(statsData.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading developer dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔧 Developer Dashboard
        </h1>
        <p className="text-gray-600">
          View all database data and user information
        </p>
      </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard title="Complete Profiles" value={stats.usersWithProfiles} color="green" />
            <StatCard title="Total Photos" value={stats.totalPhotos} color="purple" />
            <StatCard title="Prompt Answers" value={stats.totalPromptAnswers} color="yellow" />
            <StatCard title="Total Likes" value={stats.totalLikes} color="pink" />
            <StatCard title="Total Matches" value={stats.totalMatches} color="red" />
            <StatCard title="Total Messages" value={stats.totalMessages} color="indigo" />
            <StatCard title="Users w/o Profiles" value={stats.totalUsers - stats.usersWithProfiles} color="gray" />
          </div>
        )}

        {/* Users List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedUser?.id === user.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.profile?.firstName || 'No Name'}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {user.profile ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Complete
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Incomplete
                    </span>
                  )}
                </div>
                {user.profile && (
                  <div className="flex gap-2 text-xs text-gray-600">
                    <span>📸 {user.profile.photos.length} photos</span>
                    <span>💬 {user.profile.promptAnswers.length} prompts</span>
                    <span>🎂 {user.profile.age}y</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* User Details */}
          <div className="sticky top-4">
            {selectedUser ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">User Details</h2>
                
                {/* Basic Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Info</h3>
                  <div className="bg-gray-50 rounded p-3 space-y-1 text-sm">
                    <p><span className="font-medium">ID:</span> {selectedUser.id}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Created:</span> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedUser.profile ? (
                  <>
                    {/* Profile Info */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
                      <div className="bg-gray-50 rounded p-3 space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedUser.profile.firstName}</p>
                        <p><span className="font-medium">Age:</span> {selectedUser.profile.age}</p>
                        <p><span className="font-medium">Gender:</span> {selectedUser.profile.gender}</p>
                        <p><span className="font-medium">Interested In:</span> {selectedUser.profile.interestedIn.join(', ')}</p>
                        {selectedUser.profile.bio && (
                          <p><span className="font-medium">Bio:</span> {selectedUser.profile.bio}</p>
                        )}
                        {selectedUser.profile.location && (
                          <p><span className="font-medium">Location:</span> {selectedUser.profile.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Photos */}
                    {selectedUser.profile.photos.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Photos ({selectedUser.profile.photos.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedUser.profile.photos.map((photo) => (
                            <div key={photo.id} className="relative aspect-square">
                              <img
                                src={`http://localhost:3001${photo.url}`}
                                alt={`Photo ${photo.order + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                              <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                #{photo.order + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Insight */}
                    {(selectedUser.profile as any).aiInsight && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          🤖 AI-Generated Insight
                        </h3>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {(selectedUser.profile as any).aiInsight}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Prompt Answers */}
                    {selectedUser.profile.promptAnswers.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Prompt Answers ({selectedUser.profile.promptAnswers.length})
                        </h3>
                        <div className="space-y-3">
                          {selectedUser.profile.promptAnswers.map((answer) => (
                            <div key={answer.id} className="bg-gray-50 rounded p-3">
                              <p className="font-medium text-sm text-gray-900 mb-1">
                                {answer.prompt.text}
                              </p>
                              <p className="text-sm text-gray-700">{answer.answer}</p>
                              <span className="text-xs text-gray-500">
                                {answer.prompt.category} • Order: {answer.order}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Raw Data</h3>
                      <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedUser, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-2">⚠️ No Profile Created</p>
                    <p className="text-sm">This user hasn't completed profile setup yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                <p className="text-lg">👈 Select a user to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={loadData}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => navigate('/admin-onboarding')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            📝 Preview Onboarding
          </button>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    pink: 'bg-pink-50 text-pink-700',
    red: 'bg-red-50 text-red-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    gray: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default DevDashboard;

