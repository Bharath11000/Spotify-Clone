import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { musicService } from '../../services/music';

function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24"
    fill={filled ? '#1db954' : 'none'}
    stroke={filled ? '#1db954' : 'currentColor'}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/**
 * TrackRow — one row in a track listing.
 * Props:
 *  track       — track object from API
 *  index       — display number (optional)
 *  trackList   — full list for queue (optional)
 *  showAlbum   — whether to show album column
 *  onLikeChange — callback(trackId, liked)
 *  contextMenu — extra action node (e.g. "Remove from playlist")
 */
export default function TrackRow({
  track,
  index,
  trackList,
  showAlbum = true,
  onLikeChange,
  contextMenu,
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [liked, setLiked] = useState(track.is_liked);
  const [hovered, setHovered] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, trackList ?? [track]);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const data = await musicService.toggleLike(track.id);
      setLiked(data.liked);
      onLikeChange?.(track.id, data.liked);
    } catch {}
  };

  return (
    <div
      className={`track-row${isCurrentTrack ? ' active' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={handlePlay}
      style={{ gridTemplateColumns: showAlbum ? '16px 4fr 2fr 1fr auto' : '16px 4fr 1fr auto' }}
    >
      {/* Number / play indicator */}
      <div className="track-row-num">
        {hovered || isCurrentTrack ? (
          <button className="track-play-btn" onClick={handlePlay}>
            {isCurrentTrack && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        ) : (
          <span style={{ color: isCurrentTrack ? 'var(--color-green)' : undefined }}>
            {index ?? ''}
          </span>
        )}
      </div>

      {/* Title + artist */}
      <div className="track-row-info">
        {track.album_cover_url && (
          <img className="track-row-cover" src={track.album_cover_url} alt={track.album_title} />
        )}
        <div style={{ minWidth: 0 }}>
          <div className="track-row-title truncate" style={{ color: isCurrentTrack ? 'var(--color-green)' : undefined }}>
            {track.title}
          </div>
          <div className="track-row-artist truncate">
            <Link to={`/artist/${track.artist}`} onClick={(e) => e.stopPropagation()}>
              {track.artist_name}
            </Link>
          </div>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="track-row-album truncate">
          {track.album ? (
            <Link to={`/album/${track.album}`} onClick={(e) => e.stopPropagation()}>
              {track.album_title}
            </Link>
          ) : '—'}
        </div>
      )}

      {/* Duration */}
      <div className="track-row-duration">{formatDuration(track.duration)}</div>

      {/* Actions */}
      <div className="track-row-actions">
        <button
          className="player-btn"
          style={{ opacity: liked || hovered ? 1 : 0 }}
          onClick={handleLike}
          title={liked ? 'Unlike' : 'Like'}
        >
          <HeartIcon filled={liked} />
        </button>
        {contextMenu}
      </div>
    </div>
  );
}