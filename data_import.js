//@ts-check
'use strict';
console.log("-----Pill Data Importer-----");

//Required Modules used by this program
var progress_bar = require('progress')
    , tsv = require('node-tsv-json')
    , mongoose = require('./api/models')
    , Pill = mongoose.model('Pills');

/** Variable to hold the location of the tsv file of pill data that needs to be imported
 * @type {{input: string}}
 */
//var tsv_location = { input: "data/Five_Entry_Pill.txt" };
var tsv_location = { input: "data/pillbox_201605.txt" };

/**
 * Array of formatted json pills. Used as a FIFO queue
 */
var json_pill_queue = new Array();

/**
 * This variable determines the maximum number of save requests that will be sent to the database at one time
 */
var max_db_requests = 500;

/**
 * Total number of db requests currently sent out
 */
var current_db_requests = 0;

/**
 * False: When all necessary variable for data import are not set.
 * True: When all necessary variables for data import are set
 */
var import_ready = false

/**
 * pbar: Object containing the tsv to json conversion progress
 * ubar: Object containing the database save progress
 * pbar_lenght: the number of pills being imported
 */
var ubar, pbar
    , pbar_length = 0;

var queue_pill = function (input_pill) {
    json_pill_queue.push(input_pill);
    attempt_db_request();
}

/**
 * Save db request if max number of requests arent sent out.
 */
var attempt_db_request = function () {
    while (json_pill_queue.length > 0 && current_db_requests < max_db_requests) {
        //Increment the number of db requests
        current_db_requests++;
        save_to_db(json_pill_queue.shift());
    }
}



/** This function takes in a string and sets it as the location for the file to be read
 * @param {string} fileLocation 
 */
exports.set_tsv_location = function (fileLocation) {
    if (typeof fileLocation != 'string') {
        throw 'File location must be of type string';
    } else {
        this.tsv_location = fileLocation;
    }
}

exports.set_max_db_requests = function(max_requests){
    if(typeof max_requests != 'number'){
        throw 'Input should be a number'
    }else{
        this.max_db_requests = max_requests;
    }
}

/** 
 * Begins the import process by reading the tsv file at tsv_location
 */
exports.start = function () {
    if (mongoose.connection.readyState != 1) { // 1 == connected
        if (tsv_location.length < 1) {
            throw 'tsv file location not set.  Use set_tsv_location to set the tsv file name/location.';
        }
    }
    this.read_tsv_file(tsv_location);
}

/**
 * read_tsv_file initializes the data import. This function will create a JSON array of all the pill data
 */
exports.read_tsv_file = function (file) {
    console.log("reading tsv");
    if (!mongoose.connection.readyState) {
        throw 'database is not ready';
    } else {
        //Parse the TSV file, and return as json_array
        tsv(file, function (err, result_json) {
            var saver = require('./data_import')
            if (err) {
                throw err;
            } else {
                //Progress bar for completion
                pbar = new progress_bar('[:bar] :percent', {
                    complete: '=',
                    incomplete: ' ',
                    width: 50,
                    total: result_json.length
                });

                pbar_length = result_json.length;

                //Loop through all objects, creating schema objects of all JSON pill objects
                for (var i = 0; i < result_json.length; i++) {
                    var pill_obj = result_json[i];

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
                        medicine_name: pill_obj.medicine_name,
                        equal_product_code: pill_obj.equal_product_code,
                        dea_schedule: pill_obj.dea_schedule_name,
                        splimage: pill_obj.splimage
                    }

                    //Increment the progress bar, and render the progress bar
                    pbar.tick();
                    pbar.render();

                    //Add pill to queue of json pills
                    //json_pill_queue.push(new_pill);
                    queue_pill(new_pill);
                }
            }
        });
    }
}

//Creates or updates database with incoming JSON object.
//input_json_pill needs to be formated according to pill schema located at api/models/apoModel.js
/**Creates or updates database with the input JSON pill. The input JSON pill should be formatted according the the schema located at api/models/apoModel.js
 * @param {JSON} input_json_pill 
 */
var save_to_db = function (input_json_pill) {

    //Progress bar for completed database saves
    if (ubar == null) {
        ubar = new progress_bar('[:bar] :percent :current/:total queries', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            renderThrottle: 100,
            total: pbar_length,
            //This function ends the data import.
            callback: function () {
                var importer = require('./data_import');
                importer.end_data_import();
            }
        }
        )
    }

    //Update entries, save if non-existing
    Pill.findOneAndUpdate({ pillID: input_json_pill.pillID }, input_json_pill, { upsert: true }, function (err, result) {
        if (err) { throw err }
        else {
            //Update progress bar
            current_db_requests--;
            attempt_db_request();
            ubar.tick();
            ubar.render();
        }
    });
}

exports.end_data_import = function () {
    console.log("Import Complete");
    mongoose.connection.close(function () {
        process.exit();
    });
}

this.start();