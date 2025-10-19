import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { Prompt } from '../types';

interface BasicInfo {
  firstName: string;
  birthDate: string;
  gender: string;
  birthCity: string;
  birthTime: string;
}

const AdminOnboarding = () => {
  const [step, setStep] = useState(0); // 0 = basic info, 1-7 = questions
  const [questions, setQuestions] = useState<Prompt[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    birthDate: '',
    gender: '',
    birthCity: '',
    birthTime: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    // Redirect if not admin
    if (user && !user.isAdmin) {
      navigate('/onboarding');
      return;
    }
    loadMeaningfulQuestions();
  }, [user, navigate]);

  const loadMeaningfulQuestions = async () => {
    try {
      const allPrompts = await api.getPrompts();
      const meaningfulQuestions = allPrompts.filter(p => p.category === 'meaningful');
      setQuestions(meaningfulQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSkip = () => {
    // Skip directly to homepage without saving
    navigate('/');
  };

  const handleNext = () => {
    setCurrentAnswer('');
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Complete without saving
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setCurrentAnswer('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">No questions found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = questions.length + 1;
  const progress = (step / totalSteps) * 100;
  const currentQ = step > 0 ? questions[step - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 text-sm font-medium underline"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-xs font-bold mb-4">
            🔧 ADMIN PREVIEW MODE - NOT SAVED
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 0 ? 'Welcome to Dating.ai' : 'Tell Us About Yourself'}
          </h1>
          <p className="text-gray-600">
            {step === 0 ? 'Let\'s start with the basics' : `Question ${step} of ${questions.length}`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {step === 0
              ? `${questions.length} meaningful questions ahead`
              : totalSteps - step === 1
              ? 'Last question!'
              : `${totalSteps - step} more ${totalSteps - step === 1 ? 'step' : 'steps'}`}
          </p>
        </div>

        {/* Basic Info Form (Step 0) */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={basicInfo.firstName}
                  onChange={(e) => setBasicInfo({ ...basicInfo, firstName: e.target.value })}
                  placeholder="Your first name (preview only)"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={basicInfo.birthDate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthDate: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['male', 'female', 'non-binary', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setBasicInfo({ ...basicInfo, gender })}
                      className={`p-4 border-2 rounded-xl font-medium capitalize transition-all ${
                        basicInfo.gender === gender
                          ? 'border-primary bg-red-50 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City You Were Born
                </label>
                <input
                  type="text"
                  value={basicInfo.birthCity}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthCity: e.target.value })}
                  placeholder="e.g., San Francisco, CA (preview only)"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time You Were Born (Optional)
                </label>
                <input
                  type="time"
                  value={basicInfo.birthTime}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthTime: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Preview only - not saved
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question Card (Steps 1-7) */}
        {step > 0 && currentQ && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 transform transition-all duration-300">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-4">
                {currentQ.category}
              </span>
              <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                {currentQ.text}
              </h2>
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts... (preview only, not saved)"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
              rows={6}
              autoFocus
            />

            <p className="text-sm text-gray-500 mt-2">
              {currentAnswer.length} characters (preview only)
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleSkip}
            className={`py-4 border-2 border-yellow-400 bg-yellow-50 text-yellow-700 rounded-xl font-semibold hover:bg-yellow-100 transition-colors ${
              step === 0 ? 'col-span-3' : 'col-span-1'
            }`}
          >
            ⏭️ Skip to Dashboard
          </button>
          {step === 0 ? null : (
            <button
              onClick={handleNext}
              className="py-4 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              {step === questions.length ? '✨ Go to Dashboard' : 'Next →'}
            </button>
          )}
          {step === 0 && (
            <button
              onClick={() => setStep(1)}
              className="col-span-3 py-4 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Start Questions →
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 text-center">
            <strong>🔧 Admin Preview Mode:</strong> This is for demonstration only. No data will be saved or sent to ChatGPT. Your actual admin profile remains unchanged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;

