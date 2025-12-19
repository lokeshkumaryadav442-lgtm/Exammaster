import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Clock, AlertCircle } from 'lucide-react';
import { supabase, Question, ExamAttempt, Exam } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ExamInterfaceProps {
  exam: Exam;
  onComplete: (attemptId: string) => void;
  onCancel: () => void;
}

export const ExamInterface = ({ exam, onComplete, onCancel }: ExamInterfaceProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [attemptId, setAttemptId] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(exam.duration_minutes * 60);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadQuestionsAndStartAttempt();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [videoEnabled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadQuestionsAndStartAttempt = async () => {
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', exam.id)
        .order('order_index');

      if (questionsError) throw questionsError;

      const totalPoints = questionsData?.reduce((sum, q) => sum + q.points, 0) || 0;

      const { data: attemptData, error: attemptError } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: user!.id,
          exam_id: exam.id,
          total_points: totalPoints,
          video_monitoring_enabled: videoEnabled,
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      setQuestions(questionsData || []);
      setAttemptId(attemptData.id);
      setLoading(false);
    } catch (error) {
      console.error('Error loading exam:', error);
      alert('Failed to load exam. Please try again.');
      onCancel();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setVideoEnabled(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(new Map(answers.set(questionId, answerIndex)));
  };

  const handleSubmit = async () => {
    try {
      const answersToSubmit = questions.map((q) => {
        const selectedAnswer = answers.get(q.id) ?? -1;
        const isCorrect = selectedAnswer === q.correct_answer;
        return {
          attempt_id: attemptId,
          question_id: q.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        };
      });

      const { error: answersError } = await supabase
        .from('exam_answers')
        .insert(answersToSubmit);

      if (answersError) throw answersError;

      const score = answersToSubmit
        .filter((a) => a.is_correct)
        .reduce((sum, a) => {
          const question = questions.find((q) => q.id === a.question_id);
          return sum + (question?.points || 0);
        }, 0);

      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const percentage = (score / totalPoints) * 100;
      const passed = percentage >= exam.passing_score;

      const { error: updateError } = await supabase
        .from('exam_attempts')
        .update({
          completed_at: new Date().toISOString(),
          score,
          percentage,
          passed,
        })
        .eq('id', attemptId);

      if (updateError) throw updateError;

      stopCamera();
      onComplete(attemptId);
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                videoEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {videoEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {currentQuestion.question_text}
                </h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers.get(currentQuestion.id) === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers.get(currentQuestion.id) === index
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {answers.get(currentQuestion.id) === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-3">Video Monitoring</h4>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {videoEnabled ? (
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <CameraOff className="w-12 h-12" />
                    </div>
                  )}
                </div>
                {videoEnabled && (
                  <div className="flex items-start gap-2 mt-3 text-xs text-gray-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Camera monitoring is active for exam integrity</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Question Overview</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        idx === currentQuestionIndex
                          ? 'bg-blue-600 text-white'
                          : answers.has(q.id)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                    <span className="text-gray-600">Answered</span>
                  </div>
                  <span className="text-gray-600">
                    {answers.size}/{questions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
