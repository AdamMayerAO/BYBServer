const express = require('express')
const {verify} = require('./middleware')
const path = require('path')
const xss = require('xss')
const notesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()
const jwt = require('jsonwebtoken')
const usersService = require('./users-service')


const serializeNote = note => ({
  id: note.id,
  noteType: note.note_type,
  contents: xss(note.contents),
  folderId: note.folder_id,
  userId: note.user_id
})

notesRouter
  .route('/all')
  .get(verify, (req, res, next) => {
    const knexInstance = req.app.get('db')
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
    .then(user => {
      if (user) {
        notesService.getAllNotes(knexInstance, user.id)
        .then(notes => {
          return res.status(200).json({
            notes: notes.map(serializeNote),
            message: `Notes fetched successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching user details!`
        })
      }
    })
    .catch(next)
  })

notesRouter
  .route('/add-note')
  .post(verify, (req, res, next) => {
    const { noteType, contents, folderId } = req.body;
    const newNote = { noteType: noteType, contents, folder_id: folderId}
    for (const [key, value] of Object.entries(newNote)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
      let accessToken = req.header('authorization');
      let data = jwt.decode(accessToken);
      usersService.getUserByEmail(req.app.get('db'), data.email)
        .then(user => {
          if (user) {
            notesService.addNote(
              req.app.get('db'),
              {...newNote, user_id: user.id}
            )
            .then(note => {
              return res.status(201).json({
                message: `Note added successfully!`
              });
            })
          } else {
            return res.status(404).json({
              message: `An error occurred while fetching user details!`
            })
          }
        })
        .catch(next)
  })

// notesRouter
//   .route('/:note_id')
//   .all(verify, (req, res, next) => {
//     const { note_id } = req.params
//    notesService.getById(req.app.get('db'), note_id)
//       .then(note => {
//         if (!note) {
//           return res.status(404).json({
//             error: { message: `Note Not Found` }
//           })
//         }
//         res.note = note
//         next()
//       })
//       .catch(next)

//   })
//   .get(verify, (req, res) => {
//     res.json(serializeNote(res.note))
//   })
notesRouter
  .route('/search')
  .post(verify, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { keyword } = req.body;
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
    .then(user => {
      if (user) {
        notesService.searchNotes(knexInstance, user.id, keyword)
        .then(notes => {
          return res.status(200).json({
            notes: notes.map(serializeNote),
            message: `Notes searched successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching user details!`
        })
      }
    })
    .catch(next)
  })


notesRouter
  .route('/by-folder')
  .post(verify, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { folderId } = req.body;
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
    .then(user => {
      if (user) {

        notesService.getUserNotesByFolderId(knexInstance, user.id, folderId)
        .then(notes => {
          return res.status(200).json({
            notes: notes.map(serializeNote),
            message: `Notes fetched successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching user details!`
        })
      }
    })
    .catch(next)
  })

notesRouter
  .route('/remove-note')
  .post(verify, (req, res, next) => {
    const { note } = req.body;
    const knexInstance = req.app.get('db');
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
    .then(user => {
      if (user) {
        notesService.deleteNote(knexInstance, note.id, user.id)
        .then(note => {
          return res.status(200).json({
            message: `Note deleted successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching user details!`
        })
      }
    })
    .catch(next)
  })

module.exports = notesRouter
