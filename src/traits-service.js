const traitsService = {
    getAllTraits(knex) {
      return knex
      .select('*')
      .from('traits')
    },
    addUserTrait(knex, userTrait) {
        return knex
          .insert(userTrait)
          .into('user-traits')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
    },
    deleteUserTrait(knex, trait_id, user_id) {
        return knex('user-traits')
          .where({ trait_id, user_id })
          .delete()
    },
    getUserTrait(knex, trait_id, user_id) {
        return knex
        .select('*')
        .where({ trait_id, user_id })
        .from('user-traits')
    },
    getUserTraits(knex, user_id) {
        return knex
        .from('user-traits')
        .join('traits', 'traits.id', 'user-traits.trait_id')
        .select('*')
        .where({ user_id })
    },
}
  
  module.exports = traitsService
  