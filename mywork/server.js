/* =========================================================
   SIMPLE NODE.JS HTTP SERVER (No Libraries / No Frameworks)
   Demonstrating:
   1. Built-in 'http' module
   2. Handling GET requests and URL routing
   3. Setting HTTP Response Headers (Content-Type, CORS)
   4. Sending JSON data using JSON.stringify()
   ========================================================= */

const http = require('http');

const PORT = 3000;

// Sample book data (Array of Objects)
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        price: 12.99,
        description: "A story of ambition, love, and the disillusionment of the American Dream in the 1920s."
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Drama",
        price: 14.50,
        description: "A profound look at justice, empathy, and courage in the American South through young Scout's eyes."
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Sci-Fi",
        price: 11.20,
        description: "A haunting dystopian tale exploring surveillance, totalitarianism, and the loss of personal freedom."
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        price: 10.75,
        description: "A witty romantic novel tracking the emotional development of Elizabeth Bennet and Mr. Darcy."
    }
];

// Create the HTTP server
const server = http.createServer(function (req, res) {
    // 1. Enable CORS (Cross-Origin Resource Sharing)
    // Allows the frontend running in the browser to call this API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight browser requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2. Route: GET /api/books
    if (req.method === 'GET' && req.url === '/api/books') {
        // Set HTTP status code 200 (OK) and Content-Type to application/json
        res.writeHead(200, { 'Content-Type': 'application/json' });

        // Convert the JavaScript array/object to a JSON string and send response
        res.end(JSON.stringify(books, null, 2));
    } 
    // 3. Root Route: GET /
    else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to the Book Store API! Access GET /api/books to fetch the book list.');
    } 
    // 4. Any other route (404 Not Found)
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

// Start listening for incoming requests
server.listen(PORT, function () {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`Books API available at: http://localhost:${PORT}/api/books`);
});
