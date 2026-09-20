import React, { useState } from 'react';
import GameHUDTopLeft from './components/GameHUDTopLeft';
import SidebarDock from './components/SidebarDock';
import MapViewer from './components/MapViewer';
import SocialMedia from './socialMedia';
import CameraOverlay from './components/CameraOverlay';
import MusicPlayerOverlay from './components/MusicPlayerOverlay';
import SettingsOverlay from './components/SettingsOverlay';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { VILLAGERS_DATA } from './data/villagers';
import type { VillagerProfession, ActiveOverlay } from './types/village';
import { Feather, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHUD, setShowHUD] = useState<boolean>(false);

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

  return (
    <div className="villon-app-layout">
     
      {showHUD && (
        <GameHUDTopLeft 
          totalVillagers={VILLAGERS_DATA.length} 
          onLogin={() => setShowAuthModal(true)} 
        />
      )}
      <main className="main-content-viewport">
        <MapViewer
          villagers={VILLAGERS_DATA}
          onSelectLocation={handleSelectLocation}
        />
      </main>

  
      <SidebarDock
        activeOverlay={activeOverlay}
        onOpenOverlay={handleOpenOverlay}
        showHUD={showHUD}
        onToggleHUD={() => setShowHUD((prev) => !prev)}
      />

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
        />
      )}

      {user && (
        <Chatbot
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />
      )}

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

      {user && selectedLocation && (
        <GroupChat
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default App;
