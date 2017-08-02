var db = require('../dbconnection');

var Category = {
    getAllCategories: function (callback) {
        return db.query("select category_id, name from category", callback);

    },
    getCategoryById: function (id, callback) {
        return db.query("select * from category where Id=?", [id], callback);
    }
};

module.exports = Category;