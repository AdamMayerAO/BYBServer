const usersService = {
    getUserByEmail(knex, email) {
      return knex
      .from('users')
      .select('*')
      .where('email', email)
      .first()
    },
    addNewUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    }
  }
  
  module.exports = usersService
  