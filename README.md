# FSD-Mid-Term-1_CSE-11_2500320100026

## Backend

Run the Express backend on port 3000 with:

```bash
npm start
```

Book API routes:

- `POST /api/books` adds a book using JSON request details.
- `GET /api/books` returns all books.
- `GET /api/books/:id` returns a book by ID.
- `PUT /api/books/:id` updates book details without changing its ID.
- `DELETE /api/books/:id` deletes a book by ID.
- `GET /api/books/search?q=java` searches titles, authors, and categories
  (case-insensitive). An empty search term returns `400`; no matches returns
  an empty array.

Books are stored in memory and cleared when the server restarts.