import React from 'react';
import type { ActiveOverlay } from '../types/village';
import { Bot, Sparkles, Share2, Compass, MessageSquareCode } from 'lucide-react';

interface FrostedFooterProps {
  activeOverlay: ActiveOverlay;
  onOpenOverlay: (overlay: ActiveOverlay) => void;
}

export const FrostedFooter: React.FC<FrostedFooterProps> = ({
  activeOverlay,
  onOpenOverlay
}) => {
  return (
    <footer className="frosted-village-footer">
      {/* Background Glow Effect Accent */}
      <div className="frosted-footer-glow-line" />

      <div className="frosted-footer-inner">
        {/* Left: Villon Media */}
        <div className="footer-side footer-side-left">
          <button
            type="button"
            className={`footer-action-btn footer-media-btn ${activeOverlay === 'media' ? 'active' : ''}`}
            onClick={() => onOpenOverlay('media')}
            title="Ouvrir Villon Media - Le journal social du village"
          >
            <div className="footer-btn-icon-wrapper media-wrapper">
              <Share2 size={20} className="footer-main-icon" />
              <span className="footer-live-beacon" />
              <span className="footer-pulse-halo" />
            </div>
            <div className="footer-btn-text">
              <div className="footer-btn-title-row">
                <span className="footer-btn-name">Villon Media</span>
                <span className="footer-pill-badge media-pill">LIVE FEED</span>
              </div>
              <span className="footer-btn-sub">Gazette officielle & bavardages du bourg</span>
            </div>
          </button>
        </div>

        {/* Center: Atmospheric Village Locator & Info */}
        <div className="footer-center-section">
          <div className="footer-village-compass">
            <Compass size={15} className="compass-icon" />
            <span className="compass-text">VILLONWOOD • CARTE DES 20 MÉTIERS</span>
          </div>
          <div className="footer-quick-tip">
            <MessageSquareCode size={13} />
            <span>Sélectionnez un atelier ou un habitant sur la carte pour dialoguer</span>
          </div>
        </div>

        {/* Right: Villon AI */}
        <div className="footer-side footer-side-right">
          <button
            type="button"
            className={`footer-action-btn footer-ai-btn ${activeOverlay === 'ai' ? 'active' : ''}`}
            onClick={() => onOpenOverlay('ai')}
            title="Ouvrir Villon AI - Assistant d'intelligence du village"
          >
            <div className="footer-btn-text text-right">
              <div className="footer-btn-title-row right-align">
                <span className="footer-pill-badge ai-pill">INTELLIGENCE</span>
                <span className="footer-btn-name">Villon AI</span>
              </div>
              <span className="footer-btn-sub">Assistant du village & guide interactif</span>
            </div>
            <div className="footer-btn-icon-wrapper ai-wrapper">
              <Bot size={22} className="footer-main-icon" />
              <Sparkles size={11} className="footer-sparkle-icon" />
              <span className="footer-pulse-halo" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FrostedFooter;
