import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfirmModal from './components/ConfirmModal';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilPage from './pages/ProfilPage';
import MateriPage from './pages/MateriPage';
import MataPelajaranPage from './pages/MataPelajaranPage';
import DetailBabPage from './pages/DetailBabPage';
import QuizPage from './pages/QuizPage';
import QuizRunnerPage from './pages/QuizRunnerPage';
import GamePage from './pages/GamePage';
import CapaianPage from './pages/CapaianPage';
import PengaturanPage from './pages/PengaturanPage';

function AppContent() {
  const { user, loading, logout } = useAuth();

  // Navigation state
  const [currentRoute, setCurrentRoute] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [settingsActiveTab, setSettingsActiveTab] = useState('info');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: 'var(--bg-app)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '4px solid var(--sage-200)',
          borderTopColor: 'var(--sage-600)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--sage-700)' }}>
          Memuat Rumah Bunda LMS...
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  // Navigation handler
  const handleNavigate = (routeKey) => {
    setCurrentRoute(routeKey);
    setSelectedSubject(null);
    setSelectedChapterNumber(null);
    setActiveQuizId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (slug) => {
    setSelectedSubject(slug);
    setSelectedChapterNumber(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapter = (slug, chapterNumber) => {
    setCurrentRoute('materi');
    setSelectedSubject(slug);
    setSelectedChapterNumber(chapterNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuiz = (quizId) => {
    setActiveQuizId(quizId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current view
  const renderCurrentView = () => {
    // 1. Detail Bab
    if (currentRoute === 'materi' && selectedSubject && selectedChapterNumber) {
      return (
        <DetailBabPage
          subjectSlug={selectedSubject}
          chapterNumber={selectedChapterNumber}
          onBackToSubject={() => setSelectedChapterNumber(null)}
          onNavigateChapter={(slug, chapNum) => setSelectedChapterNumber(chapNum)}
          onGoHome={() => handleNavigate('home')}
          onGoMateri={() => { setSelectedSubject(null); setSelectedChapterNumber(null); }}
          onOpenQuiz={(quizId) => {
            setCurrentRoute('quiz');
            setActiveQuizId(quizId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGame={(gameSlug) => {
            setCurrentRoute('game');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }

    // 2. Daftar Bab Mata Pelajaran
    if (currentRoute === 'materi' && selectedSubject) {
      return (
        <MataPelajaranPage
          subjectSlug={selectedSubject}
          onBack={() => setSelectedSubject(null)}
          onOpenChapter={(slug, num) => handleOpenChapter(slug, num)}
          onOpenQuiz={(quizId) => {
            setCurrentRoute('quiz');
            setActiveQuizId(quizId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGame={(gameSlug) => {
            setCurrentRoute('game');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }

    // 3. Quiz Runner
    if (currentRoute === 'quiz' && activeQuizId) {
      return (
        <QuizRunnerPage
          quizId={activeQuizId}
          onBackToList={() => setActiveQuizId(null)}
        />
      );
    }

    // 4. Main Menu Pages
    switch (currentRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenChapter={(slug, num) => handleOpenChapter(slug, num)}
            onStartQuiz={(quizId) => {
              setCurrentRoute('quiz');
              setActiveQuizId(quizId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'profil':
        return (
          <ProfilPage
            onEditProfile={(targetTab) => {
              setSettingsActiveTab(targetTab || 'info');
              handleNavigate('pengaturan');
            }}
          />
        );
      case 'materi':
        return <MateriPage onSelectSubject={handleSelectSubject} />;
      case 'quiz':
        return <QuizPage onStartQuiz={handleStartQuiz} />;
      case 'game':
        return <GamePage />;
      case 'capaian':
        return (
          <CapaianPage
            onNavigateMateri={() => handleNavigate('materi')}
            onNavigateQuiz={() => handleNavigate('quiz')}
            onNavigateGame={() => handleNavigate('game')}
            onOpenChapter={(slug, num) => handleOpenChapter(slug, num)}
            onStartQuiz={(quizId) => {
              setCurrentRoute('quiz');
              setActiveQuizId(quizId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'pengaturan':
        return (
          <PengaturanPage
            activeTab={settingsActiveTab}
            onChangeTab={(tab) => setSettingsActiveTab(tab)}
          />
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenChapter={(slug, num) => handleOpenChapter(slug, num)}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />
      <div className="main-wrapper">
        <Header
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <main className="content-area">
          {renderCurrentView()}
        </main>
        <Footer />
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun LMS Rumah Bunda? Seluruh progres belajarmu tetap tersimpan aman di database."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isDanger={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
