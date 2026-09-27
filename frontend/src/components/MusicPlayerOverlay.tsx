import React from 'react';
import { Music, X, Play, Pause, Volume2, VolumeX, Disc, SkipForward, SkipBack } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRACKS, useMusic } from '../contexts/MusicContext';

interface MusicPlayerOverlayProps {
  onClose: () => void;
}

export const MusicPlayerOverlay: React.FC<MusicPlayerOverlayProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const {
    isPlaying,
    volume,
    selectedTrack,
    currentTrack,
    togglePlay,
    selectTrack,
    setVolume,
    nextTrack,
    prevTrack,
  } = useMusic();

  const handleSelectTrack = (index: number) => {
    selectTrack(index);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="music-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="music-header">
          <div className="music-title">
            <Music size={18} className="music-icon" />
            <span>{t('musicTitle')}</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="player-body">
          <div className="now-playing-disc">
            <div className={`disc-inner ${isPlaying ? 'spinning' : ''}`}>
              <Disc size={36} />
            </div>
          </div>

          <div className="track-details">
            <h3>{currentTrack.title}</h3>
            <span className="mood-badge">{currentTrack.mood}</span>
          </div>

          <div className="player-controls">
            <button type="button" className="track-nav-btn" onClick={prevTrack}>
              <SkipBack size={18} />
            </button>
            <button type="button" className="play-pause-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button type="button" className="track-nav-btn" onClick={nextTrack}>
              <SkipForward size={18} />
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
            <span className="playlist-title">{t('musicPlaylist')}</span>
            {TRACKS.map((track, index) => (
              <div
                key={track.id}
                className={`playlist-item ${selectedTrack === index ? 'active' : ''}`}
                onClick={() => handleSelectTrack(index)}
              >
                <span>{index + 1}. {track.title}</span>
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
