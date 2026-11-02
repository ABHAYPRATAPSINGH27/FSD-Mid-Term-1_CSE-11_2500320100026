const express = require("express");

const app = express();
const PORT = 3000;
const books = [];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express server is running.");
});

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ error: `Book with id ${req.params.id} was not found.` });
  }

  res.json(book);
});

app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ error: `Book with id ${req.params.id} was not found.` });
  }

  const updates = req.body;
  const permittedFields = ["title", "author", "category", "quantity", "available"];

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }

  if (Object.hasOwn(updates, "id")) {
    return res.status(400).json({ error: "Book ID cannot be changed." });
  }

  const fields = Object.keys(updates);
  if (fields.length === 0 || fields.some((field) => !permittedFields.includes(field))) {
    return res.status(400).json({
      error: `Provide at least one permitted field: ${permittedFields.join(", ")}.`,
    });
  }

  const updatedBook = { ...book, ...updates };
  if (
    (Object.hasOwn(updates, "title") && typeof updates.title !== "string") ||
    (Object.hasOwn(updates, "author") && typeof updates.author !== "string") ||
    (Object.hasOwn(updates, "category") && typeof updates.category !== "string") ||
    !Number.isInteger(updatedBook.quantity) ||
    !Number.isInteger(updatedBook.available) ||
    updatedBook.quantity < 0 ||
    updatedBook.available < 0 ||
    updatedBook.available > updatedBook.quantity
  ) {
    return res.status(400).json({
      error:
        "Book details are invalid. Quantity and available must be non-negative integers, and available cannot exceed quantity.",
    });
  }

  Object.assign(book, updates);
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { id, title, author, category, quantity, available } = req.body;

  if (
    !Number.isInteger(id) ||
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof category !== "string" ||
    !Number.isInteger(quantity) ||
    !Number.isInteger(available) ||
    quantity < 0 ||
    available < 0 ||
    available > quantity
  ) {
    return res.status(400).json({
      error:
        "Provide an integer id, string title/author/category, and integer quantity/available where 0 <= available <= quantity.",
    });
  }

  if (books.some((book) => book.id === id)) {
    return res.status(409).json({ error: `A book with id ${id} already exists.` });
  }

  const book = { id, title, author, category, quantity, available };
  books.push(book);
  res.status(201).json(book);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
