import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Prompt } from '../types';

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<
    { prompt: Prompt; answer: string }[]
  >([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const data = await api.getPrompts();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts', error);
    }
  };

  const handleAddPrompt = (prompt: Prompt) => {
    if (selectedPrompts.length < 3) {
      setSelectedPrompts([...selectedPrompts, { prompt, answer: '' }]);
    }
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updated = [...selectedPrompts];
    updated[index].answer = answer;
    setSelectedPrompts(updated);
  };

  const handleRemovePrompt = (index: number) => {
    setSelectedPrompts(selectedPrompts.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 6 - photos.length);
      setPhotos([...photos, ...files]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Update profile
      await api.updateProfile({ bio, location });

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        await api.uploadPhoto(photos[i], i);
      }

      // Add prompt answers
      for (let i = 0; i < selectedPrompts.length; i++) {
        const { prompt, answer } = selectedPrompts[i];
        await api.addPromptAnswer(prompt.id, answer, i);
      }

      navigate('/');
    } catch (error) {
      console.error('Failed to setup profile', error);
      alert('Failed to setup profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availablePrompts = prompts.filter(
    (p) => !selectedPrompts.find((sp) => sp.prompt.id === p.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Complete Your Profile
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Step {step} of 3
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Add Photos</h2>
              <p className="text-gray-600">Add 2-6 photos of yourself</p>

              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 6 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <span className="text-4xl text-gray-400">+</span>
                  </label>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={photos.length < 2}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Answer Prompts</h2>
              <p className="text-gray-600">Choose 3 prompts to answer</p>

              {selectedPrompts.map((sp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{sp.prompt.text}</p>
                    <button
                      onClick={() => handleRemovePrompt(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={sp.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                </div>
              ))}

              {selectedPrompts.length < 3 && (
                <div>
                  <p className="font-medium mb-2">Available Prompts:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availablePrompts.map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => handleAddPrompt(prompt)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={
                    selectedPrompts.length !== 3 ||
                    selectedPrompts.some((sp) => !sp.answer.trim())
                  }
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Add Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

