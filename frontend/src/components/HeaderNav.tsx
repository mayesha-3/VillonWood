import type { ActiveOverlay } from '../types/village';
import { Castle, Users, Crosshair, Bot, Sparkles, Scroll } from 'lucide-react';

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
        {/* Villon Media Scroll Trigger */}
        <button 
          className={`circle-trigger-btn scroll-trigger-btn ${activeOverlay === 'media' ? 'active' : ''}`}
          onClick={() => onOpenOverlay('media')}
          title="Dérouler le parchemin de Villon (Villon Media)"
        >
          <div className="circle-inner scroll-nav-pill">
            <div className="mini-dowel-cap cap-left" />
            <div className="mini-scroll-body">
              <Scroll size={20} className="scroll-svg-icon" />
              <span className="mini-wax-seal">⚜</span>
            </div>
            <div className="mini-dowel-cap cap-right" />
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
