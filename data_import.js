'use strict';
console.log("Data Import Started.");

var progress_bar = require('progress');
var tsv = require('node-tsv-json');

//Database
var mongoose = require('mongoose'),
    Pill = require('./api/models/apoModel');

var dboption = {
    useMongoClient:true
};

var dbURI = 'mongodb://127.0.0.1/apo_dev';

//Databse Connection Events Handlers
mongoose.connection.on("connected",function(){
    var importer = require('./data_import')
    console.log("Connection to " + dbURI + " established succesfully.");
    importer.start_import();
});

mongoose.connection.on('error',function(err){
    console.log("DB ERROR: " + err);
});

mongoose.connection.on('disconnected',function(){
    console.log('DB CONNECTION LOST.');
    process.exit();
});

process.on('SIGINT',function(){
    console.log('Termination called.')
    mongoose.connection.close(function(){
        console.log('Connection closed.');
        process.exit();
    });
});

mongoose.Promise = global.Promise;
mongoose.connect(dbURI,{useMongoClient:true});


//Progress Bar Variables
//Ubar and Pbar contain the progress bar objects
//pbar_length contains the number of ticks needed to complete the progress bar
var ubar,pbar;
var pbar_length = 0;

//DEPRICATE:options for the tsv-json parser
//var tsv_file = {input: "data/Single_Entry_Pill.txt"};

//Location of the TSV file being imported
var tsv_file = {input:"data/pillbox_201605.txt"};

exports.start_import = function(){
    //Parse the TSV file, and return as json_array
    tsv(tsv_file,function(err,result_json){
        var saver = require('./data_import')
        if(err){
            console.log(error);
        }
        console.log("TSV File Read");
        pbar_length = result_json.length;
        saver.save_json_array(result_json);
    });
}


//Prepares JSON object into Pill Schema format
exports.save_json_array = function(input){
    console.log('Processing ' + input.length + ' entries');
    
    //Progress bar for completion
    pbar= new progress_bar('[:bar] :percent',{
        complete: '=',
        incomplete: ' ',
        width: 50,
        total:input.length,
        callback:function(){console.log("Waiting for DB connection..");}
    });
    this.pbar_length = input.length;

    //Loop through all objects, creating schema objects of all JSON pill objects
    for(var i = 0; i<input.length; i++){
        var pill_obj = input[i];

        //JSON array of active ingredients and quantities
        //Parses through ingredients list, creating array of ingredients
        var active_ingredients_strings = pill_obj.spl_strength.split(";");
        var active_ingredients = JSON.stringify(active_ingredients_strings);

        //Json array of inactive ingredients
        var inactive_ingredient_strings = pill_obj.spl_inactive_ing_new.split(";");
        var inactive_ingredients = JSON.stringify(inactive_ingredient_strings);

        //Create a JSON object with only the necessary elements
        var new_pill = {
            pillID: parseInt(pill_obj.ID),
            setid: pill_obj.setid,
            shape: pill_obj.splshape_text.split(" ")[0],
            imprint: pill_obj.splimprint_new.split(";"),
            color: pill_obj.splcolor_text.split(" ")[0].split(";"),
            active_ingredient: pill_obj.spl_strength.split(";"),
            inactive_ingredient: pill_obj.spl_inactive_ing_new.split(";"),
            rxString: pill_obj.rxString_new || pill_obj.rxString,
            product_code: pill_obj.product_code,
            medicine_name:pill_obj.medicine_name,
            equal_product_code:pill_obj.equal_product_code,
            dea_schedule:pill_obj.dea_schedule_name,
            splimage:pill_obj.splimage
        }

        this.add_json_pill_to_db(new_pill);
        
        //Increment the progress bar, and render the progress bar
        pbar.tick();
        pbar.render();
    }
};

//Creates or updates database with incoming JSON object.
//input_json_pill needs to be formated according to pill schema located at api/models/apoModel.js
exports.add_json_pill_to_db = function(input_json_pill){

    //Progress bar for completed database saves
    if(ubar == null)
        {ubar = new progress_bar('[:bar] :percent :current/:total queries',{
            complete: '=',
            incomplete: ' ',
            width: 50,
            renderThrottle: 100,
            total:pbar_length,
            callback:function(){
                console.log('Import complete.')
                mongoose.connection.close(function(){
                    console.log('DB Connection Closed');
                    process.exit();
                });
            }
            }
        )}

    //Update entries, save if non-existing
        Pill.findOneAndUpdate({pillID:input_json_pill.pillID},input_json_pill,{upsert:true},function(err,result){
            if(err){throw err}
            else{
                ubar.tick();
                ubar.render();
            }
        });

}
