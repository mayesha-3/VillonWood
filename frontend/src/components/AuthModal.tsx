import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else if (code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible');
      } else if (code === 'auth/invalid-email') {
        setError('Adresse email invalide');
      } else {
        setError(err?.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Erreur de connexion Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="auth-close-btn" onClick={onClose}><X size={18} /></button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">⚜</span>
          </div>
          <h2 className="auth-title">
            {mode === 'login' ? 'Bienvenue à VillonWood' : 'Rejoindre VillonWood'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Connectez-vous pour accéder au village'
              : 'Créez votre compte de voyageur'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <Mail size={16} className="auth-field-icon" />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <Lock size={16} className="auth-field-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="auth-field">
              <Lock size={16} className="auth-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : mode === 'login' ? (
              <><LogIn size={16} /><span>Se connecter</span></>
            ) : (
              <><UserPlus size={16} /><span>Créer un compte</span></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">ou</span>
          <span className="auth-divider-line" />
        </div>

        {/* Google */}
        <button type="button" className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continuer avec Google</span>
        </button>

        {/* Toggle mode */}
        <div className="auth-toggle">
          {mode === 'login' ? (
            <p>Pas encore de compte ? <button type="button" onClick={() => { setMode('signup'); setError(''); }}>S'inscrire</button></p>
          ) : (
            <p>Déjà un compte ? <button type="button" onClick={() => { setMode('login'); setError(''); }}>Se connecter</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
