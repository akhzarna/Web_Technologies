import React, { useState, useEffect } from 'react';
import { API_BOOKS_URL } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import Pagination from './components/Pagination';
import LoadingSkeleton from './components/LoadingSkeleton';
import './App.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch books from the live API
  useEffect(() => {
    let isMounted = true;
    
    async function loadBooks() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BOOKS_URL}?page=${currentPage}`);
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: Failed to load books`);
        }
        const data = await response.json();
        
        if (isMounted) {
          const bookList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
          setBooks(bookList);
          
          if (data.metadata) {
            setTotalPages(data.metadata.pagesCount || 1);
            setTotalDocs(data.metadata.docsCount || bookList.length);
          } else {
            setTotalDocs(bookList.length);
          }
          setIsLive(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error('API Fetch Error:', err);
          setError(err.message || 'Unable to connect to the live books API.');
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [currentPage, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter books in real time based on user search query
  const filteredBooks = books.filter((book) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const title = (book.title || '').toLowerCase();
    const author = (book.author?.name || '').toLowerCase();
    const category = (book.category?.name || '').toLowerCase();
    const desc = (book.description || '').toLowerCase();

    return (
      title.includes(query) ||
      author.includes(query) ||
      category.includes(query) ||
      desc.includes(query)
    );
  });

  return (
    <div className="app-container">
      <Header
        totalBooks={totalDocs}
        currentPage={currentPage}
        totalPages={totalPages}
        isLive={isLive}
      />

      <main className="main-content">
        <div className="api-notice-banner">
          <div className="notice-icon">🌐</div>
          <div className="notice-text">
            <strong>Live Data Source:</strong> Connected to{' '}
            <code>http://159.65.157.115/api/books</code>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh data from server"
          >
            ↻ Refresh
          </button>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          resultCount={filteredBooks.length}
          totalCount={books.length}
        />

        {error && (
          <div className="error-banner">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Could not retrieve books</h3>
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-primary btn-retry"
                onClick={handleRefresh}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton count={8} />
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <section className="books-grid" aria-label="Books collection">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book._id || book.title}
                    book={book}
                    onSelectBook={setSelectedBook}
                  />
                ))}
              </section>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No Books Found</h3>
                <p>No books match your current search "{searchQuery}".</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}

            {!searchQuery && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            )}
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <p>© 2026 KitabGhar Bookstore Front End • Powered by React &amp; Vite</p>
          <p className="footer-sub">
            Connected to Live REST API:{' '}
            <a href="http://159.65.157.115/api/books" target="_blank" rel="noreferrer">
              http://159.65.157.115/api/books
            </a>
          </p>
        </div>
      </footer>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
