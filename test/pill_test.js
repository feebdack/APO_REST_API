'use strict'

var app = require('../server');
var chai = require('chai');
var request = require('supertest');
var controller = require('../api/controllers/apoController');
var api = request('http://localhost:4100');
var mongoose = require('mongoose');
var Pill = mongoose.model('Pills');
var test_data = require('./test_data');

var expect = chai.expect;

describe('Pill Endpoint_Tests', function () {

    describe('#GET /Pill/'+test_data.single_pill.pillID, function () {
        //Add test pill before each test
        beforeEach(function(done){
            var new_pill = new Pill(test_data.single_pill);
            new_pill.save(function(err,created){
                if(err){throw err;}
                return done();
            })
        });

        //Remove all pill data before each test
        afterEach(function(done){
            Pill.remove({},function(err){
                if(err){throw err;}
                return done();
            })
        });

        it('Should return status 200', function (done) {
            request(app).get('/pill/'+test_data.single_pill.pillID).end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('Should return a non-empty array object', function (done) {
            request(app).get('/pill/'+test_data.single_pill.pillID).end(function (err, res) {
                expect(res.body).to.be.an('array');
                expect(res.body).to.not.be.empty;
                done();
            });
        });
        it('Should have correct pill data', function (done) {
            request(app).get('/pill/'+test_data.single_pill.pillID).end(function (err, res) {
                var ref_data = test_data.single_pill;
                var response = res.body[0];
                expect(response.pillID).to.equal(ref_data.pillID);
                expect(response.shape).to.equal(ref_data.shape);
                expect(response.rxstring).to.equal(ref_data.rxstring);
                expect(response.product_code).to.equal(ref_data.product_code);
                expect(response.medicine_name).to.equal(ref_data.medicine_name);
                expect(response.equal_product_code).to.equal(ref_data.equal_product_code);
                expect(response.dea_schedule).to.equal(ref_data.dea_schedule);
                expect(response.splimage).to.equal(ref_data.splimage);
                expect(response.inactive_ingredient).to.be.an('array');
                expect(response.active_ingredient).to.be.an('array');
                expect(response.color).to.be.an('array');
                expect(response.imprint).to.be.an('array');
                done();
            });
        });
    });
});