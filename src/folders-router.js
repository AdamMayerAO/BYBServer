const express = require('express')
const {verify} = require('./middleware')
const path = require('path')
const xss = require('xss')
const foldersService = require('./folders-service')
const foldersRouter = express.Router()
const jsonParser = express.json()
const jwt = require('jsonwebtoken')
const usersService = require('./users-service')


const serializeFolder = folder => ({
  id: folder.id,
  name: folder.name,
})

foldersRouter
  .route('/all')
  .get(verify, (req, res, next) => {
    const knexInstance = req.app.get('db');
    foldersService.getAllFolders(knexInstance)
    .then(folders => {
      return res.status(200).json({
        folders: folders.map(serializeFolder),
        message: `Folders fetched successfully!`
      });
    })
    .catch(next)
  })

// foldersRouter
//   .route('/add-folder')
//   .post(verify, (req, res, next) => {
//     const { contents, folder } = req.body;
//     const newFolder = { folder_type: folderType, contents, folder}
//     console.log({newFolder})
//     for (const [key, value] of Object.entries(newFolder)) {
//         if (value == null) {
//           return res.status(400).json({
//             error: { message: `Missing '${key}' in request body` }
//           })
//         }
//       }
//       let accessToken = req.header('authorization');
//       let data = jwt.decode(accessToken);
//       usersService.getUserByEmail(req.app.get('db'), data.email)
//         .then(user => {
//           if (user) {
//             foldersService.addFolder(
//               req.app.get('db'),
//               {...newFolder, user_id: user.id}
//             )
//             .then(folder => {
//               return res.status(201).json({
//                 message: `folder added successfully!`
//               });
//             })
//           } else {
//             return res.status(404).json({
//               message: `An error occurred while fetching user details!`
//             })
//           }
//         })
//         .catch(next)
//   })

// foldersRouter
//   .route('/:folder_id')
//   .all(verify, (req, res, next) => {
//     const { folder_id } = req.params
//    foldersService.getById(req.app.get('db'), folder_id)
//       .then(folder => {
//         if (!folder) {
//           return res.status(404).json({
//             error: { message: `Folder Not Found` }
//           })
//         }
//         res.folder = folder
//         next()
//       })
//       .catch(next)

//   })
//   .get(verify, (req, res) => {
//     res.json(serializeFolder(res.folder))
//   })

// foldersRouter
//   .route('/remove-folder')
//   .post(verify, (req, res, next) => {
//     const { folder } = req.body;
//     const knexInstance = req.app.get('db');
//     let accessToken = req.header('authorization');
//     let data = jwt.decode(accessToken);
//     usersService.getUserByEmail(req.app.get('db'), data.email)
//     .then(user => {
//       if (user) {
//         foldersService.deleteFolder(knexInstance, folder.id, user.id)
//         .then(folder => {
//           return res.status(200).json({
//             message: `Folder deleted successfully!`
//           });
//         })
//       } else {
//         return res.status(404).json({
//           message: `An error occurred while fetching user details!`
//         })
//       }
//     })
//     .catch(next)
//   })

module.exports = foldersRouter
