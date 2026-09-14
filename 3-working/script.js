// The API returns { data: [...books], metadata: { pagesCount, docsCount } }.

const API_URL = 'http://159.65.157.115/api/books';
const ASSET_URL = 'http://159.65.157.115/';

const searchInput = document.querySelector('#book-search');
const filtersContainer = document.querySelector('#category-filters');
const sectionsContainer = document.querySelector('#book-sections');
const searchStatus = document.querySelector('#search-status');
const loadStatus = document.querySelector('#load-status');
const retryButton = document.querySelector('#retry-books');
let books = [];
let selectedCategory = '';

// API text is inserted as text, never interpreted as HTML.
function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function assetURL(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, ASSET_URL);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function showBook(book) {
  const card = makeElement('article', undefined, 'book-card');
  const image = makeElement('img', undefined, 'book-thumbnail');
  image.alt = `${book.title} — cover`;
  image.width = 240;
  image.height = 320;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.src = 'images/book-placeholder.svg';
  }, { once: true });
  image.src = assetURL(book.coverPhotoUri) || 'images/book-placeholder.svg';

  const title = makeElement('h4', book.title);
  title.dir = 'auto';
  const author = makeElement('p', book.authorName, 'book-author');
  author.dir = 'auto';
  const description = makeElement('p', book.description || '');
  description.dir = 'auto';
  const price = makeElement('p', book.price === null
    ? 'Price unavailable'
    : `Rs. ${book.price.toLocaleString('en-PK')}`, 'price');
  const button = makeElement('button', 'Add to cart', 'add-to-cart');
  button.type = 'button';
  button.disabled = book.price === null;
  button.addEventListener('click', () => addToCart(book));
  card.append(image, title, author, description, price, button);
  return card;
}

// Search the loaded collection and group the matching books into sections.
function filterBooks() {
  const term = searchInput.value.trim().toLowerCase();
  const matches = books.filter(book => {
    const matchesCategory = !selectedCategory || book.categoryName === selectedCategory;
    const text = `${book.title} ${book.authorName} ${book.description} ${book.categoryName}`;
    return matchesCategory && text.toLowerCase().includes(term);
  });
  sectionsContainer.replaceChildren();
  const categories = [...new Set(matches.map(book => book.categoryName))];
  categories.forEach((category, index) => {
    const section = makeElement('section', undefined, 'book-section');
    const heading = makeElement('h3', category);
    heading.id = `category-heading-${index}`;
    heading.dir = 'auto';
    section.setAttribute('aria-labelledby', heading.id);
    const list = makeElement('div', undefined, 'book-list');
    matches.filter(book => book.categoryName === category).forEach(book => list.append(showBook(book)));
    section.append(heading, list);
    sectionsContainer.append(section);
  });
  searchStatus.textContent = matches.length
    ? `${matches.length} ${matches.length === 1 ? 'book' : 'books'} found.`
    : 'No books found. Try another search or reset the filters.';
}

function selectCategory(category) {
  selectedCategory = category;
  filtersContainer.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.category === category));
  });
  filterBooks();
}

function showCategories() {
  filtersContainer.replaceChildren();
  const categories = ['', ...new Set(books.map(book => book.categoryName))];
  categories.forEach(category => {
    const button = makeElement('button', category || 'All Books');
    button.type = 'button';
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    button.addEventListener('click', () => selectCategory(category));
    filtersContainer.append(button);
  });
}

// Fetch one page, check its HTTP status, and parse the JSON response.
async function getPage(page) {
  const response = await fetch(`${API_URL}?page=${page}`, {
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (!Array.isArray(result.data)) throw new Error('Unexpected API response.');
  return result;
}

async function loadBooks() {
  retryButton.hidden = true;
  document.querySelector('#book-controls').hidden = true;
  sectionsContainer.setAttribute('aria-busy', 'true');
  sectionsContainer.replaceChildren();
  loadStatus.textContent = 'Loading books…';
  try {
    const firstPage = await getPage(1);
    const pageCount = firstPage.metadata?.pagesCount ?? 1;
    if (!Number.isInteger(pageCount) || pageCount < 0 || pageCount > 100) {
      throw new Error('Unexpected page count.');
    }
    let records = [...firstPage.data];
    // The API is paginated: collect every page, not just the first 20 books.
    for (let page = 2; page <= pageCount; page++) {
      loadStatus.textContent = `Loading page ${page} of ${pageCount}…`;
      const result = await getPage(page);
      records.push(...result.data);
    }
    const uniqueBooks = new Map();
    records.forEach(record => {
      if (!record || typeof record._id !== 'string' || typeof record.title !== 'string') {
        throw new Error('A book is missing its ID or title.');
      }
      uniqueBooks.set(record._id, {
        ...record,
        authorName: record.author?.name || 'Unknown author',
        categoryName: record.category?.name || 'Uncategorised',
        description: typeof record.description === 'string' ? record.description : '',
        // Missing prices must not become zero or an invented amount.
        price: typeof record.price === 'number' && Number.isFinite(record.price) && record.price >= 0
          ? record.price : null
      });
    });
    books = [...uniqueBooks.values()];
    selectedCategory = '';
    showCategories();
    filterBooks();
    document.querySelector('#book-controls').hidden = books.length === 0;
    loadStatus.textContent = books.length ? `Loaded ${books.length} books.` : 'No books are available yet.';
  } catch (error) {
    console.error('Could not load books:', error);
    loadStatus.textContent = 'Could not load books. Check your connection and try again.';
    if (location.protocol === 'https:') {
      loadStatus.textContent = 'This API uses HTTP. Open this website through HTTP localhost to load books.';
    }
    retryButton.hidden = false;
  } finally {
    sectionsContainer.setAttribute('aria-busy', 'false');
  }
}

searchInput.addEventListener('input', filterBooks);
document.querySelector('#reset-filters').addEventListener('click', () => {
  searchInput.value = '';
  selectCategory('');
  searchInput.focus();
});
retryButton.addEventListener('click', loadBooks);

// Keep the practice cart for API books that have a numeric price.
const cart = [];
const cartItems = document.querySelector('#cart-items');
const cartStatus = document.querySelector('#cart-status');
const clearCartButton = document.querySelector('#clear-cart');

function updateCart() {
  cartItems.replaceChildren();
  let total = 0;
  let count = 0;
  cart.forEach(book => {
    const item = makeElement('li', `${book.title} × ${book.quantity} — Rs. ${(book.price * book.quantity).toLocaleString('en-PK')}`);
    item.dir = 'auto';
    cartItems.append(item);
    total += book.price * book.quantity;
    count += book.quantity;
  });
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-total').textContent = total.toLocaleString('en-PK');
  document.querySelector('#cart-empty').hidden = count > 0;
  clearCartButton.disabled = count === 0;
}

function addToCart(book) {
  if (book.price === null) return;
  const existingBook = cart.find(item => item._id === book._id);
  if (existingBook) existingBook.quantity++;
  else cart.push({ ...book, quantity: 1 });
  updateCart();
  cartStatus.textContent = `${book.title} added. Cart now contains ${document.querySelector('#cart-count').textContent} items.`;
}

clearCartButton.addEventListener('click', () => {
  cart.length = 0;
  updateCart();
  cartStatus.textContent = 'Cart cleared.';
});
document.querySelector('#cart').hidden = false;
updateCart();
loadBooks();
