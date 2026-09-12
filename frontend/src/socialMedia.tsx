import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Scroll,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Send,
  Filter,
  CheckCircle2
} from 'lucide-react';
import mapImage from './assets/map.png';

interface SocialMediaProps {
  onClose: () => void;
}

interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tag: string;
  category: string;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ onClose }) => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'p1',
      title: 'Pains & Brioches du Matin',
      author: 'Jean-Luc Boulanger',
      handle: '@baker_jeanluc',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: 'il y a 25 min',
      content:
        'Baguettes au levain et brioches fraîches tout juste sorties des fours à bois ! Passez à la boulangerie avant midi pour les déguster encore chaudes ! Nos fournées spéciales du week-end comprennent aussi nos tartes aux fruits du verger et nos petits pains feuilletés au miel de Villon.',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      likes: 34,
      comments: 8,
      tag: '#Boulangerie',
      category: 'Boulangerie'
    },
    {
      id: 'p2',
      title: 'Promenade & Pêche sur la Rivière',
      author: 'Captain Jean & Crew',
      handle: '@river_fisherman',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      time: 'il y a 1 h',
      content:
        'Le ciel est dégagé sur la rivière Villon aujourd’hui ! Montez à bord au quai pour discuter avec nous et aider à remonter les filets de truites fraîches ! Nous organisons également une croisière paisible au soleil couchant le long des rives verdoyantes.',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
      likes: 52,
      comments: 12,
      tag: '#Rivière',
      category: 'Rivière'
    },
    {
      id: 'p3',
      title: 'Grand Vin & Dégustation au Clos',
      author: 'Jacques du Clos',
      handle: '@vigneron_villon',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      time: 'il y a 3 h',
      content:
        'Le pinot 1784 élevé en fût de chêne est prêt pour la dégustation de ce soir dans la cave des coteaux ! Tous les villageois et voyageurs sont chaleureusement invités à venir lever leur verre au vignoble.',
      image:
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
      likes: 67,
      comments: 15,
      tag: '#Vignoble',
      category: 'Vignoble'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);

  const feedListRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [unrollPhase, setUnrollPhase] = useState<
    'closed' | 'unrolling' | 'open' | 'closing'
  >('closed');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setUnrollPhase('unrolling');
    }, 140);

    const timer2 = setTimeout(() => {
      setUnrollPhase('open');
    }, 660);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClose = () => {
    setUnrollPhase('closing');
    setTimeout(() => {
      onClose();
    }, 320);
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !p.isLiked
          };
        }
        return p;
      })
    );
  };

  const handleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            isBookmarked: !p.isBookmarked
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newP: SocialPost = {
      id: `p-${Date.now()}`,
      author: 'Vous (Voyageur)',
      handle: '@traveler_villon',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      time: 'à l’instant',
      title: newPostTitle.trim() || 'Nouvelle Annonce au Parchemin',
      content: newPostText.trim(),
      likes: 1,
      comments: 0,
      isLiked: true,
      tag: '#VillonWood',
      category: 'Village'
    };

    setPosts((prev) => [newP, ...prev]);
    setNewPostTitle('');
    setNewPostText('');
    setActiveIndex(0);
    setTimeout(() => {
      postRefs.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const filteredPosts =
    activeCategory === 'Tous'
      ? posts
      : posts.filter((p) => p.category === activeCategory || p.tag.includes(activeCategory));

  const scrollToPost = (index: number) => {
    if (index >= 0 && index < filteredPosts.length) {
      setActiveIndex(index);
      postRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleScroll = () => {
    if (!feedListRef.current) return;
    const container = feedListRef.current;
    const containerTop = container.getBoundingClientRect().top;
    let closestIndex = 0;
    let minDiff = Infinity;

    postRefs.current.forEach((ref, idx) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const diff = Math.abs(rect.top - containerTop);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 overflow-hidden transition-opacity duration-300 ${
        unrollPhase === 'closing' ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* VILLAGE MAP BACKGROUND IMAGE WITH BLUR EFFECT */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-105 transition-all duration-500"
        style={{ backgroundImage: `url(${mapImage})` }}
      />
      <div className="absolute inset-0 bg-[#2b1708]/60 backdrop-blur-sm" />

      <div
        className={`villon-scroll-wrapper relative z-10 phase-${unrollPhase}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP WOODEN ROLLER SPINDLE */}
        <div className="scroll-roller scroll-roller-top">
          <div className="roller-finial finial-left">
            <div className="finial-tip" />
            <div className="finial-ball" />
          </div>

          <div className="roller-bar">
            <div className="roller-brass-ring ring-left" />
            <div className="roller-wood-core" />
            <div className="roller-brass-ring ring-right" />
          </div>

          <div className="roller-finial finial-right">
            <div className="finial-ball" />
            <div className="finial-tip" />
          </div>
        </div>

        {/* CLOSED RIBBON BAND & WAX SEAL */}
        {(unrollPhase === 'closed' || unrollPhase === 'unrolling') && (
          <div
            className={`closed-scroll-band ${
              unrollPhase === 'unrolling' ? 'band-snapping' : ''
            }`}
          >
            <div className="closed-band-ribbon" />
            <div className="closed-band-seal">
              <span className="wax-monogram">⚜</span>
            </div>
          </div>
        )}

        {/* UNFURLING PHYSICAL SCROLL CONTAINER */}
        <div className="scroll-unfurl-container">
          <div className="scroll-paper-curl-top" />

          <div className="scroll-parchment-body">
            {/* WAX SEAL RIBBON */}
            <div className="scroll-wax-seal-ribbon">
              <div className="wax-ribbon ribbon-left" />
              <div className="wax-ribbon ribbon-right" />
              <div className="wax-seal-disc">
                <span className="wax-monogram">⚜</span>
              </div>
            </div>

            {/* GAZETTE HEADER */}
            <div className="social-header scroll-header">
              <div className="social-header-brand">
                <div className="scroll-icon-badge">
                  <Scroll size={22} />
                </div>

                <div>
                  <div className="scroll-pretitle">
                    Chronique & Écrits Communaux • Anno 1784
                  </div>
                  <h2 className="scroll-title">
                    La Gazette de Villon
                    <CheckCircle2 size={16} className="verified-crest" />
                  </h2>
                  <p className="scroll-subtitle">
                    Le Fil Social officiel du Village de Villon
                  </p>
                </div>
              </div>

              <button
                className="scroll-close-btn"
                onClick={handleClose}
                title="Enrouler le parchemin de Villon"
              >
                <X size={18} />
              </button>
            </div>

            {/* CATEGORY FILTER TABS */}
            <div className="social-category-bar">
              <div className="category-label">
                <Filter size={13} />
                <span>Rubriques :</span>
              </div>
              {['Tous', 'Boulangerie', 'Rivière', 'Vignoble'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveIndex(0);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* CREATE ANNOUNCEMENT FORM */}
            <form onSubmit={handleCreatePost} className="create-post-card parchment-post-card">
              <div className="create-post-top">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Vous"
                  className="create-post-avatar parchment-avatar"
                  style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', objectFit: 'cover', borderRadius: '50%' }}
                />

                <div className="parchment-input-wrapper">
                  <input
                    type="text"
                    className="create-post-title-input parchment-input"
                    placeholder="Titre de votre annonce..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <textarea
                    className="create-post-input parchment-input"
                    rows={2}
                    placeholder="Rédigez une missive pour la communauté de Villon..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                </div>
              </div>

              <div className="create-post-bottom parchment-post-bottom">
                <span className="create-post-tag parchment-tag">
                  <Sparkles size={13} />
                  #VillonWood
                </span>

                <button
                  type="submit"
                  className="post-submit-btn parchment-submit-btn"
                  disabled={!newPostText.trim()}
                >
                  <Send size={13} />
                  <span>Publier</span>
                </button>
              </div>
            </form>

            {/* GAZETTE NAVIGATION CONTROLS */}
            <div className="gazette-nav-bar">
              <button
                type="button"
                className="gazette-nav-btn"
                disabled={activeIndex === 0}
                onClick={() => scrollToPost(activeIndex - 1)}
              >
                <ChevronLeft size={16} />
                <span>Précédent</span>
              </button>

              <span className="gazette-nav-counter">
                Annonce {filteredPosts.length > 0 ? activeIndex + 1 : 0} sur {filteredPosts.length}
              </span>

              <button
                type="button"
                className="gazette-nav-btn"
                disabled={activeIndex >= filteredPosts.length - 1}
                onClick={() => scrollToPost(activeIndex + 1)}
              >
                <span>Suivant</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* FEED POSTS LIST */}
            <div
              ref={feedListRef}
              onScroll={handleScroll}
              className="social-feed-list parchment-feed-list"
            >
              {filteredPosts.map((post, idx) => {
                const isExpanded = !!expandedPosts[post.id];

                return (
                  <div
                    key={post.id}
                    ref={(el) => {
                      postRefs.current[idx] = el;
                    }}
                    className="feed-post-card parchment-notice-card"
                  >
                    {/* POST AUTHOR HEADER */}
                    <div className="post-header parchment-card-header">
                      <div className="avatar-frame">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="post-author-avatar parchment-author-avatar"
                          style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </div>

                      <div className="post-author-info">
                        <div className="post-author-name parchment-author-name">
                          {post.author}
                        </div>
                        <div className="post-meta parchment-meta">
                          {post.handle} • {post.time}
                        </div>
                      </div>

                      <span className="post-badge-tag parchment-badge-tag">
                        {post.tag}
                      </span>
                    </div>

                    {/* POST TITLE IN BOLD CURSIVE */}
                    <h3 className="parchment-post-title">
                      {post.title}
                    </h3>

                    {/* SMALLER FRAMED POST IMAGE */}
                    {post.image && (
                      <div className="post-image-wrapper parchment-image-frame">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="post-image parchment-image"
                        />
                      </div>
                    )}

                    {/* POST CONTENT (3-LINE CLAMP WITH SEE MORE) */}
                    <div
                      className={`post-content parchment-content ${
                        isExpanded ? 'expanded' : 'truncated'
                      }`}
                    >
                      {post.content}
                    </div>

                    <button
                      type="button"
                      className="see-more-btn parchment-see-more"
                      onClick={() => toggleExpand(post.id)}
                    >
                      {isExpanded ? (
                        <>
                          <span>Voir moins</span>
                          <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span>Voir la suite</span>
                          <ChevronDown size={14} />
                        </>
                      )}
                    </button>

                    {/* ACTIONS BAR */}
                    <div className="post-actions-bar parchment-actions-bar">
                      <button
                        type="button"
                        className={`action-btn parchment-action-btn ${
                          post.isLiked ? 'liked' : ''
                        }`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart
                          size={16}
                          fill={post.isLiked ? 'currentColor' : 'none'}
                        />
                        <span>{post.likes} Sceaux</span>
                      </button>

                      <button
                        type="button"
                        className="action-btn parchment-action-btn"
                      >
                        <MessageSquare size={16} />
                        <span>{post.comments} Missives</span>
                      </button>

                      <button
                        type="button"
                        className="action-btn parchment-action-btn"
                      >
                        <Share2 size={16} />
                        <span>Transmettre</span>
                      </button>

                      <button
                        type="button"
                        className={`action-btn parchment-action-btn ${
                          post.isBookmarked ? 'bookmarked' : ''
                        }`}
                        onClick={() => handleBookmark(post.id)}
                        title="Enregistrer cette annonce"
                      >
                        <Bookmark
                          size={16}
                          fill={post.isBookmarked ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="empty-feed-notice">
                  <p>Aucune annonce trouvée dans cette rubrique.</p>
                </div>
              )}
            </div>
          </div>

          <div className="scroll-paper-curl-bottom" />
        </div>

        {/* BOTTOM WOODEN ROLLER SPINDLE */}
        <div className="scroll-roller scroll-roller-bottom">
          <div className="roller-finial finial-left">
            <div className="finial-tip" />
            <div className="finial-ball" />
          </div>

          <div className="roller-bar">
            <div className="roller-brass-ring ring-left" />
            <div className="roller-wood-core" />
            <div className="roller-brass-ring ring-right" />
          </div>

          <div className="roller-finial finial-right">
            <div className="finial-ball" />
            <div className="finial-tip" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;

