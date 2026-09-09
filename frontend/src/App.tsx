import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import MapViewer from './components/MapViewer';
import SocialMedia from './socialMedia';
import Chatbot from './chatbot';
import GroupChat from './groupChats';
import { VILLAGERS_DATA } from './data/villagers';
import type { VillagerProfession, ActiveOverlay } from './types/village';

export const App: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [selectedLocation, setSelectedLocation] = useState<VillagerProfession | null>(null);
  const [inspectorMode, setInspectorMode] = useState<boolean>(false);

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
      {/* Header Navigation with Villon Media & Villon AI Circular Triggers */}
      <HeaderNav
        activeOverlay={activeOverlay}
        onOpenOverlay={(overlay) => setActiveOverlay(overlay)}
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
