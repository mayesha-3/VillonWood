import React, { useState } from 'react';
import { Music, X, Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

interface MusicPlayerOverlayProps {
  onClose: () => void;
}

export const MusicPlayerOverlay: React.FC<MusicPlayerOverlayProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const [selectedTrack, setSelectedTrack] = useState(0);

  const tracks = [
    { title: 'Luth & Guitare du Troubadour', duration: '3:45', mood: 'Warm & Folk' },
    { title: 'Brume Matinale sur le Village', duration: '4:12', mood: 'Calm Nature' },
    { title: 'Chanson de la Taverne Sanglier', duration: '2:50', mood: 'Festive Tavern' }
  ];

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="music-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="music-header">
          <div className="music-title">
            <Music size={20} className="music-icon" />
            <span>Ménestrel & Musique du Village</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="player-body">
          <div className="now-playing-disc">
            <div className={`disc-inner ${isPlaying ? 'spinning' : ''}`}>
              <Radio size={32} />
            </div>
          </div>

          <div className="track-details">
            <h3>{tracks[selectedTrack].title}</h3>
            <span className="mood-badge">{tracks[selectedTrack].mood}</span>
          </div>

          <div className="player-controls">
            <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
          </div>

          <div className="volume-slider-row">
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="volume-range"
            />
            <span>{volume}%</span>
          </div>

          <div className="playlist-container">
            <span className="playlist-title">Chansons du barde</span>
            {tracks.map((track, index) => (
              <div
                key={track.title}
                className={`playlist-item ${selectedTrack === index ? 'active' : ''}`}
                onClick={() => { setSelectedTrack(index); setIsPlaying(true); }}
              >
                <span>{track.title}</span>
                <small>{track.duration}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerOverlay;
