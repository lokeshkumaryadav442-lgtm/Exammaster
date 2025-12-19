import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, LogOut, User } from 'lucide-react';
import { supabase, Exam, ExamAttempt } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onStartExam: (exam: Exam) => void;
  onViewResult: (attemptId: string) => void;
}

export const Dashboard = ({ onStartExam, onViewResult }: DashboardProps) => {
  const { profile, signOut } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (examsError) throw examsError;

      const { data: attemptsData, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      if (attemptsError) throw attemptsError;

      setExams(examsData || []);
      setAttempts(attemptsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const stats = {
    totalAttempts: attempts.length,
    avgScore: attempts.length > 0
      ? attempts
          .filter((a) => a.percentage !== null)
          .reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.filter((a) => a.percentage !== null).length
      : 0,
    passed: attempts.filter((a) => a.passed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Exam Master</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">{profile?.full_name}</span>
              {profile?.is_guest && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Guest</span>
              )}
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {profile?.full_name}!</h2>
          <p className="text-gray-600">Ready to challenge yourself with a new exam?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalAttempts}</div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.avgScore > 0 ? `${stats.avgScore.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.passed}</div>
            <div className="text-sm text-gray-600">Exams Passed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Available Exams</h3>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h4>
                      <p className="text-gray-600 mb-4">{exam.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{exam.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>Passing: {exam.passing_score}%</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onStartExam(exam)}
                      className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Attempts</h3>
            <div className="space-y-4">
              {attempts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No attempts yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start an exam to see your history</p>
                </div>
              ) : (
                attempts.map((attempt) => {
                  const exam = exams.find((e) => e.id === attempt.exam_id);
                  return (
                    <div
                      key={attempt.id}
                      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => onViewResult(attempt.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{exam?.title || 'Unknown Exam'}</h4>
                          <div className="text-sm text-gray-600">
                            {new Date(attempt.started_at).toLocaleDateString()}
                          </div>
                        </div>
                        {attempt.percentage !== null && (
                          <div
                            className={`text-lg font-bold ${
                              attempt.passed ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {attempt.percentage.toFixed(0)}%
                          </div>
                        )}
                      </div>
                      {attempt.passed !== null && (
                        <div
                          className={`inline-block text-xs px-2 py-1 rounded-full ${
                            attempt.passed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
