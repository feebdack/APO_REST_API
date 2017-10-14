var express = require('express'),
    app = express(),
    port = process.env.PORT || 80;

    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    Pill = require('./api/models/apoModel');

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/db',{ useMongoClient: true });

    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());

    var routes = require('./api/routes/apoRoutes');
    routes(app);

    app.listen(port);

    console.log("APO REST API started on: " + port);

    module.exports = app;
