const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const pool = mysql.createPool({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "employee",
  host: "sql.freedb.tech",
  user: "u_upqtX0",
  password: "Mfzc8UbtPTGb",
  database: "freedb_fjStEyqK",
  ///
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
//REPORT
app.get("/api/books", (req, res) => {
  pool.query("SELECT * FROM books", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});
//CREATE
app.post("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const yearPublished = req.body.yearPublished;
  pool .query(
    
    "INSERT INTO books (title, author, yearPublished) VALUES (?, ?, ?)",
    [title, author, yearPublished],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully inserted!` });
    },
);
});

//SEARCH


app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
