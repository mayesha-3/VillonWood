import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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

const VillageView: React.FC = () => {
  const { user, loading } = useAuth();
  const { isCurrentUserRestricted } = useAdmin();
  const navigate = useNavigate();

  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Active Zone: 'rural' (Village de Villon) or 'city2' (Cité 2000 - Zone Avancée)
  // Supports URL query param ?zone=city2 or ?zone=advanced for teacher gating
  const [activeZone, setActiveZone] = useState<'rural' | 'city2'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('zone') === 'city2' || params.get('zone') === 'advanced') {
        return 'city2';
      }
    }
    return 'rural';
  });

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

  // Display the dedicated welcome/cover landing page for unauthenticated visitors
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="villon-app-layout">
      {isCurrentUserRestricted && <RestrictedBanner />}

      {/* Zone Switcher (Village Ancien vs Cité 2000 Avancée) */}
      <div className="vw-zone-switcher-pill">
        <button
          type="button"
          className={`vw-zone-btn ${activeZone === 'rural' ? 'active' : ''}`}
          onClick={() => { setActiveZone('rural'); setSelectedLocation(null); }}
          title="Zone Rurale : Village Ancien de Villon"
        >
          <span>🌲 Village Ancien</span>
        </button>
        <button
          type="button"
          className={`vw-zone-btn city ${activeZone === 'city2' ? 'active' : ''}`}
          onClick={() => { setActiveZone('city2'); setSelectedLocation(null); }}
          title="Zone Avancée : Cité Française Années 2000"
        >
          <span>🏙 Cité 2000 (Avancé)</span>
        </button>
      </div>

      {/* Top-Left Tactical Videogame HUD */}
      {showHUD && (
        <GameHUDTopLeft 
          totalVillagers={activeVillagers.length} 
          onLogin={() => setShowAuthModal(true)} 
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
      {user && <WordsOfTheDay />}

      {/* Weekly Quiz Modal */}
      {user && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

const ModPage: React.FC = () => {
  const navigate = useNavigate();
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
      <Route path="/mod" element={<ModPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
    </Routes>
  );
};

export default App;
