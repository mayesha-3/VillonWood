import type { ActiveOverlay } from '../types/village';
import { Share2, Bot, Sparkles } from 'lucide-react';

interface QuickOverlaysProps {
  activeOverlay: ActiveOverlay;
  onOpenOverlay: (overlay: ActiveOverlay) => void;
}

export const QuickOverlays: React.FC<QuickOverlaysProps> = ({
  activeOverlay,
  onOpenOverlay
}) => {
  return (
    <div className="quick-overlays-container">
      {/* Villon Media Circle Trigger */}
      <button 
        className={`circle-trigger-card ${activeOverlay === 'media' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('media')}
        title="Open Villon Media Social Overlay"
      >
        <div className="circle-avatar media-avatar">
          <Share2 className="avatar-icon" size={26} />
          <span className="live-dot" />
        </div>
        <div className="circle-label">
          <span className="title">Villon Media</span>
          <span className="subtitle">Social Feed</span>
        </div>
      </button>

      {/* Villon AI Circle Trigger */}
      <button 
        className={`circle-trigger-card ${activeOverlay === 'ai' ? 'active' : ''}`}
        onClick={() => onOpenOverlay('ai')}
        title="Open Villon AI Village Assistant Overlay"
      >
        <div className="circle-avatar ai-avatar">
          <Bot className="avatar-icon" size={28} />
          <Sparkles className="sparkle-icon" size={14} />
        </div>
        <div className="circle-label">
          <span className="title">Villon AI</span>
          <span className="subtitle">Village Intelligence</span>
        </div>
      </button>
    </div>
  );
};

export default QuickOverlays;
