//Replace all 'noteful_notes' with the new database name
const notesService = {
    getAllNotes(knex) {
      return knex
      .select('*')
      .from('notes')
    },
    getById(knex, id) {
      return knex
      .from('notes')
      .select('*')
      .where('id', id)
      .first()
    },
    getByFolder(knex, folderId){
        return knex
        .from('notes')
        .select('*')
       // .where('noteful_folder', folderId)
        .first()
    },

    addNote(knex, newNote) {
      return knex
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteNote(knex, id) {
      return knex('notes')
        .where({ id })
        .delete()
    },
  }
  
  module.exports = notesService
  