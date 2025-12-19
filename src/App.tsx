import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ExamInterface } from './components/ExamInterface';
import { ResultPage } from './components/ResultPage';
import { Exam } from './lib/supabase';

type AppView = 'dashboard' | 'exam' | 'result';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('dashboard');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [resultAttemptId, setResultAttemptId] = useState<string>('');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setView('exam');
  };

  const handleCompleteExam = (attemptId: string) => {
    setResultAttemptId(attemptId);
    setView('result');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedExam(null);
    setResultAttemptId('');
  };

  const handleViewResult = (attemptId: string) => {
    setResultAttemptId(attemptId);
    setView('result');
  };

  return (
    <>
      {view === 'dashboard' && (
        <Dashboard onStartExam={handleStartExam} onViewResult={handleViewResult} />
      )}
      {view === 'exam' && selectedExam && (
        <ExamInterface
          exam={selectedExam}
          onComplete={handleCompleteExam}
          onCancel={handleBackToDashboard}
        />
      )}
      {view === 'result' && resultAttemptId && (
        <ResultPage attemptId={resultAttemptId} onBackToDashboard={handleBackToDashboard} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
