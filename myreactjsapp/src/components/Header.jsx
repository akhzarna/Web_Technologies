import React from 'react';

export default function Header({ totalBooks, currentPage, totalPages, isLive }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">KitabGhar Books</h1>
            <p className="brand-tagline">Online Book Explorer &amp; Reader</p>
          </div>
        </div>

        <div className="header-badges">
          <div className={`status-badge ${isLive ? 'live' : 'offline'}`}>
            <span className="status-dot"></span>
            <span>{isLive ? 'Connected to Live API' : 'Connecting...'}</span>
          </div>
          {totalBooks > 0 && (
            <div className="stat-pill">
              <span className="stat-count">{totalBooks}</span> Books Available
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
