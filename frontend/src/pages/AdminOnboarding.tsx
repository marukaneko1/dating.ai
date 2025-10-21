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

const AdminOnboarding = () => {
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<Prompt[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    birthCity: '',
    birthTime: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/onboarding');
      return;
    }
    loadQuestions();
  }, [user, navigate]);

  const loadQuestions = async () => {
    try {
      const allPrompts = await api.getPrompts();
      const userSelfQuestions = allPrompts.filter(p => p.category === 'user_self');
      const partnerPrefQuestions = allPrompts.filter(p => p.category === 'partner_preference');
      setQuestions([...userSelfQuestions, ...partnerPrefQuestions]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions', error);
      setLoading(false);
    }
  };

  const handleSkipToDashboard = () => {
    navigate('/dev');
  };

  const handleNext = () => {
    const currentQuestion = questions[step - 1];
    if (currentQuestion?.type === 'multiple_choice') {
      setCurrentAnswer([]);
    } else {
      setCurrentAnswer('');
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      navigate('/dev');
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleMultipleChoiceToggle = (option: string) => {
    const currentSelections = Array.isArray(currentAnswer) ? currentAnswer : [];
    if (currentSelections.includes(option)) {
      setCurrentAnswer(currentSelections.filter(o => o !== option));
    } else {
      setCurrentAnswer([...currentSelections, option]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading preview...</div>
      </div>
    );
  }

  const totalSteps = questions.length + 1;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Admin Preview Badge */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-yellow-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ADMIN PREVIEW MODE - NOT SAVED
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                This is a preview of the user onboarding flow. No data will be saved.
              </p>
            </div>
            <button
              onClick={handleSkipToDashboard}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors whitespace-nowrap ml-4"
            >
              Skip to Dashboard
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Dating.ai</h1>
          <p className="text-gray-600">User Onboarding Preview</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step + 1} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Basic Info Step */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.firstName}
                    onChange={(e) => setBasicInfo({...basicInfo, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.lastName}
                    onChange={(e) => setBasicInfo({...basicInfo, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday *
                </label>
                <input
                  type="date"
                  value={basicInfo.birthDate}
                  onChange={(e) => setBasicInfo({...basicInfo, birthDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={basicInfo.gender}
                  onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth City *
                </label>
                <input
                  type="text"
                  value={basicInfo.birthCity}
                  onChange={(e) => setBasicInfo({...basicInfo, birthCity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Time (Optional)
                </label>
                <input
                  type="time"
                  value={basicInfo.birthTime}
                  onChange={(e) => setBasicInfo({...basicInfo, birthTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Question Steps */}
          {step > 0 && step <= questions.length && (
            <div className="space-y-6">
              {questions[step - 1] && (
                <>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                      {questions[step - 1].category === 'user_self' ? 'About You' : 'About Your Ideal Partner'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {questions[step - 1].text}
                    </h2>
                  </div>

                  {/* True/False Questions */}
                  {questions[step - 1].type === 'true_false' && (
                    <div className="space-y-3">
                      {['True', 'False'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setCurrentAnswer(option)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            currentAnswer === option
                              ? 'border-primary bg-primary/10 text-primary font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              currentAnswer === option ? 'border-primary' : 'border-gray-300'
                            }`}>
                              {currentAnswer === option && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Multiple Choice Questions */}
                  {questions[step - 1].type === 'multiple_choice' && questions[step - 1].options && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
                      {JSON.parse(questions[step - 1].options!).map((option: string) => {
                        const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => handleMultipleChoiceToggle(option)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                                isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              {option}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-0 disabled:cursor-default transition-opacity"
            >
              ← Back
            </button>
            <button
              onClick={handleSkipToDashboard}
              className="px-6 py-3 bg-yellow-600 text-white rounded-full font-medium hover:bg-yellow-700 transition-colors"
            >
              Skip to Dashboard
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              {step === questions.length ? 'Finish Preview' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;
