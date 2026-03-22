import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import './PlayerBar.css';

/* ── Icon components ────────────────────────────────────────────────────── */
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
  </svg>
);

const SkipNextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/>
  </svg>
);

const SkipPrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.842A.7.7 0 0 1 15 1.712v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/>
  </svg>
);

const ShuffleIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? '#1db954' : 'currentColor'}>
    <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.08a3.75 3.75 0 0 0-2.651 1.1l-5.48 5.48a2.25 2.25 0 0 1-1.591.659H1a.75.75 0 0 0 0 1.5h.357a3.75 3.75 0 0 0 2.652-1.1l5.48-5.48a2.25 2.25 0 0 1 1.59-.659h2.03l-1.018 1.018a.75.75 0 0 0 1.06 1.06L15 5.5l-1.849-4.578zM1 4.75a.75.75 0 0 0 0 1.5h.356a2.25 2.25 0 0 1 1.129.304l.539-.585A3.757 3.757 0 0 0 1.357 5.5H1zm11.784 6.05a2.25 2.25 0 0 1-1.59.659H9.163l-1.5 1.5H11.194a3.75 3.75 0 0 0 2.651-1.1L15 10.5l-1.849-4.578a.75.75 0 1 0-1.06 1.06l1.018 1.018-.324.324-.001.001z"/>
  </svg>
);

const RepeatIcon = ({ mode }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={mode !== 'none' ? '#1db954' : 'currentColor'}>
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"/>
  </svg>
);

const VolumeIcon = ({ muted, volume }) => {
  if (muted || volume === 0) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
      <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-3.5 3.514H3.75A1.75 1.75 0 0 0 2 6.115v3.77a1.75 1.75 0 0 0 1.75 1.75h1.741l3.5 3.514a.75.75 0 0 0 1.125-.99l-3.781-3.79H3.75a.25.25 0 0 1-.25-.25v-3.77a.25.25 0 0 1 .25-.25h2.585l3.781-3.79z"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
    </svg>
  );
};

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#1db954' : 'none'} stroke={filled ? '#1db954' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ── Helpers ────────────────────────────────────────────────────────────── */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration,
    volume, isMuted, isShuffled, repeatMode,
    togglePlay, seek, setVolume, toggleMute,
    skipNext, skipPrev, toggleShuffle, cycleRepeat,
  } = usePlayer();

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    seek(fraction * duration);
  }, [seek, duration]);

  const handleVolume = useCallback((e) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player">
      {/* Left: track info */}
      <div className="player-track">
        {currentTrack ? (
          <>
            <div className="player-cover">
              {currentTrack.album_cover_url
                ? <img src={currentTrack.album_cover_url} alt={currentTrack.title} />
                : <div className="cover-placeholder" style={{ width: '56px', height: '56px', fontSize: '20px' }}>♪</div>
              }
            </div>
            <div className="player-track-meta">
              <Link to={`/album/${currentTrack.album}`} className="player-track-title truncate">
                {currentTrack.title}
              </Link>
              <Link to={`/artist/${currentTrack.artist}`} className="player-track-artist truncate">
                {currentTrack.artist_name}
              </Link>
            </div>
          </>
        ) : (
          <div className="player-track-meta">
            <span className="player-track-artist">No track selected</span>
          </div>
        )}
      </div>

      {/* Center: controls + seek bar */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`player-btn ${isShuffled ? 'active' : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <ShuffleIcon active={isShuffled} />
          </button>
          <button className="player-btn" onClick={skipPrev} title="Previous">
            <SkipPrevIcon />
          </button>
          <button className="player-btn player-btn--play" onClick={togglePlay} disabled={!currentTrack}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="player-btn" onClick={skipNext} title="Next">
            <SkipNextIcon />
          </button>
          <button
            className={`player-btn ${repeatMode !== 'none' ? 'active' : ''}`}
            onClick={cycleRepeat}
            title={`Repeat: ${repeatMode}`}
          >
            <RepeatIcon mode={repeatMode} />
          </button>
        </div>

        <div className="player-seek">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div className="seek-bar" onClick={handleSeek} role="progressbar">
            <div className="seek-bar-fill" style={{ width: `${progress}%` }} />
            <div className="seek-bar-thumb" style={{ left: `${progress}%` }} />
          </div>
          <span className="player-time">{formatTime(duration || currentTrack?.duration)}</span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="player-right">
        <button className="player-btn" onClick={toggleMute}>
          <VolumeIcon muted={isMuted} volume={volume} />
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}
