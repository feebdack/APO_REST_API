var config = require('./config');

var express = require('express'),
    app = express(),
    port = config.port || 80;

    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    Pill = require('./api/models/apoModel');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db,{ useMongoClient: true });

    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());

    var routes = require('./api/routes/apoRoutes');
    routes(app);

    app.listen(config.port);

    console.log("APO REST API started on: " + config.port);

    module.exports = app;
