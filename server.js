const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ================================
// MYSQL CONNECTION
// ================================

const pool = mysql.createPool({
  host: "sql.freedb.tech",
  user: "u_upqtX0",
  password: "Mfzc8UbtPTGb",
  database: "freedb_fjStEyqK",

  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

// ================================
// HOME / TEST API
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "Book Library API is running!",
  });
});

// ================================
// READ - GET ALL BOOKS
// ================================

app.get("/api/books", (req, res) => {
  pool.query(
    "SELECT * FROM books ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);

        return res.status(500).json({
          msg: "Failed to retrieve books",
        });
      }

      res.status(200).json(rows);
    }
  );
});

// ================================
// CREATE - ADD BOOK
// ================================

app.post("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const yearPublished = req.body.year_published;

  // Validate fields
  if (
    !title ||
    !author ||
    !yearPublished
  ) {
    return res.status(400).json({
      msg: "All fields are required",
    });
  }

  pool.query(
    `INSERT INTO books
    (title, author, year_published)
    VALUES (?, ?, ?)`,
    [
      title,
      author,
      yearPublished
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);

        return res.status(500).json({
          msg: "Failed to add book",
        });
      }

      res.status(201).json({
        msg: "Successfully inserted!",
        id: result.insertId,
      });
    }
  );
});

// ================================
// RUN SERVER LOCALLY
// ================================

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// ================================
// VERCEL EXPORT
// ================================

module.exports = app;