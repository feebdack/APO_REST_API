'use strict'

var app = require('../server');
var chai = require('chai');
var request = require('supertest');
var controller = require('../api/controllers/apoController');
var api = request('http://localhost:4100');

var expect = chai.expect;

describe('Endpoint_Tests', function() {
    describe('#GET /Pill/4324', function() {
        it('Should return status 200',function(done){
            request(app).get('/pill/4324').end(function(err,res){
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('Should return an array object',function(done){
            request(app).get('/pill/4324').end(function(err,res){
                expect(res.body).to.be.an('array');
                done();
            });
        });
        it('Should not be an empty array',function(done){
            request(app).get('/pill/4324').end(function(err,res){
                expect(res.body).to.not.be.empty;
                done();
            });
        });
    });
});