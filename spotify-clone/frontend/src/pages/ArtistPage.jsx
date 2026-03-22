import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../services/music';

export default function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    musicService.getArtist(id)
      .then(setArtist)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!artist) return <p style={{ color: 'var(--color-text-secondary)' }}>Artist not found.</p>;

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '24px', marginBottom: '32px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '8px', minHeight: '240px' }}>
        <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#333', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
          {artist.image_url
            ? <img src={artist.image_url} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🎤</div>
          }
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Artist</div>
          <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>{artist.name}</h1>
          {artist.bio && <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', fontSize: '14px' }}>{artist.bio}</p>}
        </div>
      </div>

      {/* Albums */}
      {artist.albums?.length > 0 && (
        <section>
          <h2 style={{ marginBottom: '20px' }}>Albums</h2>
          <div className="grid-cards">
            {artist.albums.map((album) => (
              <Link key={album.id} to={`/album/${album.id}`} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#333', marginBottom: '12px' }}>
                  {album.cover_url
                    ? <img src={album.cover_url} alt={album.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎵</div>
                  }
                </div>
                <div className="truncate" style={{ fontWeight: 700 }}>{album.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {album.release_year} • {album.track_count} songs
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}