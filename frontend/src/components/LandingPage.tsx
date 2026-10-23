import React, { useState, useRef } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  MessageSquare,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

interface VillagePlace {
  id: string;
  name: string;
  character: string;
  image: string;
  category: string;
  description: string;
}

const VILLAGE_HIGHLIGHTS: VillagePlace[] = [
  {
    id: 'boulangerie',
    name: 'La Boulangerie de Villon',
    character: 'Maître Étienne',
    image: '/pictures/bakery.png',
    category: 'Artisanat & Cuisine',
    description: 'Commandez votre pain frais du matin, apprenez les mesures artisanales et échangez avec l’artisan boulanger.'
  },
  {
    id: 'vignoble',
    name: 'Le Vignoble des Coteaux',
    character: 'Jacques du Clos',
    image: '/pictures/winery.png',
    category: 'Terroir & Traditions',
    description: 'Découvrez les secrets de la fermentation, les vendanges ensoleillées et le vocabulaire des grands crus.'
  },
  {
    id: 'auberge',
    name: "L'Auberge de l'Écu d'Or",
    character: "L'Aubergiste Mathilde",
    image: '/pictures/inn.png',
    category: 'Accueil & Échanges',
    description: 'Rejoignez la grande table commune pour écouter des récits de voyageurs et converser autour d’un repas chaud.'
  },
  {
    id: 'forge',
    name: 'La Forge Ardente',
    character: 'Maître Vulcain',
    image: '/pictures/forge.png',
    category: 'Métiers du Fer',
    description: 'Entendez le marteau frapper l’enclume et discutez métallurgie médiévale au milieu des étincelles vives.'
  },
  {
    id: 'moulin',
    name: 'Le Moulin des Vents',
    character: 'Le Meunier Florent',
    image: '/pictures/windmill.png',
    category: 'Agriculture & Nature',
    description: 'Surplombant la vallée, observez la rotation des ailes au fil des saisons et apprenez la mouture du blé.'
  },
  {
    id: 'ferme',
    name: 'La Ferme & Les Champs',
    character: 'Maître Bertrand',
    image: '/pictures/farmer.png',
    category: 'Champs Fertiles',
    description: 'Explorez les sillons fertiles et pratiquez la conversation rustique au rythme des semailles et des moissons.'
  }
];

export const LandingPage: React.FC = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // References for scrolling
  const authCardRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const scrollToAuth = (mode?: 'login' | 'signup') => {
    if (mode) setAuthMode(mode);
    setAuthError('');
    authCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 450);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match. Please try again.');
        return;
      }
      if (password.length < 6) {
        setAuthError('Password must contain at least 6 characters.');
        return;
      }
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(cleanEmail, password);
      } else {
        await signup(cleanEmail, password);
      }
      // Success: Firebase Auth listener in AuthContext will update user automatically
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setAuthError('Incorrect email or password. Please verify your credentials.');
      } else if (code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Try signing in instead.');
      } else if (code === 'auth/weak-password') {
        setAuthError('Password is too weak. Please use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your internet connection.');
      } else {
        setAuthError(err?.message || 'An error occurred during authentication.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      await loginWithGoogle();
      // Success handled by AuthContext
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthError(err?.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="vw-landing-container">
      {/* Ambient background canvases */}
      <div className="vw-bg-canvas" />
      <div className="vw-bg-ambient-texture" />

      <div className="vw-content">
        {/* ═══════════ HEADER ═══════════ */}
        <header className="vw-header">
          <div className="vw-header-inner">
            <a href="#" className="vw-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="vw-brand-icon-box">⚜</div>
              <div className="vw-brand-text">
                <span className="vw-brand-name">Villonwood</span>
                <span className="vw-brand-tag">Language Realm</span>
              </div>
            </a>

            <nav className="vw-nav-links">
              <button type="button" className="vw-nav-link" onClick={() => scrollToSection('how-it-works')}>
                How It Works
              </button>
              <button type="button" className="vw-nav-link" onClick={() => scrollToSection('village-places')}>
                The Village
              </button>
              <button type="button" className="vw-nav-link" onClick={() => scrollToSection('features')}>
                Features
              </button>
            </nav>

            <div className="vw-header-actions">
              <button
                type="button"
                className="vw-btn-ghost"
                onClick={() => scrollToAuth('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="vw-btn-primary-sm"
                onClick={() => scrollToAuth('signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="vw-hero-section">
          {/* Left: Value Proposition */}
          <div className="vw-hero-left">
            <div className="vw-hero-badge">
              <span className="vw-hero-badge-dot" />
              <span>An Immersive Language Simulation</span>
            </div>

            <h1 className="vw-hero-title">
              A New World.
              <span className="vw-hero-title-accent">A New Language.</span>
            </h1>

            <p className="vw-hero-description">
              Step into Villonwood, a living medieval realm where language learning comes alive.
              Wander through picturesque villages, converse with AI-powered inhabitants, and gain
              natural fluency through authentic immersion.
            </p>

            <div className="vw-hero-ctas">
              <button
                type="button"
                className="vw-btn-hero-primary"
                onClick={() => scrollToAuth('signup')}
              >
                <span>Get Started Free</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="vw-btn-hero-secondary"
                onClick={() => scrollToSection('how-it-works')}
              >
                <Compass size={17} />
                <span>Explore Villonwood</span>
              </button>
            </div>

            <div className="vw-hero-highlights">
              <div className="vw-hero-highlight-item">
                <span className="vw-highlight-num">18+</span>
                <span className="vw-highlight-label">Authentic Village Locations</span>
              </div>
              <div className="vw-hero-highlight-item">
                <span className="vw-highlight-num">AI Native</span>
                <span className="vw-highlight-label">Living Dialogue Partners</span>
              </div>
              <div className="vw-hero-highlight-item">
                <span className="vw-highlight-num">100%</span>
                <span className="vw-highlight-label">Interactive Immersion</span>
              </div>
            </div>
          </div>

          {/* Right: Direct Authentication Card */}
          <div className="vw-auth-card-wrapper" ref={authCardRef}>
            <div className="vw-auth-card-glow" />
            <div className="vw-auth-card">
              {/* Mode Toggle Tabs */}
              <div className="vw-auth-tabs">
                <button
                  type="button"
                  className={`vw-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  className={`vw-auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                >
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Header inside card */}
              <div className="vw-auth-header">
                <h2 className="vw-auth-heading">
                  {authMode === 'login' ? 'Welcome Back Traveler' : 'Begin Your Voyage'}
                </h2>
                <p className="vw-auth-subtext">
                  {authMode === 'login'
                    ? 'Enter your credentials to re-enter the village'
                    : 'Create your explorer profile in seconds'}
                </p>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="vw-auth-error">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="vw-auth-form">
                <div className="vw-input-group">
                  <label className="vw-input-label">Email Address</label>
                  <div className="vw-input-field">
                    <Mail size={16} className="vw-input-icon" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      placeholder="explorer@villonwood.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="vw-input"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="vw-input-group">
                  <label className="vw-input-label">Password</label>
                  <div className="vw-input-field">
                    <Lock size={16} className="vw-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter at least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="vw-input"
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      className="vw-pw-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div className="vw-input-group">
                    <label className="vw-input-label">Confirm Password</label>
                    <div className="vw-input-field">
                      <Lock size={16} className="vw-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="vw-input"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="vw-submit-btn"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <span className="vw-spinner" />
                  ) : authMode === 'login' ? (
                    <>
                      <LogIn size={16} />
                      <span>Enter Villonwood</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Create Account & Enter</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="vw-auth-divider">
                <span className="vw-divider-line" />
                <span className="vw-divider-text">or</span>
                <span className="vw-divider-line" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="vw-google-btn"
                onClick={handleGoogleAuth}
                disabled={authLoading}
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Bottom Mode Switch Link */}
              <p className="vw-auth-toggle-hint">
                {authMode === 'login' ? (
                  <>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      className="vw-auth-switch-link"
                      onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="vw-auth-switch-link"
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS (3 STEPS) ═══════════ */}
        <section id="how-it-works" className="vw-section">
          <div className="vw-section-header">
            <span className="vw-section-kicker">Language Learning Reimagined</span>
            <h2 className="vw-section-title">How Villonwood Works</h2>
            <p className="vw-section-desc">
              Forget robotic flashcards and tedious grammar tables. Master languages organically
              by living inside a persistent, interactive world.
            </p>
          </div>

          <div className="vw-steps-grid">
            <div className="vw-step-card">
              <span className="vw-step-num-badge">1</span>
              <div className="vw-step-icon-wrap">
                <BookOpen size={24} />
              </div>
              <h3 className="vw-step-title">Choose Your Language</h3>
              <p className="vw-step-text">
                Select your target language and immerse yourself from day one. Begin with
                everyday French in a living medieval setting tailored to your personal pace.
              </p>
            </div>

            <div className="vw-step-card">
              <span className="vw-step-num-badge">2</span>
              <div className="vw-step-icon-wrap">
                <Compass size={24} />
              </div>
              <h3 className="vw-step-title">Explore The World</h3>
              <p className="vw-step-text">
                Roam the detailed interactive map. Step inside rustic bakeries, sun-drenched vineyards,
                lively inns, and ancient forges to discover rich context-driven vocabulary.
              </p>
            </div>

            <div className="vw-step-card">
              <span className="vw-step-num-badge">3</span>
              <div className="vw-step-icon-wrap">
                <MessageSquare size={24} />
              </div>
              <h3 className="vw-step-title">Practice & Gain Fluency</h3>
              <p className="vw-step-text">
                Engage in natural conversations with intelligent villagers powered by Villon AI.
                Practice listening, ask questions, and build lasting conversational confidence.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ VILLAGE PLACES SHOWCASE ═══════════ */}
        <section id="village-places" className="vw-section">
          <div className="vw-section-header">
            <span className="vw-section-kicker">A Living Medieval Setting</span>
            <h2 className="vw-section-title">Explore The Village</h2>
            <p className="vw-section-desc">
              Every building in Villonwood is an interactive conversation hub with authentic
              historical inhabitants and unique cultural lore.
            </p>
          </div>

          <div className="vw-showcase-grid">
            {VILLAGE_HIGHLIGHTS.map((place) => (
              <div key={place.id} className="vw-place-card">
                <div className="vw-place-img-wrap">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="vw-place-img"
                    loading="lazy"
                  />
                  <div className="vw-place-overlay" />
                  <span className="vw-place-badge">{place.category}</span>
                </div>
                <div className="vw-place-content">
                  <h3 className="vw-place-title">{place.name}</h3>
                  <span className="vw-place-char">Rencontrez : {place.character}</span>
                  <p className="vw-place-desc">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ THREE PILLARS / FEATURES ═══════════ */}
        <section id="features" className="vw-section">
          <div className="vw-section-header">
            <span className="vw-section-kicker">Built For Mastery</span>
            <h2 className="vw-section-title">The Villonwood Advantage</h2>
            <p className="vw-section-desc">
              Harness the power of game mechanics and generative AI to learn a new language naturally.
            </p>
          </div>

          <div className="vw-pillars-grid">
            <div className="vw-pillar-card">
              <div className="vw-pillar-icon">
                <Sparkles size={22} />
              </div>
              <h3 className="vw-pillar-title">Villon AI Companion</h3>
              <p className="vw-pillar-text">
                Always at your side with contextual grammar guidance, translation hints, and
                personalized feedback whenever you converse with characters.
              </p>
            </div>

            <div className="vw-pillar-card">
              <div className="vw-pillar-icon">
                <MapPin size={22} />
              </div>
              <h3 className="vw-pillar-title">Bird's-Eye Interactive Map</h3>
              <p className="vw-pillar-text">
                Freely pan and zoom through hills, riverbanks, and market squares. Each location
                has its own occupants, soundscapes, and conversational prompts.
              </p>
            </div>

            <div className="vw-pillar-card">
              <div className="vw-pillar-icon">
                <Users size={22} />
              </div>
              <h3 className="vw-pillar-title">Social Guilds & Lore</h3>
              <p className="vw-pillar-text">
                Exchange photos in the community feed, participate in public tavern gatherings,
                and connect with fellow language explorers on the same quest.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ CALL TO ACTION BANNER ═══════════ */}
        <section className="vw-cta-banner">
          <div className="vw-cta-banner-inner">
            <h2 className="vw-cta-title">Your Medieval Odyssey Starts Here</h2>
            <p className="vw-cta-desc">
              Join travelers from around the globe who are discovering the joy of language learning
              through world exploration and living conversations.
            </p>
            <button
              type="button"
              className="vw-btn-hero-primary"
              onClick={() => scrollToAuth('signup')}
            >
              <span>Create Your Account</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="vw-footer">
          <div className="vw-footer-inner">
            <div className="vw-footer-brand">
              <span>⚜</span>
              <span>Villonwood</span>
            </div>

            <span className="vw-footer-copy">
              © {new Date().getFullYear()} Villonwood. A New World. A New Language. All rights reserved.
            </span>

            <div className="vw-footer-badge">
              <span>Français & Multilingual Realm</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
