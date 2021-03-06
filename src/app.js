require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const app = express()
const notesRouter = require('./notes-router')
const usersRouter = require('./users-router')
const traitsRouter = require('./traits-router')
const foldersRouter = require('./folders-router')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'))

app.use('/notes', notesRouter)
app.use('/user', usersRouter)
app.use('/traits', traitsRouter)
app.use('/folders', foldersRouter)

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// app.use(express.static('public'))


app.use(function errorHandler(error, req, res, next) {
    let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

module.exports = app