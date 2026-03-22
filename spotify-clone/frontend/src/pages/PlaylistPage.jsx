import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistService } from '../services/playlists';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import TrackRow from '../components/Common/TrackRow';

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
  </svg>
);

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadPlaylist = () => {
    playlistService.getPlaylist(id)
      .then((data) => {
        setPlaylist(data);
        setEditForm({ name: data.name, description: data.description });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPlaylist(); }, [id]);

  if (loading) return <div className="spinner" />;
  if (!playlist) return <p style={{ color: 'var(--color-text-secondary)' }}>Playlist not found.</p>;

  const isOwner = user?.id === playlist.owner;
  const tracks = playlist.tracks ?? [];
  const isPlaylistPlaying = tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (isPlaylistPlaying) togglePlay();
    else if (tracks.length) playTrack(tracks[0], tracks);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await playlistService.updatePlaylist(id, editForm);
      setPlaylist(updated);
      setEditing(false);
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${playlist.name}"?`)) return;
    await playlistService.deletePlaylist(id);
    navigate('/library');
  };

  const handleRemoveTrack = async (trackId) => {
    const updated = await playlistService.removeTrack(id, trackId);
    setPlaylist(updated);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '32px', background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)', padding: '24px', borderRadius: '8px' }}>
        <div style={{ width: '200px', height: '200px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
          {playlist.cover_url
            ? <img src={playlist.cover_url} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '🎵'
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Playlist</div>

          {editing ? (
            <div>
              <input
                className="input"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', background: 'rgba(255,255,255,0.15)' }}
              />
              <textarea
                className="input"
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Add an optional description"
                style={{ background: 'rgba(255,255,255,0.15)', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '3rem', marginBottom: '8px', cursor: isOwner ? 'pointer' : 'default' }}
                onClick={() => isOwner && setEditing(true)}>
                {playlist.name}
              </h1>
              {playlist.description && <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>{playlist.description}</p>}
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {playlist.owner_name} • {tracks.length} songs
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        {tracks.length > 0 && (
          <button
            className="btn btn-primary"
            style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
            onClick={handlePlay}
          >
            {isPlaylistPlaying
              ? <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>
              : <PlayIcon />
            }
          </button>
        )}
        {isOwner && (
          <>
            <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-ghost" style={{ color: '#e5534b' }} onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      {/* Track list */}
      {tracks.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '60px' }}>
          This playlist is empty. Search for songs and add them here.
        </p>
      ) : (
        <>
          <div className="track-row" style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ textAlign: 'center' }}>#</span>
            <span>Title</span>
            <span>Album</span>
            <span style={{ textAlign: 'right' }}>⏱</span>
            <span />
          </div>
          <div className="track-list">
            {tracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i + 1}
                trackList={tracks}
                contextMenu={
                  isOwner ? (
                    <button
                      className="player-btn"
                      onClick={(e) => { e.stopPropagation(); handleRemoveTrack(track.id); }}
                      title="Remove from playlist"
                      style={{ color: '#e5534b' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  ) : null
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}