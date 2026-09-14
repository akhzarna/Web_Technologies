# BookStore — first Web Technologies lecture

A one-page bookstore built with plain HTML, CSS, and JavaScript. A Node.js
server serves the page and GET APIs. No framework, Bootstrap, database,
external API, or npm dependencies are needed. All books and authors are fictional demo data.

## Run locally

Install Node.js if it is not already installed. In a terminal:

```sh
cd BookStore
npm start
```

If your terminal is already inside BookStore, run only `npm start`.
Open **http://localhost:3000**. Stop the server with **Ctrl+C**.
Open the page through the server instead of double-clicking the HTML file.

## Files to teach

```text
BookStore/
  frontend/
    index.html        Page structure
    style.css         Colors, spacing, Flexbox, responsive layout
    script.js         GET requests and displaying the returned books
  server/
    server.js         HTTP server, API routes, server-side filtering
    data/books.json   Sample data; no database
  admin/
    README.md         Placeholder for a future lecture
  package.json        The npm start command
```

## GET APIs

| Request | Response |
| --- | --- |
| `/api/books` | All books |
| `/api/categories` | Unique category names |
| `/api/books?category=Science` | Only Science books |
| `/api/books?category=Web%20Development` | Only Web Development books |
| `/api/books?category=Unknown` | An empty array `[]` |

Category names are case-sensitive. Missing or empty `category` returns all books.
Spaces are encoded in a URL: JavaScript's `encodeURIComponent()` handles this.
Successful requests return HTTP 200. Unknown routes return 404, unsupported
methods return 405, and server errors return 500, with JSON error messages.

Try the API directly in the browser or terminal:

```sh
curl 'http://localhost:3000/api/books?category=Science'
```

## Suggested lecture walkthrough

1. Open `index.html`: identify the header, main content, book container, and footer.
2. Open `style.css`: show `display: flex`, `gap`, `flex-wrap`, and the media queries.
3. Open `books.json`: explain an array `[]`, objects `{}`, keys, strings, and numbers.
4. Visit `/api/books` directly: this is data the server sends, not an HTML page.
5. Open browser DevTools → Network → Fetch/XHR. Click **Science** on the page.
6. Inspect the GET request, the `category` query parameter, status 200, and JSON response.
7. Find `url.searchParams.get('category')` and `books.filter(...)` in `server.js`.
   The server returns just the matching books; the browser does not filter a saved list.
8. Follow `fetch()` → `response.json()` → `books.forEach(showBook)` in `script.js`.
   Explain that `await` waits for a result and the DOM methods create visible HTML elements.
9. Use the page's “Under the hood” panel to compare the selected category with its JSON.
10. Add a book or a new category to `books.json`, save, and refresh. Preserve valid JSON:
    double-quoted keys and strings, commas between entries, and no trailing commas.

The flow is **click → browser GET request → server filters data → JSON response → browser updates HTML**.

JSON is a text format for exchanging data. `JSON.parse()` converts JSON text
into JavaScript data; `JSON.stringify()` converts JavaScript data into JSON text.
The browser's `response.json()` reads and parses a JSON HTTP response.

The frontend and API share `http://localhost:3000`, so no separate frontend
server or CORS configuration is necessary. GET reads data; this demo does not
change data through HTTP. The Node.js server uses only built-in modules and
binds to the local machine for classroom use.
