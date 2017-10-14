'use strict';
console.log("Data Import Started.");
//var mongoose = require('mongoose'),
//    Pill = mongoose.model('Pills');

//var fs = require('fs');
var tsv = require('node-tsv-json');

var option = {input: "data/Single_Entry_Pill.txt", output:"data/output.json"}
//var stream = fs.createReadStream(__dirname + '/data/Single_Entry_Pill.txt');
var that = this;
var json;

exports.save_json = function(input){
    json = input;
    console.log(json)
}

tsv(option,function(err,result){
    var saver = require('./data_import')
    if(err){
        console.log(error);
    }else{
        //console.log(result);
        saver.save_json(result);
    }
})
