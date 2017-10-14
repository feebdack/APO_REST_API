'use strict';


var mongoose = require('mongoose'),
  Pill = mongoose.model('Pills');

exports.read_pill = function(req, res) {
  Pill.findById({pillID: req.params.pillID}, function(err, project) {
    if (err)
      res.send(err);
    res.json(project);
  });
};