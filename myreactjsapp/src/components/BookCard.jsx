import React, { useState } from 'react';
import { getAssetUrl } from '../constants';

export default function BookCard({ book, onSelectBook }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const coverUrl = getAssetUrl(book.coverPhotoUri);
  const pdfUrl = getAssetUrl(book.fileUri);
  const authorName = book.author?.name || 'Unknown Author';
  const categoryName = book.category?.name || 'General';

  return (
    <article className="book-card">
      <div className="card-media-wrapper" onClick={() => onSelectBook(book)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelectBook(book)}>
        {!imageLoaded && !imageError && (
          <div className="image-skeleton-shimmer"></div>
        )}
        <img
          src={imageError || !coverUrl ? '/book-placeholder.svg' : coverUrl}
          alt={book.title || 'Book cover'}
          className={`book-cover-img ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        <div className="card-overlay">
          <button
            type="button"
            className="overlay-preview-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBook(book);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="card-content">
        <div className="card-badges">
          <span className="badge category-badge">{categoryName}</span>
          {book.bookType && <span className="badge type-badge">{book.bookType}</span>}
        </div>

        <h3 className="book-title" dir="auto" title={book.title}>
          {book.title || 'Untitled Book'}
        </h3>

        <p className="book-author" dir="auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{authorName}</span>
        </p>

        <div className="card-actions">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              title="Read or download PDF"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <span>Read PDF</span>
            </a>
          ) : (
            <button disabled className="btn btn-disabled">
              No PDF
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onSelectBook(book)}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
