'use strict';

module.exports = function(app) {
  var apoController = require('../controllers/apoController');


  // projectList Routes
    app.route('/pill/:pillID')
        .get(apoController.read_pill);
        
};