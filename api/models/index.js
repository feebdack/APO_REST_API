'use strict'
var mongoose = require('mongoose'),
    config = require('../../config'),
    model = require('./apoModel');

//Establish connection
mongoose.Promise = global.Promise;
mongoose.connect(config.db,{useMongoClient: true});

//Register Schema
mongoose.model('Pills',model.pill);
mongoose.model('Users',model.user);

//Export mongoose variable
module.exports = mongoose;
module.exports.pill = mongoose.model('Pills');

//Event Handlers
mongoose.connection.on("connected",function(){
    console.log("Connection to " + config.db + " established succesfully");
});

mongoose.connection.on('error',function(err){
    console.log("DB ERROR: " + err);
});

mongoose.connection.on('disconnected',function(){
    console.log('DB disconnected');
    process.exit();
});

mongoose.model('Pills').on("index",function(err){
    if(err){throw err;}
    console.log("Indexes finished building");
});

process.on('SIGINT',function(){
    console.log('Termination called.')
    mongoose.connection.close(function(){
        process.exit();
    });
});