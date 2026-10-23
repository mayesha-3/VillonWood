import React, { useState, useEffect } from 'react';
import { 
  Settings, X, Shield, User, LogOut, Check, Volume2, VolumeX, 
  Sparkles, Clock, Trash2, Flag, Star, AlertTriangle, Send, Award,
  Cake, Flame, Wine, Anchor, Cloud, Utensils, Scissors, Wrench, Globe, 
  LayoutDashboard, ShieldCheck, GraduationCap, BookOpen, Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSoundEnabled, setSoundEnabled, playSound } from '../utils/soundFX';
import { getUserDailyRole, getGMTCountdown, type RoleInfo } from '../utils/roleRotation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';

interface SettingsOverlayProps {
  onClose: () => void;
  showHUD: boolean;
  onToggleHUD: () => void;
  onOpenAdminDashboard?: () => void;
}

const renderRoleIcon = (iconName: string) => {
  switch (iconName) {
    case 'Cake': return <Cake size={20} />;
    case 'Flame': return <Flame size={20} />;
    case 'Wine': return <Wine size={20} />;
    case 'Anchor': return <Anchor size={20} />;
    case 'Cloud': return <Cloud size={20} />;
    case 'Utensils': return <Utensils size={20} />;
    case 'Scissors': return <Scissors size={20} />;
    case 'Wrench': return <Wrench size={20} />;
    default: return <Award size={20} />;
  }
};

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  onClose,
  showHUD,
  onToggleHUD,
  onOpenAdminDashboard
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { currentUserRole, setCurrentUserRole } = useAdmin();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.email?.split('@')[0] || 'Voyageur');
  const [soundEnabled, setSoundState] = useState<boolean>(getSoundEnabled());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Daily Role State
  const [userRole] = useState<RoleInfo>(getUserDailyRole(user?.uid || user?.email || 'guest'));
  const [countdown, setCountdown] = useState<string>(getGMTCountdown());

  // Interactive Modals State
  const [activeSubModal, setActiveSubModal] = useState<'none' | 'deleteAccount' | 'reportAbuse' | 'rateApp'>('none');
  const [reportCategory, setReportCategory] = useState('comportement');
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getGMTCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundState(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      playSound('shop_bell');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('message');
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportReason('');
      setActiveSubModal('none');
    }, 1800);
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('message');
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingSubmitted(false);
      setRatingFeedback('');
      setActiveSubModal('none');
    }, 1800);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title">
            <Settings size={20} className="settings-icon" />
            <span>{t('settingsTitle')}</span>
          </div>
          <button className="close-modal-btn" onClick={() => { playSound('click'); onClose(); }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-body">
          {/* Section 0: System Language & App Role */}
          <div className="settings-section">
            <label className="settings-label">
              <Globe size={15} /> {t('languageLabel')}
            </label>
            <div className="language-selector-pills">
              <button
                type="button"
                className={`lang-pill-btn ${language === 'fr' ? 'active' : ''}`}
                onClick={() => { playSound('click'); setLanguage('fr'); }}
              >
                <Globe size={14} /> Français
              </button>
              <button
                type="button"
                className={`lang-pill-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => { playSound('click'); setLanguage('en'); }}
              >
                <Globe size={14} /> English
              </button>
            </div>

            <label className="settings-label" style={{ marginTop: '14px' }}>
              <ShieldCheck size={15} /> {t('appRoleLabel')}
            </label>
            <div className="role-selector-pills">
              <button
                type="button"
                className={`role-pill-btn ${currentUserRole === 'learner' ? 'active' : ''}`}
                onClick={() => { playSound('click'); setCurrentUserRole('learner'); }}
              >
                <GraduationCap size={14} /> {t('userRoleLearner')}
              </button>
              <button
                type="button"
                className={`role-pill-btn ${currentUserRole === 'teacher' ? 'active' : ''}`}
                onClick={() => { playSound('click'); setCurrentUserRole('teacher'); }}
              >
                <BookOpen size={14} /> {t('userRoleTeacher')}
              </button>
              <button
                type="button"
                className={`role-pill-btn ${currentUserRole === 'admin' ? 'active' : ''}`}
                onClick={() => { playSound('click'); setCurrentUserRole('admin'); }}
              >
                <Crown size={14} /> {t('userRoleAdmin')}
              </button>
            </div>

            {currentUserRole === 'admin' && onOpenAdminDashboard && (
              <button
                type="button"
                className="admin-dashboard-launch-btn"
                onClick={() => {
                  playSound('click');
                  onClose();
                  onOpenAdminDashboard();
                }}
              >
                <LayoutDashboard size={16} />
                <span>{t('adminPanel')}</span>
              </button>
            )}
          </div>

          {/* Section 1: User Profile & Daily Role */}
          <div className="settings-section">
            <label className="settings-label">
              <User size={15} /> {t('profileLabel')}
            </label>
            <input
              type="text"
              className="settings-input"
              placeholder="Votre nom de voyageur..."
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            {/* 24h GMT Daily Role Card */}
            <div className="daily-role-card">
              <div className="daily-role-header">
                <div className="role-icon-box" style={{ color: userRole.badgeColor }}>
                  {renderRoleIcon(userRole.iconName)}
                </div>
                <div>
                  <div className="role-title-row">
                    <span className="role-name">{userRole.title}</span>
                    <span className="role-badge" style={{ backgroundColor: userRole.badgeColor }}>24h GMT</span>
                  </div>
                  <div className="role-french">{userRole.frenchTitle}</div>
                </div>
              </div>
              <p className="role-desc">{userRole.description}</p>
              <div className="role-timer-row">
                <Clock size={13} className="timer-icon" />
                <span>{t('roleRotation')}: <strong>{countdown}</strong> (00:00 GMT)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Audio & HUD Controls */}
          <div className="settings-section">
            <label className="settings-label">
              <Volume2 size={15} /> {t('audioLabel')}
            </label>

            {/* Sound Toggle */}
            <div className="setting-toggle-row" onClick={handleToggleSound}>
              <div className="toggle-info">
                {soundEnabled ? <Volume2 size={16} className="text-rust" /> : <VolumeX size={16} />}
                <span>{t('soundEffects')}</span>
              </div>
              <div className={`setting-switch ${soundEnabled ? 'on' : 'off'}`}>
                <div className="switch-thumb" />
              </div>
            </div>

            {/* Test Sound Button */}
            {soundEnabled && (
              <button 
                type="button" 
                className="test-sound-btn" 
                onClick={() => playSound('shop_bell')}
              >
                <Sparkles size={13} /> {t('testBell')}
              </button>
            )}

            {/* HUD Toggle */}
            <div className="setting-toggle-row" onClick={onToggleHUD}>
              <div className="toggle-info">
                <Shield size={16} />
                <span>{t('showHUD')}</span>
              </div>
              <div className={`setting-switch ${showHUD ? 'on' : 'off'}`}>
                <div className="switch-thumb" />
              </div>
            </div>
          </div>

          {/* Section 3: Community & Feedback Options */}
          <div className="settings-section">
            <label className="settings-label">
              <Sparkles size={15} /> {t('community')}
            </label>
            <div className="settings-quick-actions">
              <button 
                type="button" 
                className="action-pill-btn" 
                onClick={() => { playSound('click'); setActiveSubModal('rateApp'); }}
              >
                <Star size={14} className="icon-star" />
                <span>{t('rateApp')}</span>
              </button>
              <button 
                type="button" 
                className="action-pill-btn warning" 
                onClick={() => { playSound('click'); setActiveSubModal('reportAbuse'); }}
              >
                <Flag size={14} />
                <span>{t('reportAbuse')}</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="save-success-msg">
              <Check size={16} /> {language === 'fr' ? 'Paramètres enregistrés avec succès !' : 'Settings saved successfully!'}
            </div>
          )}

          {/* Section 4: Account Controls */}
          <div className="settings-footer">
            <button type="submit" className="save-settings-btn">
              {t('save')}
            </button>

            {user && (
              <div className="account-footer-btns">
                <button type="button" className="logout-settings-btn" onClick={logout} title="Déconnexion / Log Out">
                  <LogOut size={15} />
                  <span>{t('logout')}</span>
                </button>
                <button 
                  type="button" 
                  className="delete-account-btn" 
                  onClick={() => { playSound('click'); setActiveSubModal('deleteAccount'); }}
                  title={t('deleteAccount')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Sub-Modal: Rate App */}
        {activeSubModal === 'rateApp' && (
          <div className="submodal-overlay" onClick={() => setActiveSubModal('none')}>
            <div className="submodal-container" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3><Star size={18} className="text-amber" /> {t('rateApp')}</h3>
                <button onClick={() => setActiveSubModal('none')}><X size={16} /></button>
              </div>
              {ratingSubmitted ? (
                <div className="submodal-success">
                  <Check size={32} />
                  <p>{language === 'fr' ? 'Merci pour votre évaluation ! Vos retours nous aident à améliorer le village.' : 'Thank you for your rating! Your feedback helps us improve the village.'}</p>
                </div>
              ) : (
                <form onSubmit={handleRateSubmit} className="submodal-body">
                  <p className="submodal-desc">{language === 'fr' ? 'Quelle est votre expérience dans le village de VillonWood ?' : 'What is your experience in VillonWood village?'}</p>
                  <div className="star-rating-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= ratingStars ? 'active' : ''}`}
                        onClick={() => setRatingStars(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="submodal-textarea"
                    placeholder={language === 'fr' ? 'Laissez un commentaire ou une suggestion (optionnel)...' : 'Leave a comment or suggestion (optional)...'}
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                  />
                  <button type="submit" className="submodal-submit-btn">
                    <Send size={15} /> {language === 'fr' ? `Envoyer la note (${ratingStars}/5)` : `Submit rating (${ratingStars}/5)`}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Sub-Modal: Report Abuse */}
        {activeSubModal === 'reportAbuse' && (
          <div className="submodal-overlay" onClick={() => setActiveSubModal('none')}>
            <div className="submodal-container" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3><Flag size={18} className="text-red" /> {t('reportAbuse')}</h3>
                <button onClick={() => setActiveSubModal('none')}><X size={16} /></button>
              </div>
              {reportSubmitted ? (
                <div className="submodal-success">
                  <Check size={32} />
                  <p>{language === 'fr' ? 'Signalement transmis aux gardes du village. Merci pour votre vigilance.' : 'Report submitted to village guards. Thank you for your vigilance.'}</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="submodal-body">
                  <label className="submodal-label">{language === 'fr' ? 'Type de problème :' : 'Problem type:'}</label>
                  <select 
                    className="submodal-select"
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                  >
                    <option value="comportement">{language === 'fr' ? 'Comportement inapproprié' : 'Inappropriate behavior'}</option>
                    <option value="spam">{language === 'fr' ? 'Spam ou publicité dans le chat' : 'Spam or chat advertising'}</option>
                    <option value="usurpation">{language === 'fr' ? 'Usurpation d\'identité' : 'Impersonation'}</option>
                    <option value="autre">{language === 'fr' ? 'Autre motif' : 'Other reason'}</option>
                  </select>
                  <label className="submodal-label">{language === 'fr' ? 'Détails du signalement :' : 'Report details:'}</label>
                  <textarea
                    className="submodal-textarea"
                    placeholder={language === 'fr' ? 'Décrivez la situation ou le message problématique...' : 'Describe the issue or problematic message...'}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  />
                  <button type="submit" className="submodal-submit-btn red">
                    <AlertTriangle size={15} /> {language === 'fr' ? 'Soumettre le signalement' : 'Submit report'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Sub-Modal: Delete Account Confirmation */}
        {activeSubModal === 'deleteAccount' && (
          <div className="submodal-overlay" onClick={() => setActiveSubModal('none')}>
            <div className="submodal-container danger-box" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3><AlertTriangle size={18} className="text-red" /> {t('deleteAccount')}</h3>
                <button onClick={() => setActiveSubModal('none')}><X size={16} /></button>
              </div>
              <div className="submodal-body">
                <p className="submodal-danger-text">
                  {language === 'fr' ? 'Êtes-vous absolument sûr de vouloir supprimer votre compte citoyen ? Toutes vos données et messages dans le village seront supprimés.' : 'Are you sure you want to delete your account? All your village data and messages will be permanently removed.'}
                </p>
                <div className="submodal-actions">
                  <button type="button" className="submodal-cancel-btn" onClick={() => setActiveSubModal('none')}>
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button 
                    type="button" 
                    className="submodal-confirm-delete-btn"
                    onClick={() => {
                      playSound('click');
                      logout();
                      onClose();
                    }}
                  >
                    {language === 'fr' ? 'Oui, supprimer définitivement' : 'Yes, delete permanently'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsOverlay;
