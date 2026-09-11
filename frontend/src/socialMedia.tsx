import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Scroll,
  Feather
} from 'lucide-react';

interface SocialMediaProps {
  onClose: () => void;
}

interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  tag: string;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ onClose }) => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'p1',
      author: 'Jean-Luc Boulanger',
      handle: '@baker_jeanluc',
      avatar:
        'https://api.dicebear.com/7.x/bottts/svg?seed=JeanBoulanger',
      time: 'il y a 25 min',
      content:
        'Baguettes au levain et brioches fraîches tout juste sorties des fours à bois ! Passez à la boulangerie avant midi pour les déguster encore chaudes ! 🥖🍞',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      likes: 34,
      comments: 8,
      tag: '#Boulangerie'
    },
    {
      id: 'p2',
      author: 'Captain Jean & River Crew',
      handle: '@river_fisherman',
      avatar:
        'https://api.dicebear.com/7.x/bottts/svg?seed=CaptainJean',
      time: 'il y a 1 h',
      content:
        'Le ciel est dégagé sur la rivière Villon aujourd’hui ! Montez à bord au quai pour discuter avec nous et aider à remonter les filets de truites fraîches ! 🐟⚓',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
      likes: 52,
      comments: 12,
      tag: '#BateauDeLaRivière'
    },
    {
      id: 'p3',
      author: 'Jacques du Clos',
      handle: '@vigneron_villon',
      avatar:
        'https://api.dicebear.com/7.x/bottts/svg?seed=Jacques',
      time: 'il y a 3 h',
      content:
        'Le pinot 1784 élevé en fût de chêne est prêt pour la dégustation de ce soir dans la cave des coteaux ! Tous les villageois sont invités.',
      likes: 67,
      comments: 15,
      tag: '#Vignoble'
    }
  ]);

  const [newPostText, setNewPostText] = useState('');

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPostText.trim()) return;

    const newP: SocialPost = {
      id: `p-${Date.now()}`,
      author: 'Vous (invité du village)',
      handle: '@traveler_villon',
      avatar:
        'https://api.dicebear.com/7.x/bottts/svg?seed=YouTraveler',
      time: 'à l’instant',
      content: newPostText.trim(),
      likes: 1,
      comments: 0,
      isLiked: true,
      tag: '#VillonWood'
    };

    setPosts((prev) => [newP, ...prev]);
    setNewPostText('');
  };

  return (
    <div
      className={`overlay-backdrop scroll-overlay-backdrop ${
        unrollPhase === 'closing' ? 'fade-out' : ''
      }`}
      onClick={handleClose}
    >
      <div
        className={`villon-scroll-wrapper phase-${unrollPhase}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP ROLLER */}
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

        {/* CLOSED BAND */}
        {(unrollPhase === 'closed' ||
          unrollPhase === 'unrolling') && (
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

        {/* =====================================================
            SCROLLABLE AREA
        ====================================================== */}
        <div className="scroll-unfurl-container">
          <div className="scroll-paper-curl-top" />

          <div className="scroll-parchment-body">
            {/* WAX SEAL */}
            <div className="scroll-wax-seal-ribbon">
              <div className="wax-ribbon ribbon-left" />
              <div className="wax-ribbon ribbon-right" />

              <div className="wax-seal-disc">
                <span className="wax-monogram">⚜</span>
              </div>
            </div>

            {/* HEADER */}
            <div className="social-header scroll-header">
              <div className="social-header-brand">
                <div className="scroll-icon-badge">
                  <Scroll size={24} />
                </div>

                <div>
                  <div className="scroll-pretitle">
                    Chronique & Écrits de Villon • Anno 1784
                  </div>

                  <h2 className="scroll-title">
                    La Gazette de Villon
                  </h2>

                  <p className="scroll-subtitle">
                    Journal communal & annonces des villageois
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

            {/* DIVIDER */}
            <div className="parchment-flourish-divider">
              <span className="flourish-leaf">❧</span>

              <div className="flourish-line" />

              <span className="flourish-crest">
                ✦ Villon Wood ✦
              </span>

              <div className="flourish-line" />

              <span className="flourish-leaf">☙</span>
            </div>

            {/* CREATE POST */}
            <form
              onSubmit={handleCreatePost}
              className="create-post-card parchment-post-card"
            >
              <div className="create-post-top">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=YouTraveler"
                  alt="Vous"
                  className="create-post-avatar parchment-avatar"
                />

                <div className="parchment-input-wrapper">
                  <textarea
                    className="create-post-input parchment-input"
                    rows={2}
                    placeholder="Prenez la plume et proclamez une annonce dans la gazette..."
                    value={newPostText}
                    onChange={(e) =>
                      setNewPostText(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="create-post-bottom parchment-post-bottom">
                <span className="create-post-tag parchment-tag">
                  <Sparkles size={14} />
                  #VillonWood
                </span>

                <button
                  type="submit"
                  className="post-submit-btn parchment-submit-btn"
                  disabled={!newPostText.trim()}
                >
                  <Feather size={15} />
                  <span>Publier au parchemin</span>
                </button>
              </div>
            </form>

            {/* FEED */}
            <div className="social-feed-list parchment-feed-list">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="feed-post-card parchment-notice-card"
                >
                  <div className="post-header parchment-card-header">
                    <div className="avatar-frame">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="post-author-avatar parchment-author-avatar"
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

                  <div className="post-content parchment-content">
                    {post.content}
                  </div>

                  {post.image && (
                    <div className="post-image-wrapper parchment-image-frame">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="post-image parchment-image"
                      />
                    </div>
                  )}

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
                        fill={
                          post.isLiked
                            ? 'currentColor'
                            : 'none'
                        }
                      />

                      <span>
                        {post.likes} Sceau d’honneur
                      </span>
                    </button>

                    <button
                      type="button"
                      className="action-btn parchment-action-btn"
                    >
                      <MessageSquare size={16} />

                      <span>
                        {post.comments} missives
                      </span>
                    </button>

                    <button
                      type="button"
                      className="action-btn parchment-action-btn"
                    >
                      <Share2 size={16} />

                      <span>Transmettre</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-paper-curl-bottom" />
        </div>

        {/* BOTTOM ROLLER */}
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
