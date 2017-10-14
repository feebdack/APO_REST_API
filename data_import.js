'use strict';
console.log("Data Import Started.");
//var mongoose = require('mongoose'),
//    Pill = mongoose.model('Pills');

//var fs = require('fs');
var tsv = require('node-tsv-json');

var option = {input: "data/Five_Entry_Pill.txt", output:"/data/output.json"}
//var stream = fs.createReadStream(__dirname + '/data/Single_Entry_Pill.txt');
var that = this;
var json;
var save = function(input){
    json = input;
}

this.tsv(option,function(err,result){
    if(err){
        console.log(error);
    }else{
        //console.log(result);
        that.save(result);
    }
})
console.log(json);