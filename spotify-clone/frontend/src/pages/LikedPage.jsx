import React, { useEffect, useState } from 'react';
import { musicService } from '../services/music';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/Common/TrackRow';

export default function LikedPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    musicService.getLikedTracks()
      .then((data) => setTracks(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  const isCurrentlyPlaying = tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (isCurrentlyPlaying) togglePlay();
    else if (tracks.length) playTrack(tracks[0], tracks);
  };

  const handleLikeChange = (trackId, liked) => {
    if (!liked) {
      // Remove from liked list when unliked
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '32px', background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)', padding: '24px', borderRadius: '8px' }}>
        <div style={{ width: '200px', height: '200px', borderRadius: '4px', background: 'linear-gradient(135deg, #450af5, #c4efd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', flexShrink: 0 }}>
          ❤️
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Playlist</div>
          <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>Liked Songs</h1>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {tracks.length} songs
          </div>
        </div>
      </div>

      {tracks.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <button
            className="btn btn-primary"
            style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
            onClick={handlePlay}
          >
            {isCurrentlyPlaying
              ? <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
              : <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
            }
          </button>
        </div>
      )}

      {tracks.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontSize: '24px', marginBottom: '12px' }}>Songs you like will appear here</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>Save songs by tapping the heart icon.</p>
        </div>
      ) : (
        <div className="track-list">
          {tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i + 1}
              trackList={tracks}
              onLikeChange={handleLikeChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}