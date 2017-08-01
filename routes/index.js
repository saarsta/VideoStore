var express = require('express');
var router = express.Router();
var connection = require('../dbconnection');

/* GET home page. */
router.get('/', function (req, res, next) {
    connection.query("SELECT * FROM actor", function (err, rows, fields) {
        if (err) {
            console.log(err)
        } else {
            console.log("rows.length ====>", rows.length);
        }
    });

    res.render('index', {title: 'Express'});
});

module.exports = router;
