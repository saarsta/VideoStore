var express = require('express');
var Category = require('../models/category');
var router = express.Router();

/* GET categories listing. */
router.get('/:id', function (req, res, next) {
    var category_id = req.params.id;

    if (category_id > 0) {
        Category.getCategoryById(category_id, function (err, rows) {
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
    Category.getAllCategories(function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
