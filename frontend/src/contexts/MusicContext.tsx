import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface TrackInfo {
  id: number;
  title: string;
  duration: string;
  mood: string;
  src: string;
}

export const TRACKS: TrackInfo[] = [
  { id: 0, title: 'Luth & Guitare du Troubadour', duration: '3:45', mood: 'Acoustique & Folk', src: '/music/1.mp3' },
  { id: 1, title: 'Brume Matinale sur le Village', duration: '4:12', mood: 'Calme Nature', src: '/music/2.mp3' },
  { id: 2, title: 'Chanson de la Taverne Sanglier', duration: '2:50', mood: 'Festif & Taverne', src: '/music/3.mp3' },
  { id: 3, title: 'Symphonie Rustique de Villon', duration: '3:15', mood: 'Médiéval Doux', src: '/music/4.mp3' }
];

const MUSIC_STORAGE_KEY = 'villonwood-music-state';

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  selectedTrack: number;
  currentTrack: TrackInfo;
  togglePlay: () => void;
  selectTrack: (index: number) => void;
  setVolume: (val: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const useMusic = (): MusicContextType => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};

const getSavedMusicState = () => {
  try {
    const saved = localStorage.getItem(MUSIC_STORAGE_KEY);
    if (!saved) {
      return { isPlaying: false, volume: 70, selectedTrack: 0 };
    }

    const parsed = JSON.parse(saved);
    return {
      isPlaying: Boolean(parsed.isPlaying),
      volume: typeof parsed.volume === 'number' ? parsed.volume : 70,
      selectedTrack: typeof parsed.selectedTrack === 'number' ? parsed.selectedTrack : 0,
    };
  } catch {
    return { isPlaying: false, volume: 70, selectedTrack: 0 };
  }
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = getSavedMusicState();
  const [isPlaying, setIsPlaying] = useState(initialState.isPlaying);
  const [volume, setVolumeState] = useState(initialState.volume);
  const [selectedTrack, setSelectedTrack] = useState(initialState.selectedTrack);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem(
      MUSIC_STORAGE_KEY,
      JSON.stringify({ isPlaying, volume, selectedTrack })
    );
  }, [isPlaying, volume, selectedTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.src = TRACKS[selectedTrack].src;
    audio.volume = volume / 100;
    audioRef.current = audio;

    const handleEnded = () => {
      setSelectedTrack((prev: number) => (prev + 1) % TRACKS.length);
    };

    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [selectedTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const selectTrack = (index: number) => {
    setSelectedTrack(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setSelectedTrack((prev: number) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setSelectedTrack((prev: number) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        volume,
        selectedTrack,
        currentTrack: TRACKS[selectedTrack],
        togglePlay,
        selectTrack,
        setVolume,
        nextTrack,
        prevTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
