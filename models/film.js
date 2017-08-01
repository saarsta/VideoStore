var db = require('../dbconnection');
const MAX_ROWS = 50;

var Film = {
    getAllFilms: function (callback) {
        return db.query("Select * from film", callback);
    },
    getFilmById: function (id, callback) {
        return db.query("select * from film where Id=?", [id], callback);
    },

    getFilmsByAttrs: function (attrs, callback) {
        var offset = attrs.page ? (attrs.page - 1) * MAX_ROWS : 0;
        var query = "select * from film where ";
        var whereClauseParts = [];

        if (attrs.title) {
            whereClauseParts.push("title like \'%" + attrs.title + "%\'");
        }

        if (attrs.description) {
            whereClauseParts.push("description like \'%" + attrs.description + "%\'");
        }

        if (attrs.category) {
            /*whereClauseParts.push("film_id in (select film_id from film_category where category_id in (select category_id from category where name like \'%" + attrs.category + "%\'))");*/
            whereClauseParts.push("film_id in (select film_id from film_category where category_id=" + attrs.category + ")");
        }

        if (attrs.actor) {
            whereClauseParts.push("film_id in (select film_id from film_actor where actor_id=" + attrs.actor + ")");
        }

        if (attrs.language) {
            whereClauseParts.push("language_id=" + attrs.language);
        }

        query += whereClauseParts.join(' and ');

        var fullquery = "select SQL_CALC_FOUND_ROWS A.title as title , A.description as description, A.rating as rating , A.length as length , A.release_year as release_year, lang.name as language, category.name as category, GROUP_CONCAT( distinct CONCAT(actor.first_name,' ', actor.last_name) SEPARATOR ', ')  as actors from " +
            "( " + query + ") A " +
            "join language lang on lang.language_id = A.language_id " +
            "join film_category on film_category.film_id = A.film_id " +
            "join category on category.category_id = film_category.category_id " +
            "join film_actor on film_actor.film_id = A.film_id " +
            "join actor on actor.actor_id = film_actor.actor_id " +
            "group by A.title, A.description, A.rating, A.length, A.release_year, lang.name , category.name limit " + offset + "," + MAX_ROWS;

        console.log("fullquery ===> ", fullquery);

        return db.query(fullquery, function (err, pageRows) {
            if (err) {
                console.log(err);
            } else {
                db.query('select FOUND_ROWS()', function (err, allRows) {
                    callback(err, pageRows, allRows, MAX_ROWS);
                })
            }
        });
    }
};

module.exports = Film;