import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Express server is running.");
});

let books = [];

app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity } = req.body || {};
    const available = req.body?.available ?? quantity;

    if (
        !(
            (typeof id === "string" && id.trim() !== "") ||
            (typeof id === "number" && Number.isFinite(id))
        ) ||
        ![title, author, category].every(
            field => typeof field === "string" && field.trim()
        ) ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !Number.isInteger(available) ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            message: "Invalid or missing book details"
        });
    }

    if (books.some(book => String(book.id) === String(id))) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const book = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book
    });
});
// Task 3
app.get("/api/books", (req, res) => {
    res.json(books);
});

// Task 6
app.get("/api/books/search", (req, res) => {
    const query = req.query.q;

    if (typeof query !== "string" || query.trim() === "") {
        return res.status(400).json({
            message: "Search query is required"
        });
    }

    const searchTerm = query.trim().toLowerCase();
    const result = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );

    res.json(result);
});

app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => String(b.id) === req.params.id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// Task 4
app.put("/api/books/:id", (req, res) => {

    const book = books.find(
        b => String(b.id) === req.params.id
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const updates = req.body;

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
        return res.status(400).json({
            message: "Request body must be a JSON object"
        });
    }

    if (Object.hasOwn(updates, "id")) {
        return res.status(400).json({
            message: "Book ID cannot be changed"
        });
    }

    const permittedFields = ["title", "author", "category", "quantity", "available"];
    const fields = Object.keys(updates);
    if (
        fields.length === 0 ||
        fields.some(field => !permittedFields.includes(field))
    ) {
        return res.status(400).json({
            message: "Provide at least one permitted book detail"
        });
    }

    const updatedBook = { ...book, ...updates };
    if (
        [updates.title, updates.author, updates.category].some(
            value => value !== undefined &&
                (typeof value !== "string" || !value.trim())
        ) ||
        !Number.isInteger(updatedBook.quantity) ||
        updatedBook.quantity <= 0
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    if (
        Object.hasOwn(updates, "quantity") &&
        !Object.hasOwn(updates, "available")
    ) {
        const issued = book.quantity - book.available;
        if (updatedBook.quantity < issued) {
            return res.status(400).json({
                message: "Quantity cannot be less than the number of issued copies"
            });
        }
        updatedBook.available = updatedBook.quantity - issued;
    }

    if (
        !Number.isInteger(updatedBook.available) ||
        updatedBook.available < 0 ||
        updatedBook.available > updatedBook.quantity
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    Object.assign(book, updatedBook);

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// Task 5
app.delete("/api/books/:id", (req, res) => {

    const index = books.findIndex(
        book => String(book.id) === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Task 7
app.post("/api/books/:id/issue", (req, res) => {

    const book = books.find(
        b => String(b.id) === req.params.id
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available <= 0) {
        return res.status(409).json({
            message: "No copies available"
        });
    }

    book.available--;

    res.status(200).json({
        message: "Book issued successfully",
        book
    });
});

// Task 7: Return a book
app.post("/api/books/:id/return", (req, res) => {

    const book = books.find(
        b => String(b.id) === req.params.id
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available >= book.quantity) {
        return res.status(409).json({
            message: "All copies are already returned"
        });
    }

    book.available++;

    res.status(200).json({
        message: "Book returned successfully",
        book
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});