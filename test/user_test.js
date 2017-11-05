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
var test_data = require('./test_data');

var expect = chai.expect;


describe('User - Single and Duplicate Post Checks', function () {
    describe('#POST /user/ new_user', function () {
        it('Should return 201 and success', function (done) {
            request(app).post('/user/').send(test_data.user).end(function (err, res) {
                expect(res.statusCode).to.equal(201);
                expect(res.body.userID).to.be.a('string');
                done();
            });
        });
    });
    describe('#POST /user/ duplicate entry',function(){
        it('should prevent duplicate entry',function(done){
            request(app).post('/user/').send(test_data.user).end(function(err,res){
                expect(res.statusCode).to.equal(409);
                expect(res.body).to.equal('User Exists');
                done();
            })
        });
    });
    //Test user find function
});