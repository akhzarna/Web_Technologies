const booksContainer = document.querySelector('#books');
const filtersContainer = document.querySelector('#category-filters');
const statusText = document.querySelector('#status');
const requestLink = document.querySelector('#request-url');
const jsonResponse = document.querySelector('#json-response');
let latestRequest = 0;

// fetch() asks our server for data. response.json() parses the JSON response.
async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

function showBook(book) {
  const card = document.createElement('article');
  card.className = 'book-card';

  const cover = document.createElement('div');
  cover.className = 'book-cover';
  cover.style.backgroundColor = book.color;
  cover.setAttribute('aria-hidden', 'true');
  const symbol = document.createElement('span');
  symbol.className = 'cover-symbol';
  symbol.textContent = book.symbol;
  const coverTitle = document.createElement('strong');
  coverTitle.textContent = book.title;
  cover.append(symbol, coverTitle);

  const category = document.createElement('p');
  category.className = 'book-category';
  category.textContent = book.category;
  const title = document.createElement('h3');
  title.textContent = book.title;
  const author = document.createElement('p');
  author.className = 'book-author';
  author.textContent = `by ${book.author}`;
  const price = document.createElement('p');
  price.className = 'book-price';
  price.textContent = `Rs. ${book.price.toLocaleString('en-PK')}`;

  // textContent displays API values as text instead of interpreting HTML.
  card.append(cover, category, title, author, price);
  booksContainer.append(card);
}

async function loadBooks(category = '') {
  // A query parameter tells the SERVER which category we want.
  const url = category
    ? `/api/books?category=${encodeURIComponent(category)}`
    : '/api/books';
  const requestNumber = ++latestRequest;
  requestLink.textContent = `GET ${url}`;
  requestLink.href = url;
  statusText.textContent = 'Loading books from the server…';
  jsonResponse.textContent = 'Waiting for the server…';
  booksContainer.replaceChildren();

  try {
    const books = await getJSON(url);
    // Ignore an older response if a student quickly selects another category.
    if (requestNumber !== latestRequest) return;
    books.forEach(showBook);
    statusText.textContent = books.length
      ? `${books.length} books · ${category || 'All categories'}`
      : 'No books found in this category.';
    jsonResponse.textContent = JSON.stringify(books, null, 2);
  } catch (error) {
    if (requestNumber !== latestRequest) return;
    statusText.textContent = 'Could not load books. Check that the server is running, then select a category to retry.';
    jsonResponse.textContent = error.message;
  }
}

async function loadCategories() {
  try {
    const categories = await getJSON('/api/categories');
    ['', ...categories].forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category || 'All books';
      button.setAttribute('aria-pressed', String(category === ''));
      button.addEventListener('click', () => {
        filtersContainer.querySelectorAll('button').forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        loadBooks(category);
      });
      filtersContainer.append(button);
    });
  } catch (error) {
    filtersContainer.textContent = 'Categories could not load. Refresh the page to retry.';
  }
}

loadCategories();
loadBooks();
