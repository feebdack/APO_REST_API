'use strict'

var config = require('../config');

var app = require('../server');
var chai = require('chai');
var request = require('supertest');
var controller = require('../api/controllers/apoController');
var api = request('http://localhost:4100');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Pills = mongoose.model('Pills');

var expect = chai.expect;

before(function (done) {
    function clearCollections() {
        Users.remove(function () { });
        Pills.remove({},function(err){
            if(err){throw err;}
            return done();
        });
        
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db, function (err) {
            if (err) throw err;
            return clearCollections();
        });
    } else {
        return clearCollections();
    }
});