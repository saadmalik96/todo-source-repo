const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());



const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'todo_user',
  password: process.env.DB_PASSWORD || 'todopass',
  database: process.env.DB_DATABASE || 'tododb'
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
  // Create todos table if it doesn't exist
  db.query(`CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
  )`, (err) => {
    if (err) console.error(err);
  });
});

app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json({error: err});
    res.json(results);
  });
});

app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({error: 'Task is required'});
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) return res.status(500).json({error: err});
    res.json({ id: result.insertId, task, completed: false });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { completed } = req.body;
  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, req.params.id], (err) => {
    if (err) return res.status(500).json({error: err});
    res.json({ id: req.params.id, completed });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({error: err});
    res.json({ message: 'Deleted' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
