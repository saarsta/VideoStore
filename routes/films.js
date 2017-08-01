var express = require('express');
var Film = require('../models/film');
var SearchLog = require('../models/searchLog');
var router = express.Router();

/* GET films listing. */
router.get('/:id', function (req, res, next) {
    var film_id = req.params.id;

    if (film_id > 0) {
        Film.getFilmById(req.params.id, function (err, rows) {
            if (err) {
                next(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        next('route');
    }
});

router.get('/', function (req, res, next) {
    Film.getAllFilms(function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/search', function (req, res, next) {
    var data = req.query;

    Film.getFilmsByAttrs(data, function (err, rows, allRows, maxRowsInPage) {
        //log search to log table when it is not a paging request
        if (!data.page) {
            var sLog = convertToSearchLog(data);

            SearchLog.addLog(sLog.searchTypes, sLog.searchValues, allRows[0]['FOUND_ROWS()'], function (err, data) {
                if (err) {
                    next(err);
                } else {
                    SearchLog.getLogById(data.insertId, function (err, log) {
                        if (err) {
                            next(err);
                        } else {
                            res.json({rows: rows, allRows: allRows, log: log, maxRowsInPage: maxRowsInPage});
                        }
                    });
                }
            })
        } else {
            res.json({rows: rows, allRows: allRows});
        }
    });
});

var convertToSearchLog = function (filmQuery) {
    var types = ['title', 'description'];
    var typeList = [ 'category', 'actor', 'language'];

    var searchTypes = [];
    var searchValues = [];
    var typeName;

    types.forEach(function (type) {
        if (filmQuery[type] !== "") {
            searchTypes.push(type);
            searchValues.push(filmQuery[type]);
        }
    });

    typeList.forEach(function (type) {
        typeName = type + "Name";
        if (filmQuery[typeName]) {
            searchTypes.push(type);
            searchValues.push(filmQuery[typeName]);
        }
    });

    return {"searchTypes": searchTypes, "searchValues": searchValues};
};

module.exports = router;
