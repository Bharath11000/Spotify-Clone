import React, {
  createContext, useContext, useRef,
  useState, useEffect, useCallback,
} from 'react';
import { musicService } from '../services/music';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');

  const currentTrack = queue[currentIndex] ?? null;

  // Keep refs in sync so event listeners always have latest values
  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  const repeatModeRef = useRef(repeatMode);
  const isShuffledRef = useRef(isShuffled);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);

  // ── Wire up audio events ONCE ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      const q = queueRef.current;
      const idx = currentIndexRef.current;
      const repeat = repeatModeRef.current;
      const shuffled = isShuffledRef.current;

      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      let nextIndex;
      if (shuffled) {
        nextIndex = Math.floor(Math.random() * q.length);
      } else if (idx < q.length - 1) {
        nextIndex = idx + 1;
      } else if (repeat === 'all') {
        nextIndex = 0;
      } else {
        // End of queue, stop playing
        setIsPlaying(false);
        return;
      }

      setCurrentIndex(nextIndex);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []); // Empty deps — runs once, uses refs for latest values

  // ── Load & play track when currentIndex or queue changes ──────────────────
  useEffect(() => {
    const track = queueRef.current[currentIndex];
    if (!track) return;
    const audio = audioRef.current;

    audio.src = track.audio_url;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.load();
    audio.play().catch(() => {});

    musicService.incrementPlay(track.id).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, queue]);

  // ── Controls ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const seek = useCallback((seconds) => {
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolumeState(v);
    if (v > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !audioRef.current.muted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, []);

  const skipNext = useCallback(() => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    const repeat = repeatModeRef.current;
    const shuffled = isShuffledRef.current;

    if (!q.length) return;

    let nextIndex;
    if (shuffled) {
      nextIndex = Math.floor(Math.random() * q.length);
    } else if (idx < q.length - 1) {
      nextIndex = idx + 1;
    } else if (repeat === 'all') {
      nextIndex = 0;
    } else {
      return;
    }
    setCurrentIndex(nextIndex);
  }, []);

  const skipPrev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
  }, []);

  const playTrack = useCallback((track, trackList = null) => {
    const audio = audioRef.current;

    if (trackList && trackList.length > 0) {
      const idx = trackList.findIndex((t) => t.id === track.id);
      setQueue(trackList);
      setCurrentIndex(idx >= 0 ? idx : 0);
      // useEffect will handle loading & playing
    } else {
      setQueue([track]);
      setCurrentIndex(0);
    }

    // Also set src immediately so it starts fast
    audio.src = track.audio_url;
    audio.load();
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const toggleShuffle = useCallback(() => setIsShuffled((s) => !s), []);
  const cycleRepeat = useCallback(() => {
    setRepeatMode((m) => ({ none: 'all', all: 'one', one: 'none' }[m]));
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, currentIndex, isPlaying,
      currentTime, duration, volume, isMuted, isShuffled, repeatMode,
      togglePlay, seek, setVolume, toggleMute,
      skipNext, skipPrev, playTrack,
      toggleShuffle, cycleRepeat,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
