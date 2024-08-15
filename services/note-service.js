const { NoteMasterHelper } = require("../helpers/note-helper");

let noteHelper = new NoteMasterHelper();

class NoteService { 

    async addNote(PK, noteObj) {
        let notedata = await noteHelper.addNote(PK, noteObj);   
        return notedata;
      };

      async getUserNotes(PK) {
        let notedata = await noteHelper.getUserNotes(PK);   
        return notedata;
      };

      async deleteNote(PK, noteObj) {
        let notedata = await noteHelper.deleteNote(PK, noteObj);
        return notedata;
      };

};

module.exports = { NoteService };