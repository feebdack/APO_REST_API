var config = require('./config');

var express = require('express'),
    app = express(),
    port = config.port || 80,
    //mongoose = require('mongoose'),
    mongoose = require('./api/models'),
    bodyParser = require('body-parser'),
    routes = require('./api/routes/apoRoutes');

    //Any time any route is called, the folowing functions are executed on the request.
    //the following two function parse through incoming data. Since incomming data is
    //received as stream of data.

    //urlencoded will parse through x-www-form-urlencoded data
    app.use(bodyParser.urlencoded({ extended: true}));
    //json will parse through application/json data
    app.use(bodyParser.json());

    routes(app);

    app.listen(config.port);

    

    module.exports = app;

    mongoose.connection.on('connected',function(){
        console.log("APO REST API started on: " + config.port);
    });