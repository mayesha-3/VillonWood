import React, { useState } from 'react';
import { Settings, X, Shield, User, LogOut, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsOverlayProps {
  onClose: () => void;
  showHUD: boolean;
  onToggleHUD: () => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  onClose,
  showHUD,
  onToggleHUD
}) => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title">
            <Settings size={20} className="settings-icon" />
            <span>Paramètres de VillonWood</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-body">
          <div className="settings-section">
            <label className="settings-label">
              <User size={16} /> Profil de citoyen
            </label>
            <input
              type="text"
              className="settings-input"
              placeholder="Votre nom de voyageur..."
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="settings-section">
            <label className="settings-label">
              <Shield size={16} /> Statut HUD & Interfaces
            </label>
            <div className="setting-toggle-row" onClick={onToggleHUD}>
              <span>Afficher la barre de statut en haut à gauche</span>
              <div className={`setting-switch ${showHUD ? 'on' : 'off'}`}>
                <div className="switch-thumb" />
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="save-success-msg">
              <Check size={16} /> Paramètres enregistrés avec succès !
            </div>
          )}

          <div className="settings-footer">
            <button type="submit" className="save-settings-btn">
              Enregistrer
            </button>

            {user && (
              <button type="button" className="logout-settings-btn" onClick={logout}>
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsOverlay;
