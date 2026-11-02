# FSD-Mid-Term-1_CSE-11_2500320100026

## Backend

Run the Express backend on port 3000 with:

```bash
npm start
```

Book API routes:

- `POST /api/books` adds a book using JSON request details: `id`, `title`,
  `author`, `category`, and positive integer `quantity`. You may optionally
  provide `available` from `0` to `quantity`; otherwise it starts equal to
  `quantity`.
- `GET /api/books` returns all books as an array, or `[]` when empty.
- `GET /api/books/:id` returns a book by ID, or `404` if it does not exist.
- `PUT /api/books/:id` updates `title`, `author`, `category`, `quantity`, and/or
  `available` without changing the ID.
- `DELETE /api/books/:id` deletes a book by ID, or returns `404` if it does not
  exist.
- `GET /api/books/search?q=java` searches titles, authors, and categories
  (case-insensitive). An empty search term returns `400`; no matches returns
  an empty array.
- `POST /api/books/:id/issue` reduces the available copy count by one.
- `POST /api/books/:id/return` increases the available copy count by one.

Books are stored in memory and cleared when the server restarts.