import React, { useEffect } from 'react';
import { getAssetUrl } from '../constants';

export default function BookModal({ book, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const coverUrl = getAssetUrl(book.coverPhotoUri);
  const pdfUrl = getAssetUrl(book.fileUri);
  const authorName = book.author?.name || 'Unknown Author';
  const categoryName = book.category?.name || 'General';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>

        <div className="modal-body">
          <div className="modal-cover-column">
            <img
              src={coverUrl || '/book-placeholder.svg'}
              alt={book.title || 'Book cover'}
              className="modal-cover-img"
              onError={(e) => {
                e.currentTarget.src = '/book-placeholder.svg';
              }}
            />
          </div>

          <div className="modal-info-column">
            <div className="modal-badges">
              <span className="badge category-badge">{categoryName}</span>
              {book.bookType && <span className="badge type-badge">{book.bookType}</span>}
              {book.isPublished !== undefined && (
                <span className={`badge ${book.isPublished ? 'status-badge-pub' : 'status-badge-unpub'}`}>
                  {book.isPublished ? 'Published' : 'Draft'}
                </span>
              )}
            </div>

            <h2 className="modal-title" dir="auto">{book.title || 'Untitled Book'}</h2>
            
            <p className="modal-author" dir="auto">
              <strong>Author:</strong> {authorName}
            </p>

            {book.description ? (
              <div className="modal-desc" dir="auto">
                <h4>Description:</h4>
                <p>{book.description}</p>
              </div>
            ) : (
              <p className="modal-no-desc">No detailed description provided for this book.</p>
            )}

            <div className="modal-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Format</span>
                <span className="meta-value">{book.bookType || 'PDF'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Language</span>
                <span className="meta-value">{book.isArabic ? 'Arabic' : 'Urdu / English'}</span>
              </div>
              {book.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Added On</span>
                  <span className="meta-value">{new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {book.chapters && book.chapters.length > 0 && (
                <div className="meta-item">
                  <span className="meta-label">Chapters</span>
                  <span className="meta-value">{book.chapters.length}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-large"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  <span>Open Full PDF Document</span>
                </a>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-large"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
