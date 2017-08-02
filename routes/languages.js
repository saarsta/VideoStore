var express = require('express');
var Language = require('../models/language');
var router = express.Router();

/* GET categories listing. */
router.get('/:id', function (req, res, next) {
    var language_id = req.params.id;

    if (language_id) {
        Language.getLanguageById(language_id, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        next('route')
    }
});

router.get('/', function (req, res, next) {
    Language.getAllLanguages(function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
