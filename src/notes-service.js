//Replace all 'noteful_notes' with the new database name
const notesService = {
    getAllNotes(knex, user_id) {
      return knex
      .select('*')
      .from('notes')
      .where('user_id', user_id)
    },
    searchNotes(knex, user_id, keyword){
      return knex
      .select('*')
      .from('notes')
      .where('user_id', user_id)
      .where('contents', 'like', `%${keyword}%`)
    },
    getById(knex, id) {
      return knex
      .select('*')
      .from('notes')
      .where('id', id)
      .first()
    },
    getUserNotesByFolderId(knex, user_id, folder_id) {
      return knex
      .select('*')
      .from('notes')
      .where({user_id, folder_id})
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
    deleteNote(knex, note_id, user_id) {
      return knex('notes')
        .where({ id: note_id, user_id })
        .delete()
    },
  }
  
  module.exports = notesService
  