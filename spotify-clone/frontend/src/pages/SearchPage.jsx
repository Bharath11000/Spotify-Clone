import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { musicService } from '../services/music';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/Common/TrackRow';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { playTrack } = usePlayer();

  const doSearch = useCallback(
    debounce(async (q) => {
      if (!q.trim()) { setResults(null); return; }
      setLoading(true);
      try {
        const data = await musicService.search(q);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    doSearch(e.target.value);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Search</h1>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 10 0 5.073 4.228 10 9.407 10 2.347 0 4.518-.924 6.141-2.432l5.247 5.248a1 1 0 1 0 1.414-1.414l-5.247-5.248C19.039 15.822 20 13.661 20 11.28c0-5.073-4.228-10-9.467-10zm-7.407 10c0-4.187 3.355-8 7.407-8 4.052 0 7.467 3.813 7.467 8s-3.415 8-7.467 8c-4.052 0-7.407-3.813-7.407-8z"/>
        </svg>
        <input
          className="input"
          style={{ paddingLeft: '44px', borderRadius: '9999px', fontSize: '16px', padding: '14px 14px 14px 44px' }}
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={handleChange}
          autoFocus
        />
      </div>

      {loading && <div className="spinner" />}

      {results && !loading && (
        <div>
          {/* Tracks */}
          {results.tracks.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '16px' }}>Songs</h2>
              <div className="track-list">
                {results.tracks.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i + 1}
                    trackList={results.tracks}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '16px' }}>Artists</h2>
              <div className="grid-cards">
                {results.artists.map((artist) => (
                  <Link key={artist.id} to={`/artist/${artist.id}`} className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '50%', overflow: 'hidden', background: '#333', marginBottom: '12px' }}>
                      {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎤</div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700 }}>{artist.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Artist</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <section>
              <h2 style={{ marginBottom: '16px' }}>Albums</h2>
              <div className="grid-cards">
                {results.albums.map((album) => (
                  <Link key={album.id} to={`/album/${album.id}`} className="card" style={{ textDecoration: 'none' }}>
                    <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#333', marginBottom: '12px' }}>
                      {album.cover_url ? (
                        <img src={album.cover_url} alt={album.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎵</div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700 }} className="truncate">{album.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{album.artist_name}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.tracks.length === 0 && results.artists.length === 0 && results.albums.length === 0 && (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '60px' }}>
              No results found for "{query}"
            </p>
          )}
        </div>
      )}

      {!results && !loading && (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '60px' }}>
          Start typing to search for songs, artists, and albums.
        </p>
      )}
    </div>
  );
}