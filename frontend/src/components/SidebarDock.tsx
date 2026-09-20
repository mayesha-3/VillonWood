import React, { useState } from 'react';
import { Newspaper, Camera, Music, Settings, Shield, Volume2 } from 'lucide-react';
import type { ActiveOverlay } from '../types/village';

interface SidebarDockProps {
  activeOverlay: ActiveOverlay;
  onOpenOverlay: (overlay: ActiveOverlay) => void;
  showHUD: boolean;
  onToggleHUD: () => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({
  activeOverlay,
  onOpenOverlay,
  showHUD,
  onToggleHUD
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const toggleMusic = () => {
    setIsPlayingMusic((prev) => !prev);
    onOpenOverlay(activeOverlay === 'music' ? null : 'music');
  };

  return (
    <div className="villon-sidebar-dock">
      {/* 1. Social Media / Gazette */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'media' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('media')}
        title="Villon Media (Gazette)"
      >
        <Newspaper size={20} />
        <span className="sidebar-tooltip">Villon Media</span>
      </button>

      {/* 2. Camera / Photo Booth */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'camera' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('camera')}
        title="Mode Photo / Caméra"
      >
        <Camera size={20} />
        <span className="sidebar-tooltip">Photo Booth</span>
      </button>

      {/* 3. Music / Village Ambience */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'music' || isPlayingMusic ? 'active' : ''}`}
        onClick={toggleMusic}
        title="Ambiance & Musique du village"
      >
        {isPlayingMusic ? <Volume2 size={20} /> : <Music size={20} />}
        <span className="sidebar-tooltip">Musique</span>
      </button>

      {/* 4. Settings */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'settings' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('settings')}
        title="Paramètres"
      >
        <Settings size={20} />
        <span className="sidebar-tooltip">Paramètres</span>
      </button>

      {/* 5. Stat Bar ON/OFF Toggle */}
      <button
        type="button"
        className={`sidebar-round-btn ${showHUD ? 'active-hud' : ''}`}
        onClick={onToggleHUD}
        title={showHUD ? "Masquer le Statut HUD" : "Afficher le Statut HUD"}
      >
        <Shield size={20} />
        <span className="sidebar-tooltip">{showHUD ? "Masquer Statut" : "Statut HUD"}</span>
        <span className={`sidebar-dot-indicator ${showHUD ? 'on' : 'off'}`} />
      </button>
    </div>
  );
};

export default SidebarDock;
