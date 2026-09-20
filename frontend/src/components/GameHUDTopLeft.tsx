import React, { useState } from 'react';
import { Castle, Users, Radio, Shield, Settings, LogOut, User, Check, X, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GameHUDTopLeftProps {
  totalVillagers?: number;
  onLogin?: () => void;
}

export const GameHUDTopLeft: React.FC<GameHUDTopLeftProps> = ({
  totalVillagers = 20,
  onLogin
}) => {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [displayName, setDisplayName] = useState('');

  const shownName = displayName || user?.displayName || user?.email?.split('@')[0] || '';

  const handleSaveUsername = () => {
    if (usernameInput.trim()) {
      setDisplayName(usernameInput.trim());
    }
    setShowSettings(false);
    setUsernameInput('');
  };

  return (
    <div className="ff-gaming-hud-container">
      <div className="ff-hud-plate">
        {/* Tactical Corner Accents */}
        <div className="ff-corner ff-corner-tl" />
        <div className="ff-corner ff-corner-tr" />
        <div className="ff-corner ff-corner-bl" />
        <div className="ff-corner ff-corner-br" />

        {/* User identity bar */}
        {user ? (
          <div className="ff-user-bar">
            <div className="ff-user-avatar-mini">
              <User size={11} />
            </div>
            <span className="ff-user-name">{shownName}</span>
          </div>
        ) : (
          <div className="ff-user-bar">
            <button className="ff-login-btn" onClick={onLogin}>
              <LogIn size={11} />
              <span>Se connecter</span>
            </button>
          </div>
        )}

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
          <div className="ff-logo-crest">
            <div className="ff-crest-glow" />
            <div className="ff-crest-inner">
              <Castle size={26} className="ff-crest-icon" />
            </div>
            <div className="ff-rank-star">
              <Shield size={10} />
            </div>
          </div>
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

        {/* Alive Counter */}
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

        {/* Settings & Logout bar — only when logged in */}
        {user && (
          <div className="ff-actions-bar">
            <button className="ff-action-btn" onClick={() => { setShowSettings(!showSettings); setUsernameInput(displayName); }} title="Paramètres">
              <Settings size={13} />
              <span>Paramètres</span>
            </button>
            <button className="ff-action-btn ff-logout-btn" onClick={logout} title="Déconnexion">
              <LogOut size={13} />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="ff-settings-dropdown">
          <label className="ff-settings-label">Nom d'utilisateur</label>
          <div className="ff-settings-input-row">
            <input
              type="text"
              className="ff-settings-input"
              placeholder={shownName || 'Entrez un pseudo...'}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
            />
            <button className="ff-settings-save" onClick={handleSaveUsername}><Check size={14} /></button>
            <button className="ff-settings-cancel" onClick={() => setShowSettings(false)}><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHUDTopLeft;
