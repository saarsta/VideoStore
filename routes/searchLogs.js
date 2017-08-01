var express = require('express');
var SearchLog = require('../models/searchLog')
var router = express.Router();

module.exports = router;

router.get('/:id', function(req, res, next) {
  var log_id = req.params.id;

  if(log_id > 0) {
    SearchLog.getLogById(log_id, function(err, rows) {
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

router.get('/', function(req, res, next) {
  SearchLog.getAllLogs(function(err,rows){
    if(err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});



module.exports = router;
