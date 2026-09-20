import React, { useState } from 'react';
import { Camera, X, Download, Sparkles, Check } from 'lucide-react';

interface CameraOverlayProps {
  onClose: () => void;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<'vintage' | 'warm' | 'noir' | 'normal'>('vintage');
  const [isCaptured, setIsCaptured] = useState(false);

  const handleCapture = () => {
    setIsCaptured(true);
    setTimeout(() => setIsCaptured(false), 2500);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="camera-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="camera-header">
          <div className="camera-title">
            <Camera size={20} className="camera-icon" />
            <span>Mode Photo VillonWood</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Stage */}
        <div className={`camera-viewfinder filter-${filter}`}>
          <div className="viewfinder-frame">
            <div className="viewfinder-corner top-left" />
            <div className="viewfinder-corner top-right" />
            <div className="viewfinder-corner bottom-left" />
            <div className="viewfinder-corner bottom-right" />
            <div className="viewfinder-watermark">VILLONWOOD • 1789</div>
          </div>
          {isCaptured && (
            <div className="capture-flash">
              <Check size={36} />
              <span>Photo capturée !</span>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="camera-controls">
          <div className="filter-options">
            <button className={`filter-btn ${filter === 'vintage' ? 'active' : ''}`} onClick={() => setFilter('vintage')}>Parchemin</button>
            <button className={`filter-btn ${filter === 'warm' ? 'active' : ''}`} onClick={() => setFilter('warm')}>Automne</button>
            <button className={`filter-btn ${filter === 'noir' ? 'active' : ''}`} onClick={() => setFilter('noir')}>Encre Noir</button>
            <button className={`filter-btn ${filter === 'normal' ? 'active' : ''}`} onClick={() => setFilter('normal')}>Normal</button>
          </div>

          <button className="shutter-btn" onClick={handleCapture}>
            <div className="shutter-inner">
              <Sparkles size={20} />
            </div>
          </button>

          <button className="download-btn" onClick={handleCapture}>
            <Download size={16} />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;
