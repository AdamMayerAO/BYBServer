//Replace all 'noteful_notes' with the new database name
const foldersService = {
  getAllFolders(knex) {
    return knex
    .select('*')
    .from('folders')
  },
}

module.exports = foldersService
  