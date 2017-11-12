'use strict';
var express = require('express');
var apoController = require('../controllers/apoController');

// this function determines which apoControllers functions will handle the incomming
// http requests.
module.exports = function(app) {

    // available api routers
    var v1 = express.Router();

    // api version 1 projectList Routes
    v1.use('/pill',express.Router()
        .get('/:pillID', apoController.read_pill)
    );

    //api version 1 Handle user endpoints
    v1.use('/user',express.Router()
        .get('/',apoController.find_user)
        .post('/',apoController.create_user)
    );

    //Determine which version router to use
    app.use('/api/1',v1);

};