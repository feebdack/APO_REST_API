'use strict';


var mongoose = require('mongoose'),
  Pill = mongoose.model('Pills'),
  User = mongoose.model('Users');

exports.read_pill = function(req, res) {
    //Add pillID to the query parameters
    if(req.params.pillID != 'search')
        req.query.pillID = req.params.pillID
    console.log(req.query);
    //Search for pills
    Pill.find(req.query, function(err, pillData) {
    if (err) {res.send(err);}
    res.json(pillData);
    });
};

exports.find_user = function(req,res){
    User.find({userID: req.params.userID},function(err,userData){
        if(err)
            res.send(err);
        res.json(userData);
    });
};

exports.create_user = function(req,res){
    var new_user = new User(req.body);
    new_user.save(function(err,created_user){
        if (err){
            res.send(err);
        }else {
            res.json(created_user);
            console.log("User Created.");
        }
    });
};