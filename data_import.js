'use strict';
console.log("-----Pill Data Importer-----");

//Required Modules
    var progress_bar = require('progress');
    var tsv = require('node-tsv-json');

//Database variables
    var mongoose = require('mongoose'),
    Pill = require('./api/models/apoModel');
//Location of the TSV file being imported
var import_tsv = {input:"data/pillbox_201605.txt"};


//Connect to database
    var dbURI = 'mongodb://127.0.0.1/apo_dev';    
    mongoose.Promise = global.Promise;
    mongoose.connect(dbURI,{useMongoClient:true});

//Databse Events Handlers

    Pill.on("index",function(err){
        if(err){throw err;}
        console.log("Indexes for data_import finished building.");
    })
    mongoose.connection.on("connected",function(){
        var importer = require('./data_import')
        console.log("Connection to " + dbURI + " established succesfully.");
        
        //Make sure environment is dev for import
        if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production')
            importer.read_tsv_file(import_tsv);
    });

    mongoose.connection.on('error',function(err){
        console.log("DB ERROR: " + err);
    });

    mongoose.connection.on('disconnected',function(){
        console.log('DB DISCONNECTED.');
        process.exit();
    });

    process.on('SIGINT',function(){
        console.log('Termination called.')
        mongoose.connection.close(function(){
            process.exit();
        });
    });


//Progress Bar Variables
//Ubar and Pbar contain the progress bar objects
//pbar_length contains the number of ticks needed to complete the progress bar
    var ubar,pbar;
    var pbar_length = 0;


//Location of the TSV file being imported
    var tsv_file = {input:"data/pillbox_201605.txt"};
    //var tsv_file = {input: "data/Five_Entry_Pill.txt"};
exports.set_tsv_file = function(fileLocation){
    if(typeof fileLocation != 'string'){
        throw 'File location must be of type string';
    }else{
        tsv_file = fileLocation;
    }
}

//read_tsv_file initializes the data import.
//This function will create JSON objects out of the tsv_file contents.
exports.read_tsv_file = function(file){
    console.log("reading tsv");
    if(!mongoose.connection.readyState){
        throw 'database is not ready';
    }else{
        //Parse the TSV file, and return as json_array
        tsv(file,function(err,result_json){
            var saver = require('./data_import')
            if(err){
                throw error;
            }else{
            console.log("TSV File Read");
            pbar_length = result_json.length;
            saver.format_json_pill_attributes(result_json);
            }
        });
    }
}


//Extracts needed data from imported pill data, and creates new JSON
//objects containing only the necessary pill information.
exports.format_json_pill_attributes = function(input){
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

        this.save_formated_json_pill_to_db(new_pill);
        
        //Increment the progress bar, and render the progress bar
        pbar.tick();
        pbar.render();
    }
};

//Creates or updates database with incoming JSON object.
//input_json_pill needs to be formated according to pill schema located at api/models/apoModel.js
exports.save_formated_json_pill_to_db = function(input_json_pill){

    //Progress bar for completed database saves
    if(ubar == null)
        {ubar = new progress_bar('[:bar] :percent :current/:total queries',{
            complete: '=',
            incomplete: ' ',
            width: 50,
            renderThrottle: 100,
            total:pbar_length,
            //This function ends the data import.
            callback:function(){
                var importer = require('./data_import');
                importer.end_data_import();
            }
            }
        )}

    //Update entries, save if non-existing
        Pill.findOneAndUpdate({pillID:input_json_pill.pillID},input_json_pill,{upsert:true},function(err,result){
            if(err){throw err}
            else{
                //Update progress bar
                ubar.tick();
                ubar.render();
            }
        });
}

exports.end_data_import = function(){
    console.log("Import Complete");
    mongoose.connection.close(function(){
        process.exit();
    });
}
