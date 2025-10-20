import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { Prompt } from '../types';

interface BasicInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  birthCity: string;
  birthTime: string;
}

const Onboarding = () => {
  const [step, setStep] = useState(0); // 0 = basic info, 1-7 = questions
  const [questions, setQuestions] = useState<Prompt[]>([]);
  const [answers, setAnswers] = useState<{ promptId: string; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    birthCity: '',
    birthTime: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { refreshUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadMeaningfulQuestions();
  }, []);

  const loadMeaningfulQuestions = async () => {
    try {
      const allPrompts = await api.getPrompts();
      // Filter for meaningful category questions only
      const meaningfulQuestions = allPrompts.filter(p => p.category === 'meaningful');
      setQuestions(meaningfulQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions', error);
      setLoading(false);
    }
  };

  const handleBasicInfoNext = () => {
    // Validate basic info
    if (!basicInfo.firstName.trim() || !basicInfo.lastName.trim() || !basicInfo.birthDate || !basicInfo.gender || !basicInfo.birthCity.trim()) {
      alert('Please fill in all required fields (First Name, Last Name, Birthday, Gender, Birth City)');
      return;
    }
    setStep(1); // Move to first question
  };

  const handleNext = () => {
    if (step === 0) {
      handleBasicInfoNext();
      return;
    }

    if (currentAnswer.trim()) {
      const questionIndex = step - 1;
      
      // Save current answer
      setAnswers([
        ...answers,
        { promptId: questions[questionIndex].id, answer: currentAnswer }
      ]);
      setCurrentAnswer('');

      // Move to next question or submit
      if (step < questions.length) {
        setStep(step + 1);
      } else {
        // All questions answered, submit
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      // Go back to basic info
      setStep(0);
    } else if (step > 1) {
      // Go back to previous question
      const previousAnswer = answers[answers.length - 1];
      setCurrentAnswer(previousAnswer.answer);
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Calculate age from birth date
      const birthDateObj = new Date(basicInfo.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }

      // Create profile with basic info
      const fullName = `${basicInfo.firstName} ${basicInfo.lastName}`;
      const bioText = `${fullName}. Born in ${basicInfo.birthCity}${basicInfo.birthTime ? ` at ${basicInfo.birthTime}` : ''}. New on Dating.ai`;
      
      await api.updateProfile({
        firstName: fullName,
        age: age,
        gender: basicInfo.gender,
        bio: bioText,
        location: basicInfo.birthCity,
        interestedIn: basicInfo.gender === 'male' ? ['female'] : basicInfo.gender === 'female' ? ['male'] : ['male', 'female', 'non-binary'],
      });

      // Submit all prompt answers (last answer already saved in answers array)
      const allAnswers = answers;

      // Delete existing prompt answers first (in case re-doing)
      try {
        const profile = await api.getProfile();
        if (profile.promptAnswers && profile.promptAnswers.length > 0) {
          for (const pa of profile.promptAnswers) {
            try {
              await api.deletePromptAnswer(pa.id);
            } catch (deleteErr) {
              console.error('Error deleting prompt answer:', deleteErr);
            }
          }
        }
      } catch (err) {
        // No existing profile, that's fine
        console.log('No existing profile to clean up');
      }

      // Add new prompt answers
      for (let i = 0; i < allAnswers.length; i++) {
        await api.addPromptAnswer(allAnswers[i].promptId, allAnswers[i].answer, i);
      }

      // Refresh user data
      await refreshUser();

      // Generate AI insight in the background
      try {
        console.log('Generating AI insight...');
        await api.default.post('/profile/generate-insight');
        console.log('✅ AI insight generated');
      } catch (aiError) {
        console.error('AI insight failed (non-blocking):', aiError);
      }

      // Export to CSV (non-blocking)
      try {
        console.log('Exporting user data to CSV...');
        const exportResponse = await api.default.post('/profile/export-csv');
        console.log('✅ Data exported to CSV:', exportResponse.data);
      } catch (csvError) {
        console.error('CSV export failed (non-blocking):', csvError);
      }

      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Failed to submit answers', error);
      alert('Failed to save your answers. Please try again.');
      setSubmitting(false);
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

  const totalSteps = questions.length + 1; // Basic info + 7 questions
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
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={basicInfo.firstName}
                  onChange={(e) => setBasicInfo({ ...basicInfo, firstName: e.target.value })}
                  placeholder="Your first name"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={basicInfo.lastName}
                  onChange={(e) => setBasicInfo({ ...basicInfo, lastName: e.target.value })}
                  placeholder="Your last name"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday *
                </label>
                <input
                  type="date"
                  value={basicInfo.birthDate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthDate: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
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

              {/* Birth City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City You Were Born *
                </label>
                <input
                  type="text"
                  value={basicInfo.birthCity}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthCity: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Birth Time (Optional) */}
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
                  If you know it, this helps with astrological insights
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
              placeholder="Share your thoughts..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
              rows={6}
              autoFocus
            />

            <p className="text-sm text-gray-500 mt-2">
              {currentAnswer.length} characters
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              disabled={submitting}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (step === 0 && (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.birthDate || !basicInfo.gender || !basicInfo.birthCity)) ||
              (step > 0 && !currentAnswer.trim()) ||
              submitting
            }
            className="flex-1 py-4 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting
              ? 'Saving...'
              : step === 0
              ? 'Start Questions →'
              : step === questions.length
              ? '✨ Complete Profile'
              : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

