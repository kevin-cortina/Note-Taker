const express = require('express');
const req = require('express/lib/request');
const path = require('path');
const noteData = require('./db/db.json');
const uuid = require('./helpers/uuid.js');
const fs = require('fs');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils.js');

const app = express();
const PORT = process.env.PORT; 

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//connects the get started button to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// START OF API ROUTES
//to get the other notes on the left side of note.html
app.get('/api/notes', (req, res) => 
  fs.readFile('./db/db.json', "utf8", (err, data) =>
  err ? console.error(err) : res.json(JSON.parse(data))
  ));

// GET Route for a notes
app.get('/api/notes', (req, res) => {
  const noteId = req.params;
  fs.readFile('./db/db.json', "utf8", (err, data) =>
  err ? console.error(err) : res.json(JSON.parse(data))
)});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.log(req.body);
  let response;
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    }

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);

  } else {
    res.error('Error in adding Note');
  }
});

// Delete route for notes
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const result = JSON.parse(data).filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(result, null, 4), (err) => 
        err ? console.error(err) : console.info("Note has been deleted.")
      );
      res.json("Note has been deleted.");
    };
  });
});

//sets the host
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));