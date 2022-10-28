const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3002;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {
  let { title, text } = req.body;
  if (title && text) {
    let newNote = {
      id: uuid(),
      title,
      text,
    };

    fs.readFile('./db/db.json', 'utf8', (err, dbNote) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(dbNote);

        // Add a new review
        parsedNote.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully Added a new note!')
        );
      }
    });
  } else {
    res.status(400).json('Error 400');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  let id = req.params.id;
  if (id) {
    fs.readFile('./db/db.json', 'utf8', (err, dbNote) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(dbNote);

        const newNote = parsedNote.filter((notes) => {
          return notes.id !== id;
        });
        console.log(newNote);
        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(newNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully Added a new note!')
        );
      }
    });
  } else {
    res.status(400).json('Error 400');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
