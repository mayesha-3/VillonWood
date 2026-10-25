import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import GameHUDTopLeft from './components/GameHUDTopLeft';
import SidebarDock from './components/SidebarDock';
import MapViewer from './components/MapViewer';
import MapViewer2 from './components/MapViewer2';
import SocialMedia from './socialMedia';
import CameraOverlay from './components/CameraOverlay';
import MusicPlayerOverlay from './components/MusicPlayerOverlay';
import SettingsOverlay from './components/SettingsOverlay';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import RestrictedBanner from './components/RestrictedBanner';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import WordsOfTheDay from './components/WordsOfTheDay';
import QuizModal from './components/QuizModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { useAdmin } from './contexts/AdminContext';
import { VILLAGERS_DATA } from './data/villagers';
import { VILLAGERS_DATA_2 } from './data/villagers2';
import type { VillagerProfession, ActiveOverlay } from './types/village';
import LandingPage from './components/LandingPage';
import { Feather, Sparkles } from 'lucide-react';
import { isMondayUTC } from './utils/dateUtils';

const VillageView: React.FC<{ city?: boolean }> = ({ city = false }) => {
  const { user, loading } = useAuth();
  const { isCurrentUserRestricted, currentUserRole, currentUserCourse } = useAdmin();
  const navigate = useNavigate();

  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [wordsReopenToken, setWordsReopenToken] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isQuizDay, setIsQuizDay] = useState(isMondayUTC);

  useEffect(() => {
    const refreshQuizDay = () => setIsQuizDay(isMondayUTC());
    const timer = window.setInterval(refreshQuizDay, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeZone = city ? 'city2' : 'rural';

  const activeVillagers = activeZone === 'city2' ? VILLAGERS_DATA_2 : VILLAGERS_DATA;

  const handleSelectLocation = (location: VillagerProfession) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedLocation(location);
  };

  const handleOpenOverlay = (overlay: ActiveOverlay) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (overlay === 'ai') {
      setIsAIOpen((prev) => !prev);
    } else if (overlay === 'admin') {
      navigate('/mod');
    } else if (overlay === 'teacher') {
      navigate('/teacher');
    } else {
      setActiveOverlay(overlay);
    }
  };

  if (loading) {
    return (
      <div className="villon-app-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (city && currentUserCourse !== 'advanced') return <Navigate to="/village" replace />;
  if (!city && currentUserCourse === 'advanced') return <Navigate to="/city" replace />;

  // Display the dedicated welcome/cover landing page for unauthenticated visitors
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="villon-app-layout">
      {isCurrentUserRestricted && <RestrictedBanner />}

      <div className="vw-zone-switcher-pill" aria-label="Ville actuelle">
        <span className={`vw-zone-btn active ${city ? 'city' : ''}`}>
          {city ? '🏙 Cité 2000 (Avancé)' : '🌲 Village Ancien'}
        </span>
      </div>

      {/* Top-Left Tactical Videogame HUD */}
      {showHUD && (
        <GameHUDTopLeft 
          totalVillagers={activeVillagers.length} 
          onLogin={() => setShowAuthModal(true)} 
          onShowWordsOfTheDay={() => setWordsReopenToken((token) => token + 1)}
        />
      )}

      {/* Main Interactive Map Viewport */}
      <main className="main-content-viewport">
        {activeZone === 'rural' ? (
          <MapViewer
            villagers={VILLAGERS_DATA}
            onSelectLocation={handleSelectLocation}
          />
        ) : (
          <MapViewer2
            villagers={VILLAGERS_DATA_2}
            onSelectLocation={handleSelectLocation}
          />
        )}
      </main>

      {/* Sidebar Dock */}
      <SidebarDock
        activeOverlay={activeOverlay}
        onOpenOverlay={handleOpenOverlay}
        showHUD={showHUD}
        onToggleHUD={() => setShowHUD((prev) => !prev)}
        isQuizDay={isQuizDay}
        onOpenQuiz={() => {
          if (!user) {
            setShowAuthModal(true);
            return;
          }
          setShowQuiz(true);
        }}
      />

      {/* Gated: Villon Media */}
      {user && activeOverlay === 'media' && (
        <SocialMedia onClose={() => setActiveOverlay(null)} />
      )}
      {user && activeOverlay === 'camera' && (
        <CameraOverlay onClose={() => setActiveOverlay(null)} />
      )}
      {user && activeOverlay === 'music' && (
        <MusicPlayerOverlay onClose={() => setActiveOverlay(null)} />
      )}
      {user && activeOverlay === 'settings' && (
        <SettingsOverlay
          onClose={() => setActiveOverlay(null)}
          showHUD={showHUD}
          onToggleHUD={() => setShowHUD((prev) => !prev)}
          onOpenAdminDashboard={() => navigate('/mod')}
        />
      )}

      {/* Gated: Floating AI Chatbot */}
      {user && (
        <Chatbot
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />
      )}

      {/* Gated: Floating AI Trigger Fab */}
      {user && !isAIOpen && (
        <button
          type="button"
          className="vai-fab-trigger"
          onClick={() => setIsAIOpen(true)}
          title="Ouvrir Villon AI"
        >
          <div className="vai-fab-inner">
            <Feather size={22} />
            <Sparkles size={11} className="vai-fab-sparkle" />
          </div>
          <span className="vai-fab-pulse" />
        </button>
      )}

      {/* Non-logged-in FAB that prompts auth */}
      {!user && (
        <button
          type="button"
          className="vai-fab-trigger"
          onClick={() => setShowAuthModal(true)}
          title="Connexion requise"
        >
          <div className="vai-fab-inner">
            <Feather size={22} />
            <Sparkles size={11} className="vai-fab-sparkle" />
          </div>
          <span className="vai-fab-pulse" />
        </button>
      )}

      {/* Gated: Group Chat */}
      {user && selectedLocation && (
        <GroupChat
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {/* Auth Modal Popup */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Words of the Day floating card (students see this on the map) */}
      {user && <WordsOfTheDay reopenToken={wordsReopenToken} />}

      {/* Weekly Quiz Modal */}
      {user && currentUserRole === 'learner' && (
        <QuizModal
          isOpen={showQuiz && isQuizDay}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

const ModPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserRole, loading } = useAdmin();
  const { user, loading: authLoading } = useAuth();
  if (loading || authLoading) return <div className="villon-app-layout" />;
  if (!user || currentUserRole !== 'admin') return <Navigate to="/village" replace />;
  return <AdminDashboard onBackToMap={() => navigate('/')} />;
};

const TeacherPage: React.FC = () => {
  const navigate = useNavigate();
  return <TeacherDashboard onBackToMap={() => navigate('/')} />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VillageView />} />
      <Route path="/village" element={<VillageView />} />
      <Route path="/city" element={<VillageView city />} />
      <Route path="/mod" element={<ModPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
    </Routes>
  );
};

export default App;
