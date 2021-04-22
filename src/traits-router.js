const express = require('express')
const {verify} = require('./middleware')
const path = require('path')
const xss = require('xss')
const traitsService = require('./traits-service')
const traitsRouter = express.Router()
const jsonParser = express.json()

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


module.exports = traitsRouter
