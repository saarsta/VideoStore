var db = require('../dbconnection');

var Language = {
    getAllLanguages: function (callback) {
        return db.query("Select language_id, name from language", callback);

    },
    getLanguageById: function (id, callback) {
        return db.query("select * from language where language_id=?", [id], callback);
    }
};

module.exports = Language;