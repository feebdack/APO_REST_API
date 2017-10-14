'use strict';

module.exports = function(app) {
  var apoController = require('../controllers/apoController');


  // projectList Routes
    app.route('/pill/:pillID')
        .get(apoController.read_pill);
    
    app.route('/user/:userID')
        .get(apoController.find_user)
        .post(apoController.create_user);

};