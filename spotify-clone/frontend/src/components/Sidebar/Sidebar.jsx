import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playlistService } from '../../services/playlists';
import CreatePlaylistModal from '../Modals/CreatePlaylistModal';
import './Sidebar.css';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6h3v6H16V7.577l-3.5-4.33z"/>
    <path d="M20 8.28V20h2V6.044L12.5 1 2 6.044V20h2V8.28l8.5-5.25 8 4.95 8z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 10 0 5.073 4.228 10 9.407 10 2.347 0 4.518-.924 6.141-2.432l5.247 5.248a1 1 0 1 0 1.414-1.414l-5.247-5.248C19.039 15.822 20 13.661 20 11.28c0-5.073-4.228-10-9.467-10zm-7.407 10c0-4.187 3.355-8 7.407-8 4.052 0 7.467 3.813 7.467 8s-3.415 8-7.467 8c-4.052 0-7.407-3.813-7.407-8z"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1.5.866l7-4a1 1 0 0 0 0-1.732l-7-4zM7 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.593c-.425-.scalar to-.403-8.192-9.747-9.065C.388 10.563 1.553 6 4.877 6c.985 0 2.02.434 3.118 1.23L12 9.75l4.005-2.52C17.1 6.434 18.136 6 19.12 6c3.324 0 4.49 4.564 1.824 6.528C13.403 15.813 12.43 21.19 12 21.593z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2z"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPlaylists = async () => {
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data.results ?? data);
    } catch {}
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePlaylistCreated = (playlist) => {
    setPlaylists((prev) => [playlist, ...prev]);
    setShowCreateModal(false);
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        {/* Logo */}
        <div className="sidebar-logo">
          <svg viewBox="0 0 168 168" width="40" height="40" fill="white">
            <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741C167.74 37.77 130.25.277 83.996.277zm38.404 120.78a5.217 5.217 0 0 1-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 0 1-6.249-3.93 5.213 5.213 0 0 1 3.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 0 1 4.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 0 1 5.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 0 1 2.74 10.733c-2.2 3.722-7.02 4.949-10.734 2.739z"/>
          </svg>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '16px', marginLeft: '10px', letterSpacing: '0.5px' }}>
            Spotify
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <HomeIcon /> Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <SearchIcon /> Search
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LibraryIcon /> Your Library
          </NavLink>
        </nav>

        <div className="sidebar-divider" />

        {/* Quick actions */}
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" onClick={() => setShowCreateModal(true)}>
            <span className="sidebar-action-icon"><PlusIcon /></span>
            Create Playlist
          </button>
          <NavLink to="/liked" className={({ isActive }) => `sidebar-action-btn ${isActive ? 'active' : ''}`}>
            <span className="sidebar-action-icon heart"><HeartIcon /></span>
            Liked Songs
          </NavLink>
        </div>

        <div className="sidebar-divider" />

        {/* Playlist list */}
        <div className="sidebar-playlists">
          {playlists.map((pl) => (
            <NavLink
              key={pl.id}
              to={`/playlist/${pl.id}`}
              className={({ isActive }) => `sidebar-playlist-item ${isActive ? 'active' : ''}`}
            >
              {pl.name}
            </NavLink>
          ))}
        </div>

        {/* User area */}
        <div className="sidebar-user">
          <NavLink to="/profile" className="sidebar-user-info">
            <div className="sidebar-avatar">
              {user?.avatar_url
                ? <img src={user.avatar_url} alt={user.username} />
                : <span>{user?.username?.[0]?.toUpperCase()}</span>
              }
            </div>
            <span className="truncate">{user?.username}</span>
          </NavLink>
          <button className="sidebar-logout" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </aside>

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handlePlaylistCreated}
        />
      )}
    </>
  );
}
