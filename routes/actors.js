var express = require('express');
var Actor = require('../models/actor');
var router = express.Router();

/* GET categories listing. */
router.get('/:id', function (req, res, next) {
    var actor_id = req.params.id;

    if (actor_id > 0) {
        Actor.getActorById(actor_id, function (err, rows) {
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
    Actor.getAllActors(function (err, rows) {
        if (err) {
            next(err);
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
