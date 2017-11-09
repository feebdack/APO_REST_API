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

var defined_messages = require('../api/resources/controller_strings.js');

var expect = chai.expect;

describe('User - endpoint integrity pre-checks',function(){
    it('#GET /user/ should return error when user does not exist',function(done){
        request(app).get('/user/').send({'userID':'non-existing_user23'}).end(function(err,res){
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.contain(defined_messages.user_not_found);
            done();
        });
    });

    it('#GET /user/ should return error if userID param not passed in',function(done){
        request(app).get('/user/').end(function(err,res){
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.contain(defined_messages.userID_field_missing);
            done();
        });
    });
});

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
                expect(res.body).to.equal(defined_messages.create_user_conflict);
                done();
            })
        });
    });
});

// Requesting an existing user should return user's recent searches
describe('#GET /user/ functionality',function(){
    //Create user with fresh data after each test
    beforeEach(function(done){
        var user_with_searches = new Users(test_data.user_with_searches);
        user_with_searches.save(function(err,user){
            if(err){throw err;}
            var user_without_searches = new Users(test_data.user);
            user_without_searches.save(function(err2,user2){
                if(err){throw err;}
                return done();
            });
        });
        
    });
    //Remove all user info after each test
    afterEach(function(done){
        Users.remove({},function(err){
            if(err){throw err;}
            done();
        })
    });

    it('should return recent searches',function(done){
        var user_req = {'userID':test_data.user_with_searches.userID}
        request(app).get('/user/').send(user_req).end(function(err,res){
            expect(res.statusCode).to.equal(200);
            expect(res.body.recent_search).to.be.an('array');
            for(var i = 0; i< test_data.user_with_searches.recent_search.length;i++){
                expect(res.body.recent_search).to.contain(test_data.user_with_searches.recent_search[i]);
            }
            done();
            
        });
    });

    it('should default search_count to zero when created',function(done){
        Users.findOne({'userID':test_data.user.userID},function(err,user){
            if(err){throw err;}
            expect(user.search_count).to.be.a('number');
            expect(user.search_count).to.equal(0);
            done();
        });
    });

    it('should increment when a pill search is made',function(done){
        request(app).get('/pill/'+test_data.single_pill.pillID).set('userid',test_data.user.userID).end(function(err,res){
            expect(res.statusCode).to.equal(200);
            Users.findOne({'userID':test_data.user.userID},function(err,user){
                if(err){throw err;}
                expect(user.search_count).to.be.a('number');
                expect(user.search_count).to.equal(1);
                done();
            });
        });
    });
});