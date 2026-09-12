import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import MapViewer from './components/MapViewer';
import SocialMedia from './socialMedia';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import { VILLAGERS_DATA } from './data/villagers';
import type { VillagerProfession, ActiveOverlay } from './types/village';
import { Bot, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [inspectorMode, setInspectorMode] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(true);

  const handleSelectLocation = (location: VillagerProfession) => {
    setSelectedLocation(location);
  };




  const handleOpenOverlay = (overlay: ActiveOverlay) => {
    if (overlay === 'ai') {
      setIsAIOpen((prev) => !prev);
    } else {
      setActiveOverlay(overlay);
    }
  };

  return (
    <div className="villon-app-layout relative w-screen h-screen overflow-hidden">
      {/* Header Navigation Bar (highest z-index: 300) */}
      <HeaderNav
        activeOverlay={activeOverlay}
        isAIOpen={isAIOpen}
        onOpenOverlay={handleOpenOverlay}
        inspectorMode={inspectorMode}
        onToggleInspectorMode={() => setInspectorMode((prev) => !prev)}
      />

      {/* Main Interactive Map Viewport (Draggable & Zoomable) */}
      <main className="main-content-viewport">
        <MapViewer
          villagers={VILLAGERS_DATA}
          onSelectLocation={handleSelectLocation}
          inspectorMode={inspectorMode}
          onToggleInspectorMode={() => setInspectorMode((prev) => !prev)}
        />
      </main>

      {/* Villon Media (La Gazette de Villon) Dedicated Page Overlay with Blurred Village Map Background */}
      {activeOverlay === 'media' && (
        <SocialMedia onClose={() => setActiveOverlay(null)} />
      )}

      {/* Transparent Floating AI Chatbot Popup (Right Corner z-250) */}
      <Chatbot
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Floating AI Trigger Fab Button (Visible when AI is closed) */}
      {!isAIOpen && (
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

      {/* Location / Profession Group Chat Overlay (Bakery, Boat, Forge, etc.) */}
      {selectedLocation && (
        <GroupChat
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default App;

