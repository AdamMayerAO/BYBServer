const traitsService = {
    getAllTraits(knex) {
      return knex
      .select('*')
      .from('traits')
    }
  }
  
  module.exports = traitsService
  