const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const db = new sqlite3.Database('my_database.db');

app.use(cors());
app.use(express.json());

// Alle Benutzer abrufen
app.get('/users', (req, res) => {
  db.all('SELECT * FROM Users', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Einzelnen Benutzer abrufen
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM Users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (!row) {
      res.status(404).send('User not found');
      return;
    }
    res.json(row);
  });
});

// Benutzer erstellen
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO Users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// Benutzer aktualisieren
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  db.run('UPDATE Users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json({ id, name, email });
  });
});

// Benutzer löschen
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM Users WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json({ message: 'User deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
