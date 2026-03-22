import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { musicService } from '../services/music';

export default function LibraryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    musicService.getAlbums()
      .then((data) => setAlbums(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Your Library</h1>
      <div className="grid-cards">
        {albums.map((album) => (
          <Link key={album.id} to={`/album/${album.id}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#333', marginBottom: '12px' }}>
              {album.cover_url
                ? <img src={album.cover_url} alt={album.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎵</div>
              }
            </div>
            <div className="truncate" style={{ fontWeight: 700 }}>{album.title}</div>
            <div className="truncate" style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Album • {album.artist_name}
            </div>
          </Link>
        ))}
      </div>
      {albums.length === 0 && (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '60px' }}>
          No albums yet. Run <code>python manage.py seed_data</code> to populate sample data.
        </p>
      )}
    </div>
  );
}