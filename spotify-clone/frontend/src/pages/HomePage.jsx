import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { musicService } from '../services/music';
import { usePlayer } from '../context/PlayerContext';

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
  </svg>
);

function TrackRow({ track, index, allTracks }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={() => playTrack(track, allTracks)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 1fr 60px',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: isActive ? 'var(--color-green)' : 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}
    >
      <div style={{ color: isActive ? 'var(--color-green)' : 'var(--color-text-secondary)', fontSize: '14px' }}>
        {isActive && isPlaying ? '▶' : index + 1}
      </div>
      <div>
        <div style={{ fontWeight: 500, fontSize: '14px' }}>{track.title}</div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          {track.artist_name ?? track.artist?.name}
        </div>
      </div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        {track.album_title ?? track.album?.title ?? '—'}
      </div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', textAlign: 'right' }}>
        {formatDuration(track.duration)}
      </div>
    </div>
  );
}

function AlbumCard({ album }) {
  const { playTrack } = usePlayer();
  const [hovered, setHovered] = useState(false);

  const handlePlay = async (e) => {
    e.preventDefault();
    try {
      const full = await musicService.getAlbum(album.id);
      if (full.tracks?.length) playTrack(full.tracks[0], full.tracks);
    } catch {}
  };

  return (
    <Link to={`/album/${album.id}`} className="card" style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#333' }}>
          {album.cover_url ? (
            <img src={album.cover_url} alt={album.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎵</div>
          )}
        </div>
        {hovered && (
          <button onClick={handlePlay} style={{
            position: 'absolute', bottom: '8px', right: '8px',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'var(--color-green)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            border: 'none', cursor: 'pointer',
          }}>
            <PlayIcon />
          </button>
        )}
      </div>
      <div className="truncate" style={{ fontWeight: 700, fontSize: '14px' }}>{album.title}</div>
      <div className="truncate" style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
        {album.artist_name} • {album.release_year}
      </div>
    </Link>
  );
}

function ArtistCard({ artist }) {
  return (
    <Link to={`/artist/${artist.id}`} className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
      <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '50%', overflow: 'hidden', background: '#333', marginBottom: '12px' }}>
        {artist.image_url ? (
          <img src={artist.image_url} alt={artist.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎤</div>
        )}
      </div>
      <div className="truncate" style={{ fontWeight: 700, fontSize: '14px' }}>{artist.name}</div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>Artist</div>
    </Link>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTracks, setShowAllTracks] = useState(false);

  useEffect(() => {
    Promise.all([
      musicService.getAlbums(),
      musicService.getArtists(),
      musicService.getTracks(),
    ])
      .then(([albumData, artistData, trackData]) => {
        setAlbums(albumData.results ?? albumData);
        setArtists(artistData.results ?? artistData);
        setTracks(trackData.results ?? trackData);
      })
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <div className="spinner" />;

  const visibleTracks = showAllTracks ? tracks : tracks.slice(0, 10);

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>
        {greeting()}{user ? `, ${user.username}` : ''}
      </h1>

      {/* Albums */}
      <section style={{ marginBottom: '48px' }}>
        <div className="section-header">
          <h2>Albums</h2>
          <Link to="/library">Show all</Link>
        </div>
        <div className="grid-cards">
          {albums.slice(0, 6).map((a) => <AlbumCard key={a.id} album={a} />)}
        </div>
      </section>

      {/* Artists */}
      <section style={{ marginBottom: '48px' }}>
        <div className="section-header">
          <h2>Artists</h2>
        </div>
        <div className="grid-cards">
          {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
        </div>
      </section>

      {/* Tracks */}
      <section style={{ marginBottom: '48px' }}>
        <div className="section-header">
          <h2>Tracks</h2>
          {tracks.length > 10 && (
            <button
              onClick={() => setShowAllTracks(s => !s)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              {showAllTracks ? 'Show Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 1fr 60px',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--color-text-secondary)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px',
        }}>
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div style={{ textAlign: 'right' }}>Duration</div>
        </div>

        {tracks.length === 0 && (
          <div style={{ color: 'var(--color-text-secondary)', padding: '16px', textAlign: 'center' }}>
            No tracks found.
          </div>
        )}

        {visibleTracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} allTracks={tracks} />
        ))}

        {tracks.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => setShowAllTracks(s => !s)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 32px',
                borderRadius: '4px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              {/* {showAllTracks ? 'Show Less' : `See More (${tracks.length - 10} more)`} */}
              {showAllTracks ? 'Show Less' : 'See More'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}