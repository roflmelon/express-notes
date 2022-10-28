const notes = require('express').Router();
const db = require('../db/db.json');
const fs = require('fs');
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => res.json(db));

notes.post('/', (req, res) => {
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
    res.status(200).json('add successful!!');
  } else {
    res.status(400).json('Error 400');
  }
});

notes.delete('/:id', (req, res) => {
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
    res.status(200).json('delete successful!');
  } else {
    res.status(400).json('Error 400');
  }
});

module.exports = notes;
