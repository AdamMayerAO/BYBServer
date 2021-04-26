const express = require('express')
const {verify} = require('./middleware')
const path = require('path')
const xss = require('xss')
const traitsService = require('./traits-service')
const usersService = require('./users-service')
const traitsRouter = express.Router()
const jsonParser = express.json()
const jwt = require('jsonwebtoken')


const serializeTrait = trait => ({
  id: trait.id,
  name: trait.name,
  tagline: trait.tagline
})

traitsRouter
  .route('/all')
  .get(verify, (req, res, next) => {
    const knexInstance = req.app.get('db')
    traitsService.getAllTraits(knexInstance)
      .then(traits => {
        return res.status(200).json({
            traits: traits.map(serializeTrait),
            message: `Traits fetched successfully!`
        });
      })
      .catch(next)
  })

  traitsRouter
  .route('/user-traits')
  .get(verify, (req, res, next) => {
    const knexInstance = req.app.get('db')
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
      .then(user => {
        if (user) {
            traitsService. getUserTraits(knexInstance, user.id)
                .then(traits => {
                    return res.status(200).json({
                        userTraits: traits.map(serializeTrait),
                        message: `User traits fetched successfully!`
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

traitsRouter
  .route('/add-user-trait')
  .post(verify, (req, res, next) => {
    const { trait } = req.body;
    const knexInstance = req.app.get('db');
    let accessToken = req.header('authorization');
    let data = jwt.decode(accessToken);
    usersService.getUserByEmail(req.app.get('db'), data.email)
      .then(user => {
        if (user) {
            const userTrait = {
                user_id: user.id,
                trait_id: trait.id
            };
            traitsService.addUserTrait(knexInstance, userTrait)
                .then(trait => {
                    return res.status(201).json({
                        message: `User trait added successfully!`
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


traitsRouter
.route('/remove-user-trait')
.post(verify, (req, res, next) => {
  const { trait } = req.body;
  const knexInstance = req.app.get('db');
  let accessToken = req.header('authorization');
  let data = jwt.decode(accessToken);
  usersService.getUserByEmail(req.app.get('db'), data.email)
    .then(user => {
      if (user) {
          traitsService.deleteUserTrait(knexInstance, trait.id, user.id)
              .then(trait => {
                  return res.status(200).json({
                      message: `User trait deleted successfully!`
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


module.exports = traitsRouter
