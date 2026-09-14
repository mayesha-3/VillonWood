import React, { useState } from 'react';
import GameHUDTopLeft from './components/GameHUDTopLeft';
import FrostedFooter from './components/FrostedFooter';
import MapViewer from './components/MapViewer';
import SocialMedia from './socialMedia';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { VILLAGERS_DATA } from './data/villagers';
import type { VillagerProfession, ActiveOverlay } from './types/village';
import { Bot, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      {/* Top-Left Tactical Videogame HUD */}
      <GameHUDTopLeft totalVillagers={VILLAGERS_DATA.length} onLogin={() => setShowAuthModal(true)} />

      {/* Main Interactive Map Viewport */}
      <main className="main-content-viewport">
        <MapViewer
          villagers={VILLAGERS_DATA}
          onSelectLocation={handleSelectLocation}
        />
      </main>

      {/* Frosted Glass Bottom Footer */}
      <FrostedFooter
        activeOverlay={activeOverlay}
        onOpenOverlay={handleOpenOverlay}
      />

      {/* Gated: Villon Media */}
      {user && activeOverlay === 'media' && (
        <SocialMedia onClose={() => setActiveOverlay(null)} />
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
            <Bot size={22} />
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
            <Bot size={22} />
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
    </div>
  );
};

export default App;
