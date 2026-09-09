import React, { useState } from 'react';
import { X, Heart, MessageSquare, Share2, Send, Sparkles } from 'lucide-react';

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
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=JeanBoulanger',
      time: 'il y a 25 min',
      content: 'Baguettes au levain et brioches fraîches tout juste sorties des fours à bois ! Passez à la boulangerie avant midi pour les déguster encore chaudes ! 🥖🍞',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      likes: 34,
      comments: 8,
      tag: '#Boulangerie'
    },
    {
      id: 'p2',
      author: 'Captain Jean & River Crew',
      handle: '@river_fisherman',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CaptainJean',
      time: 'il y a 1 h',
      content: 'Le ciel est dégagé sur la rivière Villon aujourd’hui ! Montez à bord au quai pour discuter avec nous et aider à remonter les filets de truites fraîches ! 🐟⚓',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
      likes: 52,
      comments: 12,
      tag: '#BateauDeLaRivière'
    },
    {
      id: 'p3',
      author: 'Jacques du Clos',
      handle: '@vigneron_villon',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jacques',
      time: 'il y a 3 h',
      content: 'Le pinot 1784 élevé en fût de chêne est prêt pour la dégustation de ce soir dans la cave des coteaux ! Tous les villageois sont invités.',
      likes: 67,
      comments: 15,
      tag: '#Vignoble'
    }
  ]);

  const [newPostText, setNewPostText] = useState('');

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
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=YouTraveler',
      time: 'à l’instant',
      content: newPostText.trim(),
      likes: 1,
      comments: 0,
      isLiked: true,
      tag: '#VillonWood'
    };

    setPosts([newP, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="social-media-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="social-header">
          <div className="social-header-brand">
            <div className="social-icon-badge">
              <Share2 size={24} />
            </div>
            <div>
              <h2>Villon Media</h2>
              <p>The Gazette & Social Feed of Villon Wood</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose} title="Fermer le journal de Villon">
            <X size={20} />
          </button>
        </div>

        {/* Create Post Form */}
        <form onSubmit={handleCreatePost} className="create-post-card">
          <div className="create-post-top">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=YouTraveler" 
              alt="Vous" 
              className="create-post-avatar" 
            />
            <textarea
              className="create-post-input"
              rows={2}
              placeholder="Partagez ce qui se passe à VillonWood..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
          </div>
          <div className="create-post-bottom">
            <span className="create-post-tag"><Sparkles size={14} /> #VillonWood</span>
            <button type="submit" className="post-submit-btn" disabled={!newPostText.trim()}>
              <Send size={16} />
              <span>Publier dans le journal</span>
            </button>
          </div>
        </form>

        {/* Feed Posts */}
        <div className="social-feed-list">
          {posts.map((post) => (
            <div key={post.id} className="feed-post-card">
              <div className="post-header">
                <img src={post.avatar} alt={post.author} className="post-author-avatar" />
                <div className="post-author-info">
                  <div className="post-author-name">{post.author}</div>
                  <div className="post-meta">{post.handle} • {post.time}</div>
                </div>
                <span className="post-badge-tag">{post.tag}</span>
              </div>

              <div className="post-content">{post.content}</div>

              {post.image && (
                <div className="post-image-wrapper">
                  <img src={post.image} alt="Post attachment" className="post-image" />
                </div>
              )}

              <div className="post-actions-bar">
                <button 
                  className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span>{post.likes} J’aime</span>
                </button>
                <button className="action-btn">
                  <MessageSquare size={16} />
                  <span>{post.comments} commentaires</span>
                </button>
                <button className="action-btn">
                  <Share2 size={16} />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
