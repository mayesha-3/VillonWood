import React, { useState } from 'react';
import GameHUDTopLeft from './components/GameHUDTopLeft';
import FrostedFooter from './components/FrostedFooter';
import MapViewer from './components/MapViewer';
import SocialMedia from './socialMedia';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import { VILLAGERS_DATA } from './data/villagers';
import type { VillagerProfession, ActiveOverlay } from './types/village';

export const App: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);

  const handleSelectLocation = (location: VillagerProfession) => {
    setSelectedLocation(location);
  };

  const handleNavigateToLocationFromAI = (locationId: string) => {
    const loc = VILLAGERS_DATA.find((v) => v.id === locationId);
    if (loc) {
      setSelectedLocation(loc);
    }
  };

  return (
    <div className="villon-app-layout">
      {/* Top-Left Tactical Videogame HUD (Free Fire Style): Logo & Active Villagers */}
      <GameHUDTopLeft totalVillagers={VILLAGERS_DATA.length} />

      {/* Main Interactive Map Viewport (Draggable & Zoomable - Full Viewport) */}
      <main className="main-content-viewport">
        <MapViewer
          villagers={VILLAGERS_DATA}
          onSelectLocation={handleSelectLocation}
        />
      </main>

      {/* Frosted Glass Bottom Footer: Villon AI (Left) & Villon Media (Right) */}
      <FrostedFooter
        activeOverlay={activeOverlay}
        onOpenOverlay={(overlay) => setActiveOverlay(overlay)}
      />

      {/* Villon Media Overlay */}
      {activeOverlay === 'media' && (
        <SocialMedia onClose={() => setActiveOverlay(null)} />
      )}

      {/* Villon AI Overlay */}
      {activeOverlay === 'ai' && (
        <Chatbot 
          onClose={() => setActiveOverlay(null)} 
          onNavigateToLocation={handleNavigateToLocationFromAI}
        />
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
