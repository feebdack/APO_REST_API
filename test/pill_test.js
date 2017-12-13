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

//API Version Variable - All requests should route to version 1 of the api
var v1 = '/api/1'

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
            request(app).get(v1+'/pill/'+test_data.single_pill.pillID).end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('Should return a non-empty array object', function (done) {
            request(app).get(v1+'/pill/'+test_data.single_pill.pillID).end(function (err, res) {
                expect(res.body).to.be.an('array');
                expect(res.body).to.not.be.empty;
                done();
            });
        });
        it('Should have correct pill data', function (done) {
            request(app).get(v1+'/pill/'+test_data.single_pill.pillID).end(function (err, res) {
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
    describe('#GET /Pill/search? Query Tests', function () {
            //Add test pill before each test
            beforeEach(function(done){
                for(var i = 0; i<2 ;i++){
                    var new_pill = new Pill(test_data.two_pills[i]);
                    new_pill.save(function(err,created){
                        if(err){throw err;}
                    })
                }
                return done();
            });
    
            //Remove all pill data before each test
            afterEach(function(done){
                Pill.remove({},function(err){
                    if(err){throw err;}
                    return done();
                })
            });
        it('Should return pill when searching for medicine_name',function(done){
            request(app).get(v1+'/pill/search?medicine_name='+test_data.two_pills[1].medicine_name.replace(" ","+")).end(function (err, res) {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(1);
                expect(res.body[0].medicine_name).to.contain(test_data.two_pills[1].medicine_name);
                done();
            });
        });
        it('Should return both pills with partial match of medecine name',function(done){
            request(app).get(v1+'/pill/search?medicine_name='+test_data.two_pills[0].medicine_name.replace(" ","+")).end(function (err, res) {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(2);
                expect(res.body[0].medicine_name).to.equal(test_data.two_pills[0].medicine_name);
                expect(res.body[1].medicine_name).to.equal(test_data.two_pills[1].medicine_name);
                done();
            });
        });
    });
});