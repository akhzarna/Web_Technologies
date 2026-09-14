// Node.js provides these modules. No npm packages or database are needed.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = 3000;
const booksFile = path.join(__dirname, 'data', 'books.json');
const frontendFolder = path.join(__dirname, '..', 'frontend');

// A JavaScript object/array becomes JSON text before it travels over HTTP.
function sendJSON(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  console.log(`${request.method} ${url.pathname}${url.search}`);

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJSON(response, 405, { error: 'This lecture server only supports GET requests.' });
  }

  try {
    if (url.pathname === '/api/books' || url.pathname === '/api/categories') {
      // Read a local JSON file and turn the JSON text into JavaScript objects.
      const text = await fs.readFile(booksFile, 'utf8');
      const books = JSON.parse(text);

      if (url.pathname === '/api/categories') {
        const categories = [...new Set(books.map(book => book.category))];
        return sendJSON(response, 200, categories);
      }

      // Example: /api/books?category=Science
      // Filtering happens HERE on the server, not in the browser.
      const category = url.searchParams.get('category');
      const matchingBooks = category
        ? books.filter(book => book.category === category)
        : books;

      return sendJSON(response, 200, matchingBooks);
    }

    // Serve only these three frontend files to the browser.
    const pages = {
      '/': { file: 'index.html', type: 'text/html' },
      '/style.css': { file: 'style.css', type: 'text/css' },
      '/script.js': { file: 'script.js', type: 'text/javascript' }
    };
    const page = pages[url.pathname];

    if (!page) {
      return sendJSON(response, 404, { error: 'Page or API not found.' });
    }

    const content = await fs.readFile(path.join(frontendFolder, page.file));
    response.writeHead(200, { 'Content-Type': `${page.type}; charset=utf-8` });
    response.end(content);
  } catch (error) {
    console.error(error);
    sendJSON(response, 500, { error: 'The server could not load the requested data.' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`BookStore is running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server.');
});
