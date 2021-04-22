const express = require('express')
const { access } = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
const xss = require('xss')
const { verify } = require('./middleware')
const usersService = require('./users-service')
const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  firstName: xss(user.firstName),
  lastName: xss(user.lastName),
  email: xss(user.email),
  password: xss(user.password),
})

usersRouter
  .route('/signup')
  .post((req, res, next) => {
    const { firstName, lastName, email, password } = req.body
    if(!firstName.length || !lastName.length || !email.length || !password.length) {
        return res.status(405).json({
            message: `One or more parameters are incorrect/empty!`
        })
    }
    usersService.getUserByEmail(req.app.get('db'), email)
      .then(user => {
        if (user) {
          return res.status(405).json({
            message: `User with this email already exists!`
          })
        }
      })
      .catch(next)
    usersService.addNewUser(req.app.get('db'), {firstName, lastName, email, password})
      .then(user => {
        console.log("\nAdd New User Response: ", user, "\n");
        if (!user) {
          return res.status(405).json({
            message: `An error occurred while registering using!`
          })
        } else {
            return res.status(201).json({
              message: `User registered successfully!`
            });
        }
      })
      .catch(next)
  })

usersRouter
  .route('/get')
  .get(verify, (req, res, next) => {
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
      .then(user => {
        if (user) {
          return res.status(200).json({
            user,
            message: `User details fetched successfully!`
          })
        } else {
            return res.status(404).json({
                message: `An error occurred while fetching user details!`
              })
        }
      })
      .catch(next)
  })

usersRouter
  .route('/login')
  .post((req, res, next) => {
    const { email, password } = req.body
    usersService.getUserByEmail(req.app.get('db'), email)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: `User does not exist with this email!`
          })
        } else if(user.password === password) {
            let accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            });
        
            //create the refresh token with the longer lifespan
            let refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            })
            //users[username].refreshToken = refreshToken

            return res.status(200).json({
                message: `User logged in successfully!`,
                accessToken
            })
        } else {
            return res.status(404).json({
              message: `Email or password is incorrect!`
            });
        }
      })
      .catch(next)

      })

module.exports = usersRouter
