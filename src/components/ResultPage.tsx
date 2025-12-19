import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, Clock, Target, TrendingUp, Home } from 'lucide-react';
import { supabase, ExamAttempt, Exam, Question, ExamAnswer } from '../lib/supabase';

interface ResultPageProps {
  attemptId: string;
  onBackToDashboard: () => void;
}

interface QuestionResult {
  question: Question;
  answer: ExamAnswer;
}

export const ResultPage = ({ attemptId, onBackToDashboard }: ResultPageProps) => {
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      const { data: attemptData, error: attemptError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();

      if (attemptError) throw attemptError;

      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', attemptData.exam_id)
        .single();

      if (examError) throw examError;

      const { data: answersData, error: answersError } = await supabase
        .from('exam_answers')
        .select('*')
        .eq('attempt_id', attemptId);

      if (answersError) throw answersError;

      const questionIds = answersData.map((a) => a.question_id);
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds)
        .order('order_index');

      if (questionsError) throw questionsError;

      const resultsData = questionsData.map((question) => ({
        question,
        answer: answersData.find((a) => a.question_id === question.id)!,
      }));

      setAttempt(attemptData);
      setExam(examData);
      setResults(resultsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      alert('Failed to load results. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt || !exam) return null;

  const correctAnswers = results.filter((r) => r.answer.is_correct).length;
  const totalQuestions = results.length;
  const percentage = attempt.percentage || 0;
  const passed = attempt.passed;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div
            className={`p-8 ${
              passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          >
            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
                {passed ? <Trophy className="w-10 h-10" /> : <Target className="w-10 h-10" />}
              </div>
              <h1 className="text-3xl font-bold mb-2">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
              <p className="text-xl opacity-90">
                {passed ? 'You passed the exam!' : 'You can always try again!'}
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mt-1">Score</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600 mt-1">Correct</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-gray-600 mt-1">Incorrect</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-600">{exam.passing_score}%</div>
                <div className="text-sm text-gray-600 mt-1">Passing Score</div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Performance Analysis</h2>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accuracy Rate</span>
                  <span className="font-semibold text-gray-800">
                    {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Questions Attempted</span>
                  <span className="font-semibold text-gray-800">
                    {totalQuestions} / {totalQuestions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Video Monitoring</span>
                  <span className="font-semibold text-gray-800">
                    {attempt.video_monitoring_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Review</h2>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div
                key={result.question.id}
                className={`border-2 rounded-lg p-6 ${
                  result.answer.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {result.answer.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">Question {index + 1}</span>
                      <span className="text-sm text-gray-600">({result.question.points} points)</span>
                    </div>
                    <p className="text-gray-800 mb-4">{result.question.question_text}</p>
                    <div className="space-y-2">
                      {result.question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg ${
                            optionIndex === result.question.correct_answer
                              ? 'bg-green-100 border-2 border-green-500'
                              : optionIndex === result.answer.selected_answer
                              ? 'bg-red-100 border-2 border-red-500'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {optionIndex === result.question.correct_answer && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {optionIndex === result.answer.selected_answer &&
                              optionIndex !== result.question.correct_answer && (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            <span className="text-gray-800">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!result.answer.is_correct && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Correct answer:</strong> {result.question.options[result.question.correct_answer]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
