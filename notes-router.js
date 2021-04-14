const express = require('express')
const path = require('path')
const xss = require('xss')
const notesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  title: xss(note.title),
  contents: xss(note.contents),
  folder: Number(note.folder),
  modified: note.date,
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    notesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { type, contents, folder } = req.body
    const newNote = { type, contents, folder}
    for (const [key, value] of Object.entries(newNote)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }


    

    notesService.addNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(`/notes/${note.id}`)
          .json(serializeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    const { note_id } = req.params
   notesService.getById(req.app.get('db'), note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note Not Found` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)

  })
  .get((req, res) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    const { note_id } = req.params
    notesService.deleteNote(
      req.app.get('db'),
      note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter
