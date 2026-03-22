import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import PlayerBar from './Player/PlayerBar';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <div className="player-bar">
        <PlayerBar />
      </div>
    </div>
  );
}