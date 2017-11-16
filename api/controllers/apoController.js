'use strict';

var defined_messages = require('../resources/controller_strings.js')

var mongoose = require('../models'),
  Pill = mongoose.model('Pills'),
  User = mongoose.model('Users');

  // The following functions take in requests and response pointers which are used
  // to handle incomming requests. Each function is designed to handle specific requests


  /*
    read_pill: will find matching pill in database based on either the pillID or 
                the http query parameters.
    Parameters:
        pillID - Optional. Unique identifier for a specific pillID.
        query - Optional. Used to search specific parameters of a pill.
  */
exports.read_pill = function(req, res) {
    //Add pillID to the query parameters if it exists
    if(req.params.pillID != 'search')
        req.query.pillID = req.params.pillID
    
    //Increment user search count
    if(req.headers.userid != null){
        User.findOne({'userID' : req.headers.userid},function(err,user_data){
            if(err){throw err;}
            user_data.add_recent_search(req.params.pillID);
        });
    }
    //Search for pills
    Pill.find(req.query, function(err, pillData) {
        if (err) {res.send(err);}
        res.json(pillData);
    });
};

/*
find_user
*/
exports.find_user = function(req,res){
    if(req.body.userID == null){
        res.status(400);
        res.json(defined_messages.userID_field_missing);
        res.send();
        return;
    }
    User.findOne({userID: req.body.userID},function(err,userData){
        if(err){res.send(err);}
        if(userData == null){
            res.status(404)
            res.json(defined_messages.user_not_found); 
        }else{
            res.json(userData);
        }
        res.send()
    });
};

exports.create_user = function(req,res){
    User.find({userID: req.body.userID},function(err,userData){
        if(err){res.send(err);}
        else{
            if(userData.length === 0){
                var new_user = new User();
                new_user.userID = req.body.userID;
                new_user.save(function(err,created_user){
                    if (err){
                        res.send(err);
                    }else {
                        res.status(201);
                        res.json(created_user)
                        //console.log("User Created.")
                    }
                });
            }else{
                res.status(409)
                res.json(defined_messages.create_user_conflict)
            }
        }
    })
    
    
};