// Built-in Node.js modules: no packages need to be installed.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = 5500;

// Only these public website files can be requested by the browser.
const files = {
  '/': ['index.html', 'text/html'],
  '/index.html': ['index.html', 'text/html'],
  '/style.css': ['style.css', 'text/css'],
  '/script.js': ['script.js', 'text/javascript'],
  '/images/book-placeholder.svg': ['images/book-placeholder.svg', 'image/svg+xml'],
  '/images/html-basics.svg': ['images/html-basics.svg', 'image/svg+xml'],
  '/images/learning-css.svg': ['images/learning-css.svg', 'image/svg+xml'],
  '/images/javascript-beginners.svg': ['images/javascript-beginners.svg', 'image/svg+xml']
};

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  try {
    const url = new URL(request.url, `http://localhost:${PORT}`);
    const file = Object.hasOwn(files, url.pathname) ? files[url.pathname] : null;
    if (!file) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('File not found');
      return;
    }

    const [filename, contentType] = file;
    const content = await fs.readFile(path.join(__dirname, filename));
    response.writeHead(200, {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Content-Length': content.length,
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('The server could not load this file.');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${PORT} is already in use. Stop the other server and run npm start again.`
    : error.message);
  process.exitCode = 1;
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Bookstore: http://127.0.0.1:${PORT}`);
  console.log('Keep this terminal open. Press Ctrl+C to stop.');
});
