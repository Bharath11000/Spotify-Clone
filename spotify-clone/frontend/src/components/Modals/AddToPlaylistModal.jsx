import React, { useState, useEffect } from 'react';
import { playlistService } from '../../services/playlists';
import './Modal.css';

export default function AddToPlaylistModal({ track, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    playlistService.getPlaylists()
      .then((data) => setPlaylists(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (playlistId) => {
    try {
      await playlistService.addTrack(playlistId, track.id);
      setMessage('Added to playlist!');
      setTimeout(onClose, 1000);
    } catch (err) {
      const detail = err.response?.data?.detail ?? 'Failed to add track.';
      setMessage(detail);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to playlist</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px', fontSize: '13px' }}>
          Adding: <strong style={{ color: 'white' }}>{track.title}</strong>
        </p>

        {message && <p className="form-error" style={{ color: 'var(--color-green)', marginBottom: '12px' }}>{message}</p>}

        {loading ? (
          <div className="spinner" />
        ) : playlists.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No playlists found. Create one first.</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {playlists.map((pl) => (
              <button
                key={pl.id}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
                onClick={() => handleAdd(pl.id)}
              >
                {pl.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}