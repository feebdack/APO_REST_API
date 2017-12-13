'use strict';

var defined_messages = require('../resources/controller_strings.js')

var mongoose = require('../models'),
  Pill = mongoose.model('Pills'),
  User = mongoose.model('Users');

var perPage = 10;

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
    //Page query parameter introduced in v2 should not exist in this function
    if(req.query.page != undefined){
        delete req.query['page'];
        res.send("ERROR: page requests should use API 2.\nex\nhttp://host/api/2/pill/search?page=x...");
    }

    //Add pillID to the query parameters if it exists
    if(req.params.pillID != 'search'){
        req.query.pillID = req.params.pillID
    }else{
        //Prepares the query to make sure partial strings work
        for( const key of Object.keys(req.query)){
            req.query[key] = {"$regex":req.query[key],'$options':'i'};
        }
    }
    
    //Increment user search count
    if(req.headers.userid != null && req.params.pillID != 'search'){
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
    read_pill_v2: will find matching pill in database.
            responses are returned in pages of size perPage
  */
  exports.read_pill_v2 = function(req, res) {
    
    //Handle pages
    var page = 1;
    if(req.query.page != undefined){
        page = req.query.page;
        delete req.query['page'];
    }
    //The following creates a deep copy of the original contents. prevents reference copy
    var requested_query = JSON.parse(JSON.stringify(req.query));
    //Add pillID to the query parameters if we are searching for an exact pill
    if(req.params.pillID != 'search'){
        req.query.pillID = req.params.pillID
    }else{
        //Prepares the query to make sure partial strings work
        for( const key of Object.keys(req.query)){
            req.query[key] = {"$regex":req.query[key],'$options':'i'};
        }
    }
    
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
        var prepared_response = {"search:":requested_query,"page":page,"results":pillData};
        res.json(prepared_response);
    })
    .limit(perPage)
    .skip(perPage * (page - 1));
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