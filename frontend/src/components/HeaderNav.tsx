import type { ActiveOverlay } from '../types/village';
import { Castle, Users, Crosshair, Share2, Bot, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  activeOverlay: ActiveOverlay;
  onOpenOverlay: (overlay: ActiveOverlay) => void;
  inspectorMode: boolean;
  onToggleInspectorMode: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeOverlay,
  onOpenOverlay,
  inspectorMode,
  onToggleInspectorMode
}) => {
  return (
    <header className="villon-header">
      {/* Brand & Title */}
      <div className="header-brand-section">
        <div className="brand-logo-badge">
          <Castle size={28} />
        </div>
        <div>
          <h1 className="brand-title">VillonWood</h1>
          <p className="brand-subtitle">Village français ancien • Carte des 20 métiers</p>
        </div>
      </div>

      {/* Center Circle Overlay Triggers: Villon Media & Villon AI */}
      <div className="header-circle-triggers">
        {/* Villon Media Circle Trigger */}
        <button 
          className={`circle-trigger-btn ${activeOverlay === 'media' ? 'active' : ''}`}
          onClick={() => onOpenOverlay('media')}
          title="Ouvrir le journal social de Villon"
        >
          <div className="circle-inner media-circle">
            <Share2 size={24} />
            <span className="live-pulse-dot" />
          </div>
          <span className="circle-name">Villon Media</span>
        </button>

        {/* Villon AI Circle Trigger */}
        <button 
          className={`circle-trigger-btn ${activeOverlay === 'ai' ? 'active' : ''}`}
          onClick={() => onOpenOverlay('ai')}
          title="Ouvrir l’assistant du village"
        >
          <div className="circle-inner ai-circle">
            <Bot size={26} />
            <Sparkles className="sparkle-accent" size={12} />
          </div>
          <span className="circle-name">Villon AI</span>
        </button>
      </div>

      {/* Header Right Actions */}
      <div className="header-right-actions">
        <div className="stats-pill">
          <Users size={16} />
          <span>20 villageois actifs</span>
        </div>

        <button 
          className={`inspector-toggle-badge ${inspectorMode ? 'active' : ''}`}
          onClick={onToggleInspectorMode}
          title="Cliquer sur la carte pour inspecter les coordonnées"
        >
          <Crosshair size={16} />
          <span>{inspectorMode ? 'Mode coordonnées : activé' : 'Mode coordonnées'}</span>
        </button>
      </div>
    </header>
  );
};

export default HeaderNav;
