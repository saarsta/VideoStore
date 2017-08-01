var db = require('../dbconnection');

var Language = {
    getAllActors: function (callback) {
        return db.query("Select * from language", callback);

    },
    getActorById: function (id, callback) {
        return db.query("select * from language where language_id=?", [id], callback);
    }
};

module.exports = Language;