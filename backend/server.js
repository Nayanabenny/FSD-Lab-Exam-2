const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: '',     
  database: 'movie_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL Database');
});


app.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/movies', (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',
    [title, director, genre, release_year, rating],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title, director, genre, release_year, rating });
    }
  );
});

app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    'UPDATE movies SET title=?, director=?, genre=?, release_year=?, rating=? WHERE id=?',
    [title, director, genre, release_year, rating, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Movie updated successfully' });
    }
  );
});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM movies WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Movie deleted successfully' });
  });
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
