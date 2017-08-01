var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'saarsta',
    database: 'sakila'
});

module.exports = connection;

