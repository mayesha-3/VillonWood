import React from 'react';
import { Newspaper, Camera, Music, Settings, Shield, Volume2, LayoutDashboard } from 'lucide-react';
import type { ActiveOverlay } from '../types/village';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useMusic } from '../contexts/MusicContext';

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
  const { isPlaying: isPlayingMusic } = useMusic();
  const { currentUserRole } = useAdmin();
  const { t } = useLanguage();

  const toggleMusic = () => {
    if (activeOverlay === 'music') {
      onOpenOverlay(null);
      return;
    }

    onOpenOverlay('music');
  };

  return (
    <div className="villon-sidebar-dock">
      {/* 1. Social Media / Gazette */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'media' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('media')}
        title={t('sidebarMedia')}
      >
        <Newspaper size={20} />
        <span className="sidebar-tooltip">{t('sidebarMedia')}</span>
      </button>

      {/* 2. Camera / Photo Booth */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'camera' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('camera')}
        title={t('sidebarCamera')}
      >
        <Camera size={20} />
        <span className="sidebar-tooltip">{t('sidebarCamera')}</span>
      </button>

      {/* 3. Music / Village Ambience */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'music' || isPlayingMusic ? 'active' : ''}`}
        onClick={toggleMusic}
        title={t('sidebarMusic')}
      >
        {isPlayingMusic ? <Volume2 size={20} /> : <Music size={20} />}
        <span className="sidebar-tooltip">{t('sidebarMusic')}</span>
      </button>

      {/* 4. Settings */}
      <button
        type="button"
        className={`sidebar-round-btn ${activeOverlay === 'settings' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('settings')}
        title={t('sidebarSettings')}
      >
        <Settings size={20} />
        <span className="sidebar-tooltip">{t('sidebarSettings')}</span>
      </button>

      {/* 5. Admin Panel Button (if admin) */}
      {currentUserRole === 'admin' && (
        <button
          type="button"
          className={`sidebar-round-btn admin-badge-btn ${activeOverlay === 'admin' ? 'active' : ''}`}
          onClick={() => onOpenOverlay('admin')}
          title={t('sidebarAdmin')}
        >
          <LayoutDashboard size={20} />
          <span className="sidebar-tooltip">{t('sidebarAdmin')}</span>
        </button>
      )}

      {/* 6. Stat Bar ON/OFF Toggle */}
      <button
        type="button"
        className={`sidebar-round-btn ${showHUD ? 'active-hud' : ''}`}
        onClick={onToggleHUD}
        title={showHUD ? t('sidebarHudHide') : t('sidebarHudShow')}
      >
        <Shield size={20} />
        <span className="sidebar-tooltip">{showHUD ? t('sidebarHudHide') : t('sidebarHudShow')}</span>
        <span className={`sidebar-dot-indicator ${showHUD ? 'on' : 'off'}`} />
      </button>
    </div>
  );
};

export default SidebarDock;
