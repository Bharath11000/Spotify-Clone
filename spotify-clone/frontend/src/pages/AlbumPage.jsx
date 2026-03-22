import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../services/music';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/Common/TrackRow';
import AddToPlaylistModal from '../components/Modals/AddToPlaylistModal';

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
  </svg>
);

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState(null);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    musicService.getAlbum(id)
      .then(setAlbum)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!album) return <p style={{ color: 'var(--color-text-secondary)' }}>Album not found.</p>;

  const isAlbumPlaying = album.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      togglePlay();
    } else if (album.tracks.length) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  const totalDuration = album.tracks.reduce((s, t) => s + t.duration, 0);
  const mins = Math.floor(totalDuration / 60);

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '32px', background: 'linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), linear-gradient(135deg, #1a1a2e, #16213e)', padding: '24px', borderRadius: '8px' }}>
        <div style={{ width: '200px', height: '200px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.7)', background: '#333' }}>
          {album.cover_url
            ? <img src={album.cover_url} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🎵</div>
          }
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Album</div>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', lineHeight: 1.1 }}>{album.title}</h1>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            <Link to={`/artist/${album.artist}`} style={{ color: 'white', fontWeight: 700 }}>{album.artist_name}</Link>
            {' • '}{album.release_year}{' • '}
            {album.tracks.length} songs, about {mins} min
          </div>
        </div>
      </div>

      {/* Play button */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          className="btn btn-primary"
          style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
          onClick={handlePlayAlbum}
        >
          {isAlbumPlaying
            ? <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
            : <PlayIcon />
          }
        </button>
      </div>

      {/* Track listing header */}
      <div className="track-row" style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', gridTemplateColumns: '16px 4fr 1fr auto' }}>
        <span style={{ textAlign: 'center' }}>#</span>
        <span>Title</span>
        <span style={{ textAlign: 'right' }}>⏱</span>
        <span />
      </div>

      <div className="track-list">
        {album.tracks.map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            index={i + 1}
            trackList={album.tracks}
            showAlbum={false}
            contextMenu={
              <button
                className="player-btn"
                onClick={(e) => { e.stopPropagation(); setAddToPlaylistTrack(track); }}
                title="Add to playlist"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2z"/>
                </svg>
              </button>
            }
          />
        ))}
      </div>

      {addToPlaylistTrack && (
        <AddToPlaylistModal
          track={addToPlaylistTrack}
          onClose={() => setAddToPlaylistTrack(null)}
        />
      )}
    </div>
  );
}