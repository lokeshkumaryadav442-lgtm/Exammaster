import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAsGuest, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your email');
          return;
        }
        await resetPassword(email);
        setSuccess('Password reset link sent to your email');
        setEmail('');
      } else if (mode === 'guest') {
        if (!fullName.trim()) {
          setError('Please enter your name');
          return;
        }
        await signInAsGuest(fullName);
      } else if (mode === 'signup') {
        if (!email || !password || !fullName.trim()) {
          setError('Please fill all fields');
          return;
        }
        await signUp(email, password, fullName);
      } else {
        if (!email || !password) {
          setError('Please fill all fields');
          return;
        }
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 rounded-full p-3 mr-3">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Master</h1>
        </div>

        {mode === 'forgot' && (
          <button
            onClick={() => setMode('signin')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('guest')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'guest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Guest
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'forgot' ? (
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="resetEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-600 mt-2">
                We'll send a link to reset your password to this email address.
              </p>
            </div>
          ) : mode === 'guest' ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
            </>
          ) : (
            <>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'forgot' ? 'Send Reset Link' : mode === 'guest' ? 'Continue as Guest' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>

          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
            >
              Forgot your password?
            </button>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === 'forgot'
            ? 'Enter your email to receive a password reset link'
            : mode === 'guest'
            ? 'Guest accounts let you try exams without registration'
            : mode === 'signup'
            ? 'Create an account to track your progress over time'
            : 'Sign in to access your exam history and results'}
        </p>
      </div>
    </div>
  );
};
