var db = require('../dbconnection');

var Category = {
    getAllCategories: function (callback) {
        return db.query("Select * from category", callback);

    },
    getCategoryById: function (id, callback) {
        return db.query("select * from category where Id=?", [id], callback);
    }
};

module.exports = Category;