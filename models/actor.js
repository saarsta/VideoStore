var db = require('../dbconnection');

var Actor = {
    getAllActors: function (callback) {
        return db.query("Select *, CONCAT(first_name,' ', last_name) as name from actor order by name", callback);

    },
    getActorById: function (id, callback) {
        return db.query("select * from actor where actor_id=?", [id], callback);
    }
};

module.exports = Actor;