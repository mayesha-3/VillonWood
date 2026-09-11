import React from 'react';
import { Castle, Users, Radio, Shield } from 'lucide-react';

interface GameHUDTopLeftProps {
  totalVillagers?: number;
}

export const GameHUDTopLeft: React.FC<GameHUDTopLeftProps> = ({
  totalVillagers = 20
}) => {
  return (
    <div className="ff-gaming-hud-container">
      {/* Free Fire Style Tactical Outer HUD Card */}
      <div className="ff-hud-plate">
        {/* Tactical Corner Accents */}
        <div className="ff-corner ff-corner-tl" />
        <div className="ff-corner ff-corner-tr" />
        <div className="ff-corner ff-corner-bl" />
        <div className="ff-corner ff-corner-br" />

        {/* Top Tactical Status Bar */}
        <div className="ff-hud-statusbar">
          <div className="ff-server-status">
            <span className="ff-live-dot" />
            <span className="ff-status-text">SRV // VILLON-FRANCE</span>
          </div>
          <div className="ff-hud-ping">
            <Radio size={12} className="ff-ping-icon" />
            <span>24ms</span>
          </div>
        </div>

        {/* Brand & Logo Row */}
        <div className="ff-brand-row">
          {/* Free Fire Style Crest / Avatar Badge */}
          <div className="ff-logo-crest">
            <div className="ff-crest-glow" />
            <div className="ff-crest-inner">
              <Castle size={26} className="ff-crest-icon" />
            </div>
            <div className="ff-rank-star">
              <Shield size={10} />
            </div>
          </div>

          {/* Titles & Realm */}
          <div className="ff-brand-info">
            <div className="ff-title-wrap">
              <h1 className="ff-brand-title">VILLONWOOD</h1>
              <span className="ff-badge-tag">RPG</span>
            </div>
            <div className="ff-brand-sub">
              <span>LE MONDE DES 20 MÉTIERS</span>
            </div>
          </div>
        </div>

        {/* Free Fire Style "ALIVE / SURVIVORS" Tactical Counter */}
        <div className="ff-alive-counter-section">
          <div className="ff-alive-badge">
            <div className="ff-alive-icon-box">
              <Users size={16} />
              <span className="ff-alive-pulse-ring" />
            </div>
            <div className="ff-alive-data">
              <span className="ff-alive-label">ALIVE / CITOYENS</span>
              <span className="ff-alive-number">{totalVillagers}</span>
            </div>
          </div>

          {/* Mini Health / Readiness Gauge (Tactical aesthetic) */}
          <div className="ff-gauge-cluster">
            <div className="ff-gauge-label">
              <span>STATUT DU VILLAGE</span>
              <span className="ff-gauge-val">100% ACTIF</span>
            </div>
            <div className="ff-gauge-track">
              <div className="ff-gauge-bar" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUDTopLeft;
